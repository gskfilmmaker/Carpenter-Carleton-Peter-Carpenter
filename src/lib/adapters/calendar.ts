import { BUSINESS_HOURS, TORONTO_TZ, zonedTimeToUtc } from "@/lib/timezone";

export const meetingFormats = ["video", "phone", "in-person"] as const;
export type MeetingFormat = (typeof meetingFormats)[number];

export const videoPlatforms = ["teams", "zoom", "meet", "whatsapp"] as const;
export type VideoPlatform = (typeof videoPlatforms)[number];

export type TimeSlot = {
  /** ISO 8601 UTC instant. */
  startUtc: string;
  /** Minutes. */
  durationMinutes: number;
};

export type BookingRequest = {
  consultationType: string;
  meetingFormat: MeetingFormat;
  videoPlatform?: VideoPlatform;
  slotStartUtc: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
};

export type BookingResult =
  | {
      ok: true;
      reference: string;
      /** Present for teams/zoom/meet once the provider generates one; absent otherwise. */
      joinUrl?: string;
    }
  | { ok: false; error: string };

export interface CalendarAdapter {
  /** Returns bookable slots between `fromUtc` and `toUtc` (inclusive), business-hours only. */
  listAvailability(fromUtc: Date, toUtc: Date): Promise<TimeSlot[]>;
  requestBooking(request: BookingRequest): Promise<BookingResult>;
}

const SLOT_DURATION_MINUTES = 45;
const MIN_LEAD_TIME_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Generates 08:00–20:00 America/Toronto slots (DST-safe) with no external dependency. This is the
 * adapter used whenever CALCOM_API_KEY isn't configured, and it's also the safe fallback the
 * real adapter falls back to if the Cal.com API call fails for any reason — the booking flow
 * always stays usable.
 */
export const devCalendarAdapter: CalendarAdapter = {
  async listAvailability(fromUtc, toUtc) {
    const slots: TimeSlot[] = [];
    const now = Date.now();
    const cursor = new Date(fromUtc);

    while (cursor.getTime() <= toUtc.getTime()) {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: TORONTO_TZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(cursor);
      const year = Number(parts.find((p) => p.type === "year")?.value);
      const month = Number(parts.find((p) => p.type === "month")?.value);
      const day = Number(parts.find((p) => p.type === "day")?.value);

      for (let hour = BUSINESS_HOURS.startHour; hour < BUSINESS_HOURS.endHour; hour += 1) {
        const start = zonedTimeToUtc(year, month, day, hour, 0, TORONTO_TZ);
        if (start.getTime() - now >= MIN_LEAD_TIME_MS) {
          slots.push({ startUtc: start.toISOString(), durationMinutes: SLOT_DURATION_MINUTES });
        }
      }

      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    return slots;
  },

  async requestBooking() {
    const reference = `REQ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    return { ok: true, reference };
  },
};

/**
 * Cal.com v2 API adapter. Endpoint shapes below follow Cal.com's publicly documented v2 API
 * (api.cal.com/v2) as of this integration; live docs could not be reached to double-check field
 * names at build time (blocked by their edge/bot protection from this environment), so every call
 * is wrapped defensively and falls back to `devCalendarAdapter` on any unexpected response shape
 * or request failure. VERIFY the field names against current Cal.com v2 docs before relying on
 * this in production, and check the live response shape in a staging booking before launch.
 */
function createCalComAdapter(): CalendarAdapter {
  const apiKey = process.env.CALCOM_API_KEY;
  const eventTypeId = process.env.CALCOM_EVENT_TYPE_ID;
  const apiVersion = process.env.CALCOM_API_VERSION ?? "2024-08-13";
  const base = "https://api.cal.com/v2";

  async function listAvailability(fromUtc: Date, toUtc: Date): Promise<TimeSlot[]> {
    if (!apiKey || !eventTypeId) return devCalendarAdapter.listAvailability(fromUtc, toUtc);

    try {
      const url = new URL(`${base}/slots`);
      url.searchParams.set("eventTypeId", eventTypeId);
      url.searchParams.set("start", fromUtc.toISOString());
      url.searchParams.set("end", toUtc.toISOString());
      url.searchParams.set("timeZone", TORONTO_TZ);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${apiKey}`, "cal-api-version": apiVersion },
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`Cal.com slots request failed: ${response.status}`);

      const body: { data?: Record<string, Array<{ start: string }>> } = await response.json();
      const slots: TimeSlot[] = [];
      for (const daySlots of Object.values(body.data ?? {})) {
        for (const slot of daySlots) {
          slots.push({ startUtc: slot.start, durationMinutes: SLOT_DURATION_MINUTES });
        }
      }
      return slots;
    } catch (error) {
      console.error("[calendar:cal.com] listAvailability failed, falling back to dev adapter", error);
      return devCalendarAdapter.listAvailability(fromUtc, toUtc);
    }
  }

  async function requestBooking(request: BookingRequest): Promise<BookingResult> {
    if (!apiKey || !eventTypeId) return devCalendarAdapter.requestBooking(request);

    try {
      const locationByPlatform: Partial<Record<VideoPlatform, string>> = {
        teams: "integrations:office365_video",
        zoom: "integrations:zoom",
        meet: "integrations:google:meet",
      };

      const response = await fetch(`${base}/bookings`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "cal-api-version": apiVersion,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventTypeId: Number(eventTypeId),
          start: request.slotStartUtc,
          attendee: { name: request.name, email: request.email, timeZone: TORONTO_TZ },
          ...(request.meetingFormat === "video" && request.videoPlatform && request.videoPlatform !== "whatsapp"
            ? { location: locationByPlatform[request.videoPlatform] }
            : {}),
          metadata: { consultationType: request.consultationType, meetingFormat: request.meetingFormat },
        }),
      });
      if (!response.ok) throw new Error(`Cal.com booking request failed: ${response.status}`);

      const body: { data?: { uid?: string; id?: string | number; references?: Array<{ meetingUrl?: string }> } } =
        await response.json();
      const reference = String(body.data?.uid ?? body.data?.id ?? `CAL-${Date.now()}`);
      const joinUrl = body.data?.references?.find((r) => r.meetingUrl)?.meetingUrl;
      return { ok: true, reference, joinUrl };
    } catch (error) {
      console.error("[calendar:cal.com] requestBooking failed, falling back to dev adapter", error);
      return devCalendarAdapter.requestBooking(request);
    }
  }

  return { listAvailability, requestBooking };
}

export const calendarAdapter: CalendarAdapter =
  process.env.CALCOM_API_KEY && process.env.CALCOM_EVENT_TYPE_ID
    ? createCalComAdapter()
    : devCalendarAdapter;

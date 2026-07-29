/**
 * Calendar/booking adapter interface (build brief section 6.2/8). No Calendly/Cal.com/Microsoft or
 * Google Calendar credentials exist in this environment, so booking requests are only recorded as
 * a structured enquiry — nothing is written to a real calendar yet. Swap for a real integration
 * once credentials exist, without changing the API route or form.
 */

export type BookingRequest = {
  consultationType: string;
  preferredContact: "video" | "phone" | "in-person";
  name: string;
  email: string;
  phone?: string;
  message?: string;
};

export interface CalendarAdapter {
  requestBooking(request: BookingRequest): Promise<{ ok: true; reference: string } | { ok: false; error: string }>;
}

export const devCalendarAdapter: CalendarAdapter = {
  async requestBooking() {
    const reference = `REQ-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    return { ok: true, reference };
  },
};

export const calendarAdapter: CalendarAdapter = devCalendarAdapter;

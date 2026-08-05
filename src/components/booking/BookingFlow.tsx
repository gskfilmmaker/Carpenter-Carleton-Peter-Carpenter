"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { consultationTypes } from "@/lib/validation/booking";
import type { MeetingFormat, TimeSlot, VideoPlatform } from "@/lib/adapters/calendar";
import { videoPlatforms } from "@/lib/adapters/calendar";
import { commonTimezones, formatInTimeZone, getBrowserTimeZone, TORONTO_TZ } from "@/lib/timezone";
import { feeTiers } from "@/content/fees";
import { features, site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Turnstile } from "@/components/forms/Turnstile";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { analyticsEvents, track } from "@/lib/analytics";

const typeParamMap: Record<string, (typeof consultationTypes)[number]> = {
  employer: "Employer",
  worker: "Worker",
};

const platformCopy: Record<VideoPlatform, { label: string; note: string }> = {
  teams: { label: "Microsoft Teams", note: "We'll send a Teams link with your confirmation." },
  zoom: { label: "Zoom", note: "We'll send a Zoom link with your confirmation." },
  meet: { label: "Google Meet", note: "We'll send a Google Meet link with your confirmation." },
  whatsapp: { label: "WhatsApp video", note: "We will call the number you provide at the scheduled time." },
};

const consultationFee = feeTiers.find((tier) => tier.service === "consultation");

const availableMeetingFormats: MeetingFormat[] = features.inPersonMeetings
  ? ["video", "phone", "in-person"]
  : ["video", "phone"];

const meetingFormatLabels: Record<MeetingFormat, string> = {
  video: "Video",
  phone: "Phone",
  "in-person": "In person",
};

function groupSlotsByDay(slots: TimeSlot[], timeZone: string) {
  const groups = new Map<string, TimeSlot[]>();
  for (const slot of slots) {
    const key = new Intl.DateTimeFormat("en-CA", { timeZone, dateStyle: "medium" }).format(new Date(slot.startUtc));
    const existing = groups.get(key) ?? [];
    existing.push(slot);
    groups.set(key, existing);
  }
  return Array.from(groups.entries());
}

export function BookingFlow() {
  const searchParams = useSearchParams();
  const renderedAtRef = useRef(0);

  const [step, setStep] = useState<1 | 2>(1);
  const [consultationType, setConsultationType] = useState<(typeof consultationTypes)[number]>(() => {
    const typeParam = searchParams.get("type");
    const mapped = typeParam ? typeParamMap[typeParam] : undefined;
    return mapped ?? "Individual pathway";
  });
  const [meetingFormat, setMeetingFormat] = useState<MeetingFormat>("video");
  const [videoPlatform, setVideoPlatform] = useState<VideoPlatform>("teams");

  const [slots, setSlots] = useState<TimeSlot[] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [visitorTz, setVisitorTz] = useState(() => (typeof window !== "undefined" ? getBrowserTimeZone() : TORONTO_TZ));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [serviceConsent, setServiceConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  const [stepAError, setStepAError] = useState<string | null>(null);
  const [stepBError, setStepBError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "redirecting" | "success" | "error">("idle");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    renderedAtRef.current = Date.now();
    track(analyticsEvents.beginBooking);
  }, []);

  useEffect(() => {
    if (step !== 2 || slots !== null) return;
    fetch("/api/book/availability?days=14")
      .then((res) => res.json())
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setSlots([]));
  }, [step, slots]);

  const groupedInVisitorTz = useMemo(() => (slots ? groupSlotsByDay(slots, visitorTz) : []), [slots, visitorTz]);

  function goToSchedule() {
    if (meetingFormat === "video" && !videoPlatform) {
      setStepAError("Please choose a video platform.");
      return;
    }
    setStepAError(null);
    track(analyticsEvents.selectMeetingFormat, { meetingFormat, videoPlatform: videoPlatform ?? "" });
    setStep(2);
  }

  async function submitBooking() {
    if (!selectedSlot) {
      setStepBError("Please choose a time slot.");
      return;
    }
    if (!name.trim() || !email.trim()) {
      setStepBError("Please enter your name and email.");
      return;
    }
    if (!serviceConsent) {
      setStepBError("Please confirm you consent to us contacting you about this booking.");
      return;
    }
    setStepBError(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          consultationType,
          meetingFormat,
          videoPlatform: meetingFormat === "video" ? videoPlatform : undefined,
          slotStartUtc: selectedSlot,
          visitorTimeZone: visitorTz,
          message: message || undefined,
          serviceConsent: true,
          marketingConsent,
          turnstileToken,
          renderedAt: renderedAtRef.current,
          companyWebsite: "",
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setStepBError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      if (data.checkoutUrl) {
        setStatus("redirecting");
        window.location.href = data.checkoutUrl;
        return;
      }

      setResult(data);
      setStatus("success");
      track(analyticsEvents.completeBookingRequest, { form: "book" });
    } catch {
      setStepBError("We couldn't reach the server. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success" && result) {
    return (
      <BookingConfirmation
        reference={result.reference as string}
        consultationType={result.consultationType as string}
        meetingFormat={result.meetingFormat as string}
        videoPlatform={result.videoPlatform as string}
        slotStartUtc={result.slotStartUtc as string}
        joinUrl={result.joinUrl as string | undefined}
        paid={false}
      />
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-surface p-8">
      {step === 1 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-sage">Step 1 of 2</p>
          <h2 className="mt-2 font-serif text-2xl font-normal text-ink">What kind of consultation?</h2>

          <div className="mt-6">
            <label htmlFor="consultationType" className="text-sm font-medium text-ink-soft">
              Consultation type
            </label>
            <select
              id="consultationType"
              value={consultationType}
              onChange={(e) => setConsultationType(e.target.value as (typeof consultationTypes)[number])}
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
            >
              {consultationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-medium text-ink-soft">Meeting format</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {availableMeetingFormats.map((format) => (
                <label
                  key={format}
                  className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm ${
                    meetingFormat === format ? "border-copper bg-copper/5 text-ink" : "border-line text-ink-soft"
                  }`}
                >
                  <input
                    type="radio"
                    name="meetingFormat"
                    value={format}
                    checked={meetingFormat === format}
                    onChange={() => setMeetingFormat(format)}
                    className="sr-only"
                  />
                  {meetingFormatLabels[format]}
                </label>
              ))}
            </div>
          </fieldset>

          {meetingFormat === "video" && (
            <fieldset className="mt-6">
              <legend className="text-sm font-medium text-ink-soft">Video platform</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {videoPlatforms.map((platform) => (
                  <label
                    key={platform}
                    className={`cursor-pointer rounded-xl border px-4 py-3 text-sm ${
                      videoPlatform === platform ? "border-copper bg-copper/5 text-ink" : "border-line text-ink-soft"
                    }`}
                  >
                    <input
                      type="radio"
                      name="videoPlatform"
                      value={platform}
                      checked={videoPlatform === platform}
                      onChange={() => setVideoPlatform(platform)}
                      className="sr-only"
                    />
                    <span className="font-medium">{platformCopy[platform].label}</span>
                    <span className="mt-1 block text-xs text-muted">{platformCopy[platform].note}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {stepAError && <p className="mt-4 text-sm text-danger">{stepAError}</p>}

          <div className="mt-7">
            <Button onClick={goToSchedule}>Choose a time</Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-sage">Step 2 of 2</p>
            <button type="button" onClick={() => setStep(1)} className="text-sm text-muted underline underline-offset-4">
              Back
            </button>
          </div>
          <h2 className="mt-2 font-serif text-2xl font-normal text-ink">Choose a time</h2>

          {consultationFee && (
            <p className="mt-2 text-sm text-muted">
              {consultationFee.approved && consultationFee.amount
                ? `${consultationFee.publicLabel}: ${consultationFee.currency} $${consultationFee.amount}${consultationFee.taxNote ? ` (${consultationFee.taxNote})` : ""}`
                : `${consultationFee.publicLabel} — fee confirmed in writing before any representation begins.`}
            </p>
          )}

          <div className="mt-4">
            <label htmlFor="visitorTz" className="text-sm font-medium text-ink-soft">
              Your timezone
            </label>
            <select
              id="visitorTz"
              value={visitorTz}
              onChange={(e) => setVisitorTz(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink sm:w-72"
            >
              {commonTimezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replace("_", " ")}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted">All times are also shown in Toronto time (08:00–20:00 window).</p>
          </div>

          <div className="mt-5 max-h-80 space-y-4 overflow-y-auto pr-1">
            {slots === null && <p className="text-sm text-muted">Loading available times…</p>}
            {slots !== null && slots.length === 0 && (
              <p className="text-sm text-muted">No slots available right now — please contact us directly.</p>
            )}
            {groupedInVisitorTz.map(([day, daySlots]) => (
              <div key={day}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{day}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {daySlots.map((slot) => (
                    <button
                      key={slot.startUtc}
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot.startUtc);
                        track(analyticsEvents.selectSlot);
                      }}
                      className={`rounded-lg border px-3 py-2 text-left text-xs ${
                        selectedSlot === slot.startUtc ? "border-copper bg-copper/5 text-ink" : "border-line text-ink-soft"
                      }`}
                    >
                      <span className="block font-medium">{formatInTimeZone(slot.startUtc, visitorTz)}</span>
                      <span className="block text-muted">{formatInTimeZone(slot.startUtc, TORONTO_TZ)} Toronto</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="text-sm font-medium text-ink-soft">
                Full name
              </label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
              />
            </div>
            <div>
              <label htmlFor="email" className="text-sm font-medium text-ink-soft">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="phone" className="text-sm font-medium text-ink-soft">
              Phone {meetingFormat === "video" && videoPlatform === "whatsapp" ? "(WhatsApp number)" : "(optional)"}
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="message" className="text-sm font-medium text-ink-soft">
              Anything you&rsquo;d like us to know beforehand? (optional)
            </label>
            <textarea
              id="message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
            />
            <p className="mt-1.5 text-xs text-muted">{site.sensitiveDocsNotice}</p>
          </div>

          <div className="mt-4 space-y-3 border-t border-line pt-4">
            <label className="flex items-start gap-2.5 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={serviceConsent}
                onChange={(e) => setServiceConsent(e.target.checked)}
                className="mt-1"
              />
              I consent to Carpenter &amp; Carleton contacting me about this booking. See our{" "}
              <a href="/privacy" className="underline underline-offset-2">
                privacy policy
              </a>
              .
            </label>
            <label className="flex items-start gap-2.5 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-1"
              />
              I would also like to receive the Canada Pathway Briefing by email (optional).
            </label>
          </div>

          <div className="mt-4">
            <Turnstile onVerify={setTurnstileToken} />
          </div>

          {stepBError && <p className="mt-4 text-sm text-danger">{stepBError}</p>}

          <div className="mt-6">
            <Button onClick={submitBooking} disabled={status === "submitting" || status === "redirecting"}>
              {status === "redirecting" ? "Redirecting to payment…" : status === "submitting" ? "Booking…" : "Request this time"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

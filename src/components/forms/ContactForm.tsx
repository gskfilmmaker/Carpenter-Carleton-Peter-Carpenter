"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, consultationTypes, type BookingInput } from "@/lib/validation/booking";
import { Button } from "@/components/ui/Button";
import { analyticsEvents, track } from "@/lib/analytics";

const typeParamMap: Record<string, (typeof consultationTypes)[number]> = {
  employer: "Employer",
  worker: "Worker",
};

export function ContactForm() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      consultationType: "Individual pathway",
      preferredContact: "video",
      marketingConsent: false,
      companyWebsite: "",
    },
  });

  useEffect(() => {
    const typeParam = searchParams.get("type");
    const mapped = typeParam ? typeParamMap[typeParam] : undefined;
    if (mapped) setValue("consultationType", mapped);
    track(analyticsEvents.beginBooking);
  }, [searchParams, setValue]);

  async function onSubmit(data: BookingInput) {
    setStatus("submitting");
    setServerError(null);
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) {
        setServerError(result.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setReference(result.reference);
      setStatus("success");
      track(analyticsEvents.completeBookingRequest);
    } catch {
      setServerError("We couldn't reach the server. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-line bg-surface p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage">Request received</p>
        <h2 className="mt-2 font-serif text-2xl font-normal text-ink">Thank you — we&rsquo;ll be in touch</h2>
        <p className="mt-3 text-ink-soft">
          Your reference is <strong>{reference}</strong>. We aim to respond within one business
          day. In the meantime, please do not send passports, bank statements or immigration portal
          passwords by email or through this form.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6 rounded-3xl border border-line bg-surface p-8">
      {/* Honeypot — hidden from real users, visible to bots that fill every field */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="companyWebsite">Leave this field blank</label>
        <input id="companyWebsite" type="text" tabIndex={-1} autoComplete="off" {...register("companyWebsite")} />
      </div>

      <div>
        <label htmlFor="consultationType" className="text-sm font-medium text-ink-soft">
          What kind of consultation do you need?
        </label>
        <select
          id="consultationType"
          {...register("consultationType")}
          className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
        >
          {consultationTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-ink-soft">Preferred contact method</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {(["video", "phone", "in-person"] as const).map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-ink-soft">
              <input type="radio" value={option} {...register("preferredContact")} className="accent-[var(--color-copper)]" />
              {option === "in-person" ? "In person" : option[0].toUpperCase() + option.slice(1)}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink-soft">
            Full name
          </label>
          <input
            id="name"
            type="text"
            {...register("name")}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
          />
          {errors.name && (
            <p id="name-error" className="mt-1.5 text-sm text-danger">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink-soft">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-danger">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="text-sm font-medium text-ink-soft">
          Phone (optional)
        </label>
        <input
          id="phone"
          type="tel"
          {...register("phone")}
          className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
        />
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-ink-soft">
          Tell us briefly what you&rsquo;d like to discuss (optional)
        </label>
        <textarea
          id="message"
          rows={4}
          {...register("message")}
          className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
        />
        <p className="mt-1.5 text-xs text-muted">
          Please do not send passports, bank statements, immigration portal passwords or other
          highly sensitive documents through this form.
        </p>
      </div>

      <div className="space-y-3 border-t border-line pt-5">
        <label className="flex items-start gap-2.5 text-sm text-ink-soft">
          <input type="checkbox" {...register("serviceConsent")} className="mt-1" />
          I consent to Carpenter &amp; Carleton contacting me about this enquiry.
        </label>
        {errors.serviceConsent && (
          <p className="text-sm text-danger">{errors.serviceConsent.message}</p>
        )}
        <label className="flex items-start gap-2.5 text-sm text-ink-soft">
          <input type="checkbox" {...register("marketingConsent")} className="mt-1" />
          I would also like to receive the Canada Pathway Briefing by email (optional).
        </label>
      </div>

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? "Sending…" : "Send request"}
      </Button>
    </form>
  );
}

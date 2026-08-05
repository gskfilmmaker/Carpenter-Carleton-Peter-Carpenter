"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validation/contact";
import { goalOptions, languageOptions, statusOptions, timelineOptions } from "@/content/intake-options";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Turnstile } from "@/components/forms/Turnstile";
import { analyticsEvents, track } from "@/lib/analytics";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const renderedAtRef = useRef(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      currentStatus: statusOptions[0]?.value as ContactInput["currentStatus"],
      goal: goalOptions[0]?.value as ContactInput["goal"],
      preferredLanguage: "english",
      timeline: timelineOptions[0]?.value as ContactInput["timeline"],
      marketingConsent: false,
      companyWebsite: "",
      turnstileToken: "",
    },
  });

  useEffect(() => {
    renderedAtRef.current = Date.now();
    setValue("renderedAt", renderedAtRef.current);
  }, [setValue]);

  async function onSubmit(data: ContactInput) {
    setStatus("submitting");
    setServerError(null);
    try {
      const response = await fetch("/api/contact", {
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
      setStatus("success");
      track(analyticsEvents.completeBookingRequest, { form: "contact" });
    } catch {
      setServerError("We couldn't reach the server. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-line bg-surface p-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage">Message received</p>
        <h2 className="mt-2 font-serif text-2xl font-normal text-ink">Thank you — we&rsquo;ll be in touch</h2>
        <p className="mt-3 text-ink-soft">
          We aim to respond within one business day. {site.sensitiveDocsNotice}
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

      <div className="grid gap-6 sm:grid-cols-2">
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
          <label htmlFor="countryOfResidence" className="text-sm font-medium text-ink-soft">
            Country of residence
          </label>
          <input
            id="countryOfResidence"
            type="text"
            {...register("countryOfResidence")}
            aria-invalid={Boolean(errors.countryOfResidence)}
            aria-describedby={errors.countryOfResidence ? "country-error" : undefined}
            className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
          />
          {errors.countryOfResidence && (
            <p id="country-error" className="mt-1.5 text-sm text-danger">
              {errors.countryOfResidence.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="currentStatus" className="text-sm font-medium text-ink-soft">
            Current Canadian immigration status
          </label>
          <select
            id="currentStatus"
            {...register("currentStatus")}
            className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="goal" className="text-sm font-medium text-ink-soft">
            What is your primary goal?
          </label>
          <select
            id="goal"
            {...register("goal")}
            className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
          >
            {goalOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="preferredLanguage" className="text-sm font-medium text-ink-soft">
            Preferred language for communication
          </label>
          <select
            id="preferredLanguage"
            {...register("preferredLanguage")}
            className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="timeline" className="text-sm font-medium text-ink-soft">
            Desired timeline
          </label>
          <select
            id="timeline"
            {...register("timeline")}
            className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink"
          >
            {timelineOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
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
        <p className="mt-1.5 text-xs text-muted">{site.sensitiveDocsNotice}</p>
      </div>

      <div className="space-y-3 border-t border-line pt-5">
        <label className="flex items-start gap-2.5 text-sm text-ink-soft">
          <input type="checkbox" {...register("serviceConsent")} className="mt-1" />
          I consent to Carpenter &amp; Carleton contacting me about this enquiry. See our{" "}
          <a href="/privacy" className="underline underline-offset-2">
            privacy policy
          </a>
          .
        </label>
        {errors.serviceConsent && (
          <p className="text-sm text-danger">{errors.serviceConsent.message}</p>
        )}
        <label className="flex items-start gap-2.5 text-sm text-ink-soft">
          <input type="checkbox" {...register("marketingConsent")} className="mt-1" />
          I would also like to receive the Canada Pathway Briefing by email (optional).
        </label>
      </div>

      <Turnstile onVerify={(token) => setValue("turnstileToken", token)} />

      {serverError && <p className="text-sm text-danger">{serverError}</p>}

      <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
        {status === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

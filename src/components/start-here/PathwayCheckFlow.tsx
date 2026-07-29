"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { pathwayQuestions } from "@/content/pathway-questions";
import { getServiceBySlug } from "@/content/services";
import { resolvePathwayResult, type PathwayAnswers } from "@/lib/pathway-rules";
import { analyticsEvents, track } from "@/lib/analytics";
import { Button, ButtonLink } from "@/components/ui/Button";

type Phase = "questions" | "email" | "result";

export function PathwayCheckFlow() {
  const [phase, setPhase] = useState<Phase>("questions");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<PathwayAnswers>({});
  const [email, setEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    track(analyticsEvents.startPathwayCheck);
  }, []);

  const totalQuestions = pathwayQuestions.length;
  const currentQuestion = pathwayQuestions[stepIndex];
  const currentAnswer = answers[currentQuestion?.id ?? ""];

  function selectAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }

  function goNext() {
    if (stepIndex < totalQuestions - 1) {
      setStepIndex((i) => i + 1);
    } else {
      setPhase("email");
    }
  }

  function goBack() {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    }
  }

  async function finish(withEmail: boolean) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await fetch("/api/pathway-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          email: withEmail ? email : "",
          marketingConsent: withEmail ? marketingConsent : false,
          companyWebsite: "",
        }),
      });
    } catch {
      setSubmitError("We couldn't reach the server, but here is your summary anyway.");
    } finally {
      setSubmitting(false);
      setPhase("result");
      track(analyticsEvents.completePathwayCheck);
    }
  }

  if (phase === "result") {
    const result = resolvePathwayResult(answers);
    const relatedService = getServiceBySlug(result.relatedServiceSlug);

    return (
      <div className="rounded-3xl border border-line bg-surface p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage">Your result</p>
        <h2 className="mt-2 font-serif text-2xl font-normal text-ink sm:text-3xl">{result.heading}</h2>
        <p className="mt-4 text-ink-soft">{result.body}</p>
        <p className="mt-4 text-sm text-muted">
          Recommended consultation type: <strong className="text-ink">{result.consultationType}</strong>
        </p>
        {submitError && <p className="mt-3 text-sm text-danger">{submitError}</p>}
        <div className="mt-8 flex flex-wrap gap-3.5">
          <ButtonLink href="/contact">Book a consultation</ButtonLink>
          {relatedService && (
            <>
              <ButtonLink href={relatedService.officialSources[0]?.url ?? "/resources"} variant="secondary">
                Read official source
              </ButtonLink>
              <ButtonLink href={`/services/${relatedService.slug}`} variant="tertiary">
                Download general document readiness guide
              </ButtonLink>
            </>
          )}
        </div>
        <p className="mt-6 text-xs text-muted">
          This is not an eligibility result or advice. A consultation is the right next step to
          review your facts and current program instructions.
        </p>
      </div>
    );
  }

  if (phase === "email") {
    return (
      <div className="rounded-3xl border border-line bg-surface p-8 sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-sage">Optional</p>
        <h2 className="mt-2 font-serif text-2xl font-normal text-ink">
          Send my summary to my email too?
        </h2>
        <p className="mt-3 text-sm text-muted">
          Entirely optional. Skip this if you would rather just see your summary now.
        </p>
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-ink-soft" htmlFor="pcc-email">
            Email address
          </label>
          <input
            id="pcc-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-line bg-canvas px-4 py-3 text-ink placeholder:text-muted"
          />
          <label className="flex items-start gap-2.5 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(e) => setMarketingConsent(e.target.checked)}
              className="mt-1"
            />
            I would also like to receive the Canada Pathway Briefing by email (optional, separate
            from this request).
          </label>
        </div>
        <div className="mt-7 flex flex-wrap gap-3.5">
          <Button
            onClick={() => finish(Boolean(email))}
            disabled={submitting || (email.length > 0 && !email.includes("@"))}
          >
            {submitting ? "Sending…" : email ? "Email me and show my summary" : "Show my summary"}
          </Button>
          {email && (
            <Button variant="secondary" onClick={() => finish(false)} disabled={submitting}>
              Skip and just show my summary
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-surface p-8 sm:p-10">
      <div className="flex items-center justify-between">
        <p aria-live="polite" className="text-sm font-medium text-muted">
          Question {stepIndex + 1} of {totalQuestions}
        </p>
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-sage-pale">
          <div
            className="h-full rounded-full bg-sage transition-[width] duration-300"
            style={{ width: `${((stepIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <fieldset className="mt-6">
        <legend className="font-serif text-2xl font-normal text-ink">{currentQuestion.prompt}</legend>
        {currentQuestion.helpText && (
          <p className="mt-1 text-sm text-muted">{currentQuestion.helpText}</p>
        )}
        <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
          {currentQuestion.options.map((option) => {
            const checked = currentAnswer === option.value;
            return (
              <label
                key={option.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                  checked ? "border-copper bg-copper/5 text-ink" : "border-line text-ink-soft hover:border-ink"
                }`}
              >
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option.value}
                  checked={checked}
                  onChange={() => selectAnswer(option.value)}
                  className="accent-[var(--color-copper)]"
                />
                {option.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={stepIndex === 0}
          className="text-sm font-medium text-muted underline underline-offset-4 disabled:opacity-0"
        >
          Back
        </button>
        <Button onClick={goNext} disabled={!currentAnswer}>
          {stepIndex === totalQuestions - 1 ? "Continue" : "Next"}
        </Button>
      </div>

      <p className="mt-6 text-xs text-muted">
        Your answers are used only to route you to a relevant conversation. This is educational
        routing, not an eligibility decision.{" "}
        <Link href="/resources" className="underline underline-offset-4">
          Learn what this check does and does not do.
        </Link>
      </p>
    </div>
  );
}

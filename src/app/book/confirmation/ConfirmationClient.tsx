"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { analyticsEvents, track } from "@/lib/analytics";

type SessionData = {
  ok: boolean;
  paid?: boolean;
  finalizing?: boolean;
  reference?: string;
  consultationType?: string;
  meetingFormat?: string;
  videoPlatform?: string;
  slotStartUtc?: string;
  joinUrl?: string;
  receiptUrl?: string;
  amountPaid?: number;
  currency?: string;
  error?: string;
};

const POLL_INTERVAL_MS = 2500;
const MAX_POLLS = 6;

export function ConfirmationClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [data, setData] = useState<SessionData | null>(null);
  const trackedPaid = useRef(false);
  const pollCount = useRef(0);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/book/verify-session?session_id=${encodeURIComponent(sessionId!)}`);
        const json: SessionData = await res.json();
        if (cancelled) return;
        setData(json);

        if (json.ok && json.paid && !trackedPaid.current) {
          trackedPaid.current = true;
          track(analyticsEvents.paymentSucceeded);
        }

        // While the webhook is still finalizing (join link / calendar not written yet), poll a
        // few more times so the page can pick up real details without the visitor refreshing.
        if (json.ok && json.finalizing && pollCount.current < MAX_POLLS) {
          pollCount.current += 1;
          setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch {
        if (!cancelled) setData({ ok: false, error: "Could not verify session." });
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="rounded-3xl border border-line bg-surface p-8 text-sm text-ink-soft">
        We couldn&rsquo;t find a payment session to confirm. If you completed checkout, please
        contact us and we&rsquo;ll verify it manually — no charge is made without a completed
        payment.
      </div>
    );
  }

  if (!data) {
    return <p className="text-sm text-muted">Confirming your payment…</p>;
  }

  if (!data.ok || !data.paid) {
    return (
      <div className="rounded-3xl border border-line bg-surface p-8 text-sm text-ink-soft">
        We couldn&rsquo;t confirm your payment yet. If you completed checkout, please contact us and
        we&rsquo;ll verify it manually — no charge is made without a completed payment.
      </div>
    );
  }

  return (
    <BookingConfirmation
      reference={data.reference}
      consultationType={data.consultationType}
      meetingFormat={data.meetingFormat}
      videoPlatform={data.videoPlatform}
      slotStartUtc={data.slotStartUtc}
      joinUrl={data.joinUrl}
      amountPaid={data.amountPaid}
      currency={data.currency}
      receiptUrl={data.receiptUrl}
      finalizing={data.finalizing}
      paid
    />
  );
}

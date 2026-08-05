"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";

type SessionData = {
  ok: boolean;
  paid?: boolean;
  reference?: string;
  consultationType?: string;
  meetingFormat?: string;
  videoPlatform?: string;
  slotStartUtc?: string;
  error?: string;
};

export function ConfirmationClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [data, setData] = useState<SessionData | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/book/verify-session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData({ ok: false, error: "Could not verify session." }));
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
      paid
    />
  );
}

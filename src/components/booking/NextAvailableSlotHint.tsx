"use client";

import { useEffect, useState } from "react";
import { formatInTimeZone, getBrowserTimeZone } from "@/lib/timezone";
import type { TimeSlot } from "@/lib/adapters/calendar";

export function NextAvailableSlotHint() {
  const [slot, setSlot] = useState<TimeSlot | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/book/availability?days=7")
      .then((res) => res.json())
      .then((data: { slots?: TimeSlot[] }) => setSlot(data.slots?.[0] ?? null))
      .catch(() => setSlot(null));
  }, []);

  if (!slot) return null;

  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-sage-pale px-4 py-1.5 text-xs font-medium text-ink-soft">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-sage" />
      Next available: {formatInTimeZone(slot.startUtc, getBrowserTimeZone())} your time
    </p>
  );
}

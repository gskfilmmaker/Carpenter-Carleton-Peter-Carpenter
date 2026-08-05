import type { Metadata } from "next";
import { Suspense } from "react";
import { Section, Eyebrow } from "@/components/layout/Section";
import { ConfirmationClient } from "@/app/book/confirmation/ConfirmationClient";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  robots: { index: false },
};

export default function BookConfirmationPage() {
  return (
    <Section className="pt-10">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>
          <span className="mx-auto">Confirmation</span>
        </Eyebrow>
        <h1 className="font-serif text-3xl font-normal text-ink sm:text-4xl">You&rsquo;re all set</h1>
      </div>
      <div className="mx-auto mt-8 max-w-2xl">
        <Suspense fallback={<p className="text-sm text-muted">Confirming your payment…</p>}>
          <ConfirmationClient />
        </Suspense>
      </div>
    </Section>
  );
}

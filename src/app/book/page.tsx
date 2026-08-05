import type { Metadata } from "next";
import { Suspense } from "react";
import { Section, Eyebrow } from "@/components/layout/Section";
import { BookingFlow } from "@/components/booking/BookingFlow";
import { FaqAccordion } from "@/components/contact/FaqAccordion";
import { NextAvailableSlotHint } from "@/components/booking/NextAvailableSlotHint";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Book a Consultation",
  description: "Book a confidential consultation with Carpenter & Carleton — choose your format, platform and time.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;

  return (
    <>
      <Section className="pt-10 pb-0">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>
            <span className="mx-auto">Book a consultation</span>
          </Eyebrow>
          <h1 className="font-serif text-3xl font-normal text-ink sm:text-4xl">
            Book a confidential consultation
          </h1>
          <p className="mt-4 text-ink-soft">
            Choose your format and a time that works for you. {site.noGuaranteeNotice}
          </p>
          {canceled && (
            <p className="mt-4 rounded-xl bg-sage-pale px-4 py-2 text-sm text-ink-soft">
              Payment was canceled — your slot wasn&rsquo;t booked. Feel free to try again.
            </p>
          )}
          <div className="mt-4">
            <Suspense fallback={null}>
              <NextAvailableSlotHint />
            </Suspense>
          </div>
        </div>
        <div className="relative mx-auto mt-10 max-w-2xl">
          <Suspense fallback={null}>
            <BookingFlow />
          </Suspense>
        </div>
      </Section>

      <Section className="border-t border-line bg-surface">
        <h2 className="mx-auto max-w-2xl font-serif text-2xl font-normal text-ink">
          Frequently asked questions
        </h2>
        <div className="mx-auto mt-6 max-w-2xl">
          <FaqAccordion />
        </div>
      </Section>
    </>
  );
}

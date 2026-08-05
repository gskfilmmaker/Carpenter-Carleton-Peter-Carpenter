import { Suspense } from "react";
import { Container } from "@/components/layout/Container";
import { ButtonLink } from "@/components/ui/Button";
import { NextAvailableSlotHint } from "@/components/booking/NextAvailableSlotHint";

export function FinalConversionBand() {
  return (
    <section className="relative overflow-hidden border-t border-line bg-ink py-16 text-white sm:py-20">
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-copper to-transparent"
      />
      <Container className="relative text-center">
        <p className="mx-auto max-w-2xl font-serif text-3xl font-normal leading-snug sm:text-4xl">
          You do not need every answer before you begin. You need the right next conversation.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/book" className="!bg-white !text-ink hover:!bg-slate-100">
            Book a Confidential Consultation
          </ButtonLink>
        </div>
        <div className="mt-4 flex justify-center text-ink">
          <Suspense fallback={null}>
            <NextAvailableSlotHint />
          </Suspense>
        </div>
      </Container>
    </section>
  );
}

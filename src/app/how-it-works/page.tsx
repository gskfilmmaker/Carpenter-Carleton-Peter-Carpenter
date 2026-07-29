import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/layout/Section";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How It Works",
  description: "What working with Carpenter & Carleton feels like, from first conversation to decision.",
};

export default function HowItWorksPage() {
  return (
    <>
      <Section className="pt-10 pb-0">
        <Eyebrow>How it works</Eyebrow>
        <h1 className="max-w-2xl font-serif text-3xl font-normal text-ink sm:text-4xl">
          What will working together feel like?
        </h1>
        <p className="mt-4 max-w-2xl text-ink-soft">
          A transparent, seven-step engagement journey. No stage skips your consent, and every stage
          is honest about what is — and is not — in our control.
        </p>
        <div className="mt-7">
          <ButtonLink href="/contact">Book a consultation</ButtonLink>
        </div>
      </Section>
      <ProcessTimeline />
    </>
  );
}

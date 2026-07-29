import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/layout/Section";
import { PathwayCheckFlow } from "@/components/start-here/PathwayCheckFlow";

export const metadata: Metadata = {
  title: "Start Here — Pathway Clarity Check",
  description:
    "A short, non-determinative set of questions that routes you to a relevant conversation about your Canada immigration goal. Educational only — never an eligibility result.",
};

export default function StartHerePage() {
  return (
    <Section className="pt-10">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>
          <span className="mx-auto">Pathway Clarity Check</span>
        </Eyebrow>
        <h1 className="font-serif text-3xl font-normal text-ink sm:text-4xl">
          Which direction is worth exploring first?
        </h1>
        <p className="mt-4 text-ink-soft">
          Nine short questions about your goal, status and timeline. You will receive an
          educational route recommendation — never an eligibility result — and a clear next step.
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-2xl">
        <PathwayCheckFlow />
      </div>
    </Section>
  );
}

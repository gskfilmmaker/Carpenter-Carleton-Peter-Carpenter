import { Section, Eyebrow } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";

export function ReadinessBriefTeaser() {
  return (
    <Section className="border-t border-line">
      <div className="rounded-3xl border border-line bg-gradient-to-br from-sage-pale to-canvas p-8 sm:p-12">
        <div className="max-w-2xl">
          <Eyebrow>Your Canada Pathway Readiness Brief</Eyebrow>
          <h2 className="font-serif text-3xl font-normal text-ink">
            Nine questions. One honest, dated summary — not an eligibility result.
          </h2>
          <p className="mt-4 text-ink-soft">
            Answer a short set of non-determinative questions about your goal, status, education,
            occupation, language testing, Canadian experience, family situation and timeline. You
            will receive a plain-language summary of the topics worth discussing, links to official
            resources, and a recommended consultation type — never a promise or a prediction.
          </p>
          <div className="mt-7 flex flex-wrap gap-3.5">
            <ButtonLink href="/start-here">Start the Readiness Brief</ButtonLink>
            <ButtonLink href="/resources" variant="secondary">
              See what a document readiness guide covers
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

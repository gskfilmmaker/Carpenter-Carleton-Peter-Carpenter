import { Section } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";

const steps = [
  "Understand your objective",
  "Identify the right questions and evidence",
  "Create a documented next-step plan",
];

export function DecisionStatement() {
  return (
    <Section className="border-t border-line bg-surface">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
          &ldquo;Before a checklist, a portal or a promise, there is a decision: which route is
          genuinely worth exploring?&rdquo;
        </p>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step} className="rounded-2xl border border-line bg-canvas p-6">
            <span className="font-serif text-2xl text-copper-dark">{index + 1}</span>
            <p className="mt-3 text-sm font-medium text-ink-soft">{step}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <ButtonLink href="/start-here">Start the Pathway Clarity Check</ButtonLink>
      </div>
    </Section>
  );
}

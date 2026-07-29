import { Section, Eyebrow } from "@/components/layout/Section";

const proofPoints = [
  "A named, verifiable representative",
  "A clear scope before representation begins",
  "Document readiness before avoidable delay",
  "Honest explanation of what is and is not in our control",
  "A client update rhythm you can understand",
];

export function CarefulSupportPanel() {
  return (
    <Section className="border-t border-line bg-surface">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div
          aria-hidden
          className="hidden aspect-[4/3] rounded-3xl bg-[radial-gradient(120%_120%_at_20%_20%,var(--color-sage-pale),var(--color-canvas)_70%)] lg:block"
        />
        <div>
          <Eyebrow>What careful support looks like</Eyebrow>
          <h2 className="max-w-lg font-serif text-3xl font-normal text-ink">
            The difference between a lead broker and an accountable practice
          </h2>
          <ul className="mt-8 space-y-4">
            {proofPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-sage text-white"
                >
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-ink-soft">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

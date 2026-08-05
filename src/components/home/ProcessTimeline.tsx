import { Section, Eyebrow } from "@/components/layout/Section";

const steps = [
  {
    title: "Clarify",
    body: "We identify which route is genuinely worth exploring, using the Pathway Clarity Check or a direct conversation.",
  },
  {
    title: "Consult",
    body: "A paid consultation reviews your facts against current program instructions and produces a written next-step summary.",
  },
  {
    title: "Agree scope",
    body: "If you choose to proceed, you receive a written scope of work and fee agreement before any representation begins.",
  },
  {
    title: "Prepare",
    body: "We organize the document categories that matter and point you to the official, personalized checklist for your file.",
  },
  {
    title: "Submit through official channel",
    body: "Applications are filed through the official government channel. You retain control of your account, information and electronic signature.",
  },
  {
    title: "Stay informed",
    body: "We agree an update rhythm you can understand. Government authorities make all decisions — we help you understand what happens next, whatever it is.",
  },
];

export function ProcessTimeline() {
  return (
    <Section className="border-t border-line bg-surface">
      <Eyebrow>How it works</Eyebrow>
      <h2 className="max-w-2xl font-serif text-3xl font-normal text-ink">The process, not the promise</h2>
      <ol className="mt-10 grid gap-3 lg:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step.title}>
            <details className="group rounded-2xl border border-line bg-canvas p-5 open:border-copper">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink marker:content-none">
                <span className="flex items-center gap-3">
                  <span className="font-serif text-lg text-copper-dark">{index + 1}</span>
                  {step.title}
                </span>
                <svg
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  aria-hidden
                  className="flex-none transition-transform group-open:rotate-180"
                >
                  <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                </svg>
              </summary>
              <p className="mt-3 text-sm text-ink-soft">{step.body}</p>
            </details>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-muted">
        At stages 5–6, you retain responsibility for your information and signatures. Government
        authorities decide outcomes.
      </p>
    </Section>
  );
}

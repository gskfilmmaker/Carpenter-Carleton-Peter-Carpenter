import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { testimonials } from "@/content/testimonials";

export const metadata: Metadata = {
  title: "Client Experience",
  description: "How Carpenter & Carleton handles client testimonials and review evidence.",
};

export default function ClientExperiencePage() {
  const published = testimonials.filter((t) => t.isPublished);

  return (
    <>
      <Section className="pt-10 pb-0">
        <Eyebrow>Client experience</Eyebrow>
        <h1 className="max-w-2xl font-serif text-3xl font-normal text-ink sm:text-4xl">
          What real people value, shown honestly
        </h1>
        <p className="mt-4 max-w-2xl text-ink-soft">
          We publish a client quotation only after written consent and sign-off are recorded for
          that specific quotation. No aggregate rating is shown here unless it is independently
          verifiable and current.
        </p>
      </Section>

      <Section className="border-t border-line bg-surface">
        {published.length === 0 ? (
          <div className="max-w-2xl rounded-2xl border border-dashed border-line bg-canvas p-8 text-sm text-muted">
            <p>
              No testimonial currently has recorded written consent and public-use approval. Rather
              than publish an unverified quote, this page will list consented client experiences as
              they become available.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {published.map((testimonial) => (
              <blockquote key={testimonial.displayName} className="rounded-2xl border border-line bg-canvas p-6">
                <p className="font-serif text-lg italic text-ink">&ldquo;{testimonial.quote}&rdquo;</p>
                <footer className="mt-4 text-sm text-muted">— {testimonial.displayName}</footer>
              </blockquote>
            ))}
          </div>
        )}
      </Section>

      <Section className="border-t border-line">
        <h2 className="font-serif text-2xl font-normal text-ink">Our testimonial policy</h2>
        <ul className="mt-4 max-w-2xl space-y-2.5 text-sm text-ink-soft">
          <li>Every quotation requires written consent from the client or former client.</li>
          <li>Every quotation is approved for public use before it is published.</li>
          <li>We never publish a review as our own if it originated on an independent platform without linking to that source where possible.</li>
        </ul>
        <div className="mt-8">
          <ButtonLink href="/book">Book a consultation</ButtonLink>
        </div>
      </Section>
    </>
  );
}

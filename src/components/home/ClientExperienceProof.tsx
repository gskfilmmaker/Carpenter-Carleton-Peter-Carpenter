import Link from "next/link";
import { Section, Eyebrow } from "@/components/layout/Section";
import { testimonials } from "@/content/testimonials";

export function ClientExperienceProof() {
  const published = testimonials.filter((t) => t.isPublished);

  return (
    <Section className="border-t border-line bg-surface">
      <Eyebrow>Client experience</Eyebrow>
      <h2 className="max-w-xl font-serif text-3xl font-normal text-ink">What careful clients value</h2>

      {published.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-canvas p-8 text-sm text-muted">
          <p>
            Client quotations are published only after written consent and approval are recorded.
            None currently meet that bar, so none are shown here — we would rather show nothing than
            an unverified claim.
          </p>
          <Link href="/client-experience" className="mt-3 inline-block font-medium text-ink underline underline-offset-4">
            Read our client-experience policy
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {published.map((testimonial) => (
            <blockquote key={testimonial.displayName} className="rounded-2xl border border-line bg-canvas p-6">
              <p className="font-serif text-lg italic text-ink">&ldquo;{testimonial.quote}&rdquo;</p>
              <footer className="mt-4 text-sm text-muted">— {testimonial.displayName}</footer>
            </blockquote>
          ))}
        </div>
      )}
    </Section>
  );
}

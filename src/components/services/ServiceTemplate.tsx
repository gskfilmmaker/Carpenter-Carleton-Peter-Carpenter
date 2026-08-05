import Link from "next/link";
import type { ReactNode } from "react";
import type { Service } from "@/content/types";
import { Section, Eyebrow } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";

/**
 * Shared template implementing the ten modules required for every service page
 * (build brief section 7): outcome-neutral hero, educational signals, overview, what a
 * consultation can review, evidence categories, engagement process, what we cannot promise,
 * sources + last-reviewed, FAQ, and a route-specific booking CTA.
 */
export function ServiceTemplate({ service, afterHero }: { service: Service; afterHero?: ReactNode }) {
  return (
    <>
      <Section className="pb-10 pt-10">
        <Eyebrow>{service.hero.eyebrow}</Eyebrow>
        <h1 className="max-w-2xl font-serif text-3xl font-normal text-ink sm:text-4xl">
          {service.hero.heading}
        </h1>
        <p className="mt-4 max-w-2xl text-ink-soft">{service.hero.description}</p>
        {!service.approval.approved && (
          <p className="mt-4 inline-block rounded-full border border-line bg-sage-pale px-3 py-1 text-xs font-medium text-ink-soft">
            Draft content — pending Peter&rsquo;s final review and approval
          </p>
        )}
        <div className="mt-7 flex flex-wrap gap-3.5">
          <ButtonLink href="/book">{service.ctaLabel}</ButtonLink>
          <ButtonLink href="/start-here" variant="secondary">
            Not sure this is the right route? Take the Pathway Clarity Check
          </ButtonLink>
        </div>
      </Section>

      {afterHero}

      <Section className="border-t border-line bg-surface">
        <h2 className="font-serif text-2xl font-normal text-ink">Is this the conversation you need?</h2>
        <p className="mt-3 max-w-3xl text-ink-soft">{service.overview}</p>
      </Section>

      <Section className="border-t border-line">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-normal text-ink">What a consultation can review</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              {service.consultationCanReview.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span aria-hidden className="mt-1.5 h-1 w-1 flex-none rounded-full bg-sage" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-2xl font-normal text-ink">General evidence categories</h2>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              {service.evidenceCategories.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span aria-hidden className="mt-1.5 h-1 w-1 flex-none rounded-full bg-sage" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line bg-surface" id="documents">
        <h2 className="font-serif text-2xl font-normal text-ink">How the engagement works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {service.processSteps.map((step, index) => (
            <li key={step.title} className="rounded-2xl border border-line bg-canvas p-5">
              <span className="font-serif text-lg text-copper-dark">{index + 1}</span>
              <p className="mt-1 font-medium text-ink">{step.title}</p>
              <p className="mt-2 text-sm text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="border-t border-line">
        <h2 className="font-serif text-2xl font-normal text-ink">What we cannot promise</h2>
        <div className="mt-4 space-y-3">
          {service.caveats.map((caveat) => (
            <p key={caveat} className="max-w-3xl text-sm text-ink-soft">
              {caveat}
            </p>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line bg-surface">
        <h2 className="font-serif text-2xl font-normal text-ink">Official sources</h2>
        <ul className="mt-4 space-y-2">
          {service.officialSources.map((source) => (
            <li key={source.url}>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-ink underline underline-offset-4 hover:text-copper-dark"
              >
                {source.label}
              </a>
              <span className="ml-2 text-xs text-muted">
                {source.sourceOwner} · checked {source.checkedAt}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">Last reviewed {service.lastReviewed}.</p>
      </Section>

      {service.faqs && service.faqs.length > 0 && (
        <Section className="border-t border-line">
          <h2 className="font-serif text-2xl font-normal text-ink">Frequently asked questions</h2>
          <div className="mt-6 space-y-3">
            {service.faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl border border-line bg-surface p-5">
                <summary className="cursor-pointer font-medium text-ink marker:content-none">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm text-ink-soft">{faq.answer}</p>
              </details>
            ))}
          </div>
        </Section>
      )}

      <Section className="border-t border-line bg-ink text-white">
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-2xl font-normal">Ready to talk through your situation?</p>
            <p className="mt-2 max-w-xl text-sm text-slate-300">{site.noGuaranteeNotice}</p>
          </div>
          <ButtonLink href="/book" className="!bg-white !text-ink hover:!bg-slate-100">
            {service.ctaLabel}
          </ButtonLink>
        </div>
      </Section>

      <p className="sr-only">
        <Link href="/services">Back to all services</Link>
      </p>
    </>
  );
}

import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { feeTiers } from "@/content/fees";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Fees & Consultation",
  description: "How Carpenter & Carleton structures consultation and representation fees — published once Peter approves a final schedule.",
};

export default function FeesPage() {
  return (
    <>
      <Section className="pt-10 pb-0">
        <Eyebrow>Fees &amp; consultation</Eyebrow>
        <h1 className="max-w-2xl font-serif text-3xl font-normal text-ink sm:text-4xl">
          What this will cost, and what is included
        </h1>
        <p className="mt-4 max-w-2xl text-ink-soft">
          Our final published fee schedule is pending Peter&rsquo;s approval. The structure below
          shows how engagement tiers work; no public price is shown until it is approved. Contact
          us for a written scope and fee agreement.
        </p>
        <div className="mt-7">
          <ButtonLink href="/contact">Contact us for a written scope and fee agreement</ButtonLink>
        </div>
      </Section>

      <Section className="border-t border-line bg-surface">
        <div className="grid gap-5 lg:grid-cols-4">
          {feeTiers.map((tier) => (
            <div key={tier.service} className="flex flex-col rounded-2xl border border-line bg-canvas p-6">
              <p className="font-medium text-ink">{tier.publicLabel}</p>
              <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-sage">
                Consultation required
              </p>
              <div className="mt-4 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Includes</p>
                <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
                  {tier.inclusions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">Excludes</p>
                <ul className="mt-2 space-y-1.5 text-sm text-muted">
                  {tier.exclusions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              {tier.paymentPolicy && (
                <p className="mt-4 text-xs text-muted">{tier.paymentPolicy}</p>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-line">
        <h2 className="font-serif text-2xl font-normal text-ink">Policy notes</h2>
        <ul className="mt-4 max-w-2xl space-y-2.5 text-sm text-ink-soft">
          <li>Complexity can change the fee; you receive a written agreement before representation begins.</li>
          <li>Government, medical, biometrics, language-test, translation and courier fees are separate from our professional fee.</li>
          <li>Payment plans, cancellation, rescheduling and refund rules are confirmed in your written agreement.</li>
          <li>All fees are quoted in Canadian dollars; applicable taxes are noted separately.</li>
        </ul>
        <p className="mt-6 text-xs text-muted">{site.noGuaranteeNotice}</p>
        <p className="mt-2 text-xs text-muted">Page last reviewed 2026-07-29.</p>
      </Section>
    </>
  );
}

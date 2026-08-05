import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About Peter / Our Practice",
  description: "Peter Carpenter, RCIC — licensing verification, approach and current practice commitments.",
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-10 pb-0">
        <Eyebrow>About the practice</Eyebrow>
        <h1 className="max-w-2xl font-serif text-3xl font-normal text-ink sm:text-4xl">
          {site.representativeName}, {site.designation}
        </h1>
        <p className="mt-4 max-w-2xl text-ink-soft">
          A full, approved biography is pending Peter&rsquo;s sign-off (see the launch-inputs
          checklist) and will replace this placeholder before public launch. Until then, here is
          what is independently verifiable today.
        </p>
      </Section>

      <Section className="border-t border-line bg-surface">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-canvas p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-sage">Verified licensing</p>
            <p className="mt-3 text-ink-soft">
              {site.representativeName} is listed on the College of Immigration and Citizenship
              Consultants (CICC) Public Register as an active {site.designation}, College ID{" "}
              {site.collegeId}.
            </p>
            <a
              href={site.ciccRegisterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-ink underline underline-offset-4 hover:text-copper-dark"
            >
              Verify on the CICC Public Register
            </a>
          </div>
          <div className="rounded-2xl border border-line bg-canvas p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-sage">
              What working with an authorized representative means
            </p>
            <p className="mt-3 text-ink-soft">
              Hiring a representative is optional. Using one does not guarantee approval or faster
              processing, and you remain responsible for the information in your own application.
            </p>
            <a
              href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigration-citizenship-representative/learn-about-representatives.html"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm font-medium text-ink underline underline-offset-4 hover:text-copper-dark"
            >
              Learn about representatives (IRCC)
            </a>
          </div>
        </div>
      </Section>

      <Section className="border-t border-line">
        <h2 className="font-serif text-2xl font-normal text-ink">Practice commitments</h2>
        <ul className="mt-4 max-w-2xl space-y-2.5 text-sm text-ink-soft">
          <li>A written scope and fee agreement before any representation begins.</li>
          <li>No outcome, approval or processing-time guarantees, ever.</li>
          <li>Every program page shows an official source and a last-reviewed date.</li>
          <li>Client documents are handled through a secure, consent-based process.</li>
        </ul>
        <div className="mt-8">
          <ButtonLink href="/book">Book a consultation</ButtonLink>
        </div>
      </Section>
    </>
  );
}

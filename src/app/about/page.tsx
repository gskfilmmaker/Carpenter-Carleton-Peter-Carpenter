import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";
import { MapleLeafIcon } from "@/components/ui/MapleLeafIcon";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About Peter / Our Practice",
  description: "Peter Carpenter, RCIC — licensing verification, approach and current practice commitments.",
};

export default function AboutPage() {
  return (
    <>
      <Section className="pt-10 pb-0">
        <Eyebrow>
          <MapleLeafIcon className="h-3.5 w-3.5 text-copper" />
          Regulated Canadian Immigration Consultant · {site.designation} #{site.collegeId}
        </Eyebrow>
        <h1 className="max-w-2xl font-serif text-3xl font-normal text-ink sm:text-4xl">
          Experience you can rely on
        </h1>

        <ul className="mt-5 flex flex-wrap gap-2.5" aria-label="Credentials">
          <li className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-soft">
            {site.yearsOfExperience} of experience
          </li>
          <li className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-medium text-ink-soft">
            {site.designation} #{site.collegeId}
          </li>
        </ul>

        <p className="mt-6 max-w-2xl text-ink-soft">
          For more than {site.yearsOfExperience.replace("+", " ")}, {site.representativeName} and{" "}
          {site.legalName} have helped individuals, families and businesses navigate the Canadian
          immigration system. As a Regulated Canadian Immigration Consultant, Peter offers
          practical, personalized guidance grounded in decades of hands-on experience.
        </p>

        {/*
          APPROVAL-PENDING: biographical detail below (England → Toronto → University of Western
          Ontario) is drawn from Peter's own historical firm material and public records, but Peter
          must give final written confirmation before public launch — see
          docs/LAUNCH-INPUTS-CHECKLIST.md. Rendered now per the approved copy brief; do not embellish.
        */}
        <p className="mt-4 max-w-2xl text-ink-soft">
          Peter came to Canada from England as a child, grew up in Toronto, and was educated there
          and at the University of Western Ontario. Over the years, {site.legalName} has worked
          with clients from across Canada and around the world — professionals, families, students
          and employers — helping them understand their options, prepare their applications and
          meet the procedural requirements that Canadian immigration involves.
        </p>

        <p className="mt-4 max-w-2xl text-ink-soft">
          His practice spans a broad range of matters, from permanent residence and Express Entry
          to family sponsorship, work and study permits, provincial nominee pathways, business
          immigration and more complex cases. Canadian immigration is rarely just about forms — it
          often involves a career, a business, or the chance for a family to build a future
          together. Peter&rsquo;s approach starts with the person: understand the circumstances,
          explain the options clearly, and set out a practical path forward.
        </p>

        <p className="mt-8 max-w-xl border-l-2 border-copper pl-5 font-serif text-xl italic text-ink">
          Your immigration journey is personal. Your advice should be too.
        </p>

        <div className="mt-8 flex flex-wrap gap-3.5">
          <ButtonLink href="/book">Book a consultation</ButtonLink>
          <ButtonLink
            href={site.ciccRegisterUrl}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Verify on the CICC Public Register
          </ButtonLink>
        </div>
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

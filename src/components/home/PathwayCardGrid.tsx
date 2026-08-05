import Link from "next/link";
import { Section, Eyebrow } from "@/components/layout/Section";

const cards = [
  {
    title: "Build a permanent future",
    description: "Economic pathways, Express Entry and provincial nominee routes.",
    href: "/services/permanent-residence",
  },
  {
    title: "Work in Canada / hire internationally",
    description: "Work permits for individuals, and compliance for employers.",
    href: "/services/work-permits-employers",
  },
  {
    title: "Study with a plan",
    description: "Study permits and honest, current-rule post-graduation planning.",
    href: "/services/study-permits",
  },
  {
    title: "Bring family closer",
    description: "Spouse, partner, child, parent, grandparent and Super Visa routes.",
    href: "/services/family-sponsorship",
  },
  {
    title: "Explore business options responsibly",
    description: "An honest feasibility screen before any business-immigration strategy.",
    href: "/services/business-pathways",
  },
  {
    title: "Maintain status, PR card or citizenship",
    description: "Straightforward help for the milestones after landing.",
    href: "/services/citizenship-pr-cards",
  },
];

export function PathwayCardGrid() {
  return (
    <Section className="border-t border-line">
      <Eyebrow>Six reasons people come to Carpenter &amp; Carleton</Eyebrow>
      <h2 className="max-w-2xl font-serif text-3xl font-normal text-ink">
        Choose your reason for coming to Canada
      </h2>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 transition-[border-color,box-shadow] hover:border-copper hover:shadow-[0_20px_50px_-30px_rgba(16,42,67,0.35)] focus-visible:border-copper"
          >
            <div>
              <span
                aria-hidden
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sage-pale text-sage transition-colors group-hover:bg-copper/15 group-hover:text-copper-dark"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="font-medium text-ink">{card.title}</p>
              <p className="mt-2 text-sm text-muted">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

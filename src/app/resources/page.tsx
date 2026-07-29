import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/layout/Section";
import { resources } from "@/content/resources";

export const metadata: Metadata = {
  title: "Resources",
  description: "The Canada Pathway Briefing: dated, source-backed policy updates and document-readiness guides.",
};

export default function ResourcesIndexPage() {
  return (
    <Section className="pt-10">
      <Eyebrow>Resources</Eyebrow>
      <h1 className="max-w-2xl font-serif text-3xl font-normal text-ink sm:text-4xl">
        The Canada Pathway Briefing
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Every article here links to an official government source and shows the date it was last
        reviewed. If a page hasn&rsquo;t been checked recently, we say so.
      </p>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {resources.map((resource) => (
          <Link
            key={resource.slug}
            href={`/resources/${resource.slug}`}
            className="flex flex-col rounded-2xl border border-line bg-surface p-6 hover:border-copper"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-sage">
              {resource.contentType.replace("-", " ")}
            </p>
            <p className="mt-2 font-medium text-ink">{resource.title}</p>
            <p className="mt-2 flex-1 text-sm text-muted">{resource.summary}</p>
            <p className="mt-4 text-xs text-muted">Last reviewed {resource.lastReviewed}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}

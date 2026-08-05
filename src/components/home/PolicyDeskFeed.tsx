import Link from "next/link";
import { Section, Eyebrow } from "@/components/layout/Section";
import { resources } from "@/content/resources";

export function PolicyDeskFeed() {
  const latest = resources.slice(0, 3);

  return (
    <Section className="border-t border-line">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Policy Desk</Eyebrow>
          <h2 className="max-w-xl font-serif text-3xl font-normal text-ink">
            Dated evidence, not bureaucracy
          </h2>
        </div>
        <Link href="/resources" className="text-sm font-medium text-ink-soft underline underline-offset-4 hover:text-ink">
          View all resources
        </Link>
      </div>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {latest.map((resource) => (
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
            <div className="mt-4 flex items-center justify-between text-xs text-muted">
              <span>Last reviewed {resource.lastReviewed}</span>
              <span>{resource.officialSources[0]?.sourceOwner} source</span>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

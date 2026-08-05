import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResourceBySlug, resources } from "@/content/resources";
import { Section, Eyebrow } from "@/components/layout/Section";
import { ButtonLink } from "@/components/ui/Button";

export function generateStaticParams() {
  return resources.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) return {};
  return { title: resource.title, description: resource.summary };
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);
  if (!resource) notFound();

  return (
    <article>
      <Section className="pb-0 pt-10">
        <Eyebrow>{resource.contentType.replace("-", " ")}</Eyebrow>
        <h1 className="max-w-2xl font-serif text-3xl font-normal text-ink sm:text-4xl">
          {resource.title}
        </h1>
        <p className="mt-4 max-w-2xl text-ink-soft">{resource.summary}</p>
        <p className="mt-3 text-xs text-muted">Last reviewed {resource.lastReviewed} · Next review due {resource.reviewDueAt}</p>
      </Section>

      {(resource.whatChanged || resource.whoItMayAffect || resource.whatToCheckNext) && (
        <Section className="border-t border-line bg-surface">
          <div className="grid gap-6 sm:grid-cols-3">
            {resource.whatChanged && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-sage">What changed</p>
                <p className="mt-2 text-sm text-ink-soft">{resource.whatChanged}</p>
              </div>
            )}
            {resource.whoItMayAffect && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-sage">Who it may affect</p>
                <p className="mt-2 text-sm text-ink-soft">{resource.whoItMayAffect}</p>
              </div>
            )}
            {resource.whatToCheckNext && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-sage">What to check next</p>
                <p className="mt-2 text-sm text-ink-soft">{resource.whatToCheckNext}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      <Section className="border-t border-line">
        <div className="prose max-w-2xl text-ink-soft">
          <p>{resource.body}</p>
        </div>
      </Section>

      <Section className="border-t border-line bg-surface">
        <h2 className="font-serif text-xl font-normal text-ink">Official sources</h2>
        <ul className="mt-3 space-y-2">
          {resource.officialSources.map((source) => (
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
        <div className="mt-8">
          <ButtonLink href="/book">Book a consultation</ButtonLink>
        </div>
      </Section>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Section, Eyebrow } from "@/components/layout/Section";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore Carpenter & Carleton's Canadian immigration service families, from Express Entry to citizenship.",
};

export default function ServicesIndexPage() {
  return (
    <Section className="pt-10">
      <Eyebrow>Services</Eyebrow>
      <h1 className="max-w-2xl font-serif text-3xl font-normal text-ink sm:text-4xl">
        A service for every stage of your Canada journey
      </h1>
      <p className="mt-4 max-w-2xl text-ink-soft">
        Each pathway page explains the route in plain language, what a consultation can review, and
        what we cannot promise — with official sources and a last-reviewed date.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Link
            key={service.slug}
            href={`/services/${service.slug}`}
            className="flex flex-col rounded-2xl border border-line bg-surface p-6 hover:border-copper"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-sage">{service.hero.eyebrow}</p>
            <p className="mt-2 font-medium text-ink">{service.title}</p>
            <p className="mt-2 flex-1 text-sm text-muted">{service.hero.description}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}

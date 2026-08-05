import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceBySlug, services } from "@/content/services";
import { ServiceTemplate } from "@/components/services/ServiceTemplate";
import { EmployerWorkerSplit } from "@/components/services/EmployerWorkerSplit";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.hero.description,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();
  return (
    <ServiceTemplate
      service={service}
      afterHero={slug === "work-permits-employers" ? <EmployerWorkerSplit /> : undefined}
    />
  );
}

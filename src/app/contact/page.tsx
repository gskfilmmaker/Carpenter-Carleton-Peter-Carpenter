import type { Metadata } from "next";
import { Suspense } from "react";
import { Section, Eyebrow } from "@/components/layout/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact / Book a Consultation",
  description: "Book a confidential consultation with Carpenter & Carleton, or send a service enquiry.",
};

export default function ContactPage() {
  return (
    <Section className="pt-10">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>
          <span className="mx-auto">Contact</span>
        </Eyebrow>
        <h1 className="font-serif text-3xl font-normal text-ink sm:text-4xl">
          Book a confidential consultation
        </h1>
        <p className="mt-4 text-ink-soft">
          Tell us a little about your situation and preferred contact method. We aim to respond
          within one business day. {site.noGuaranteeNotice}
        </p>
      </div>
      <div className="relative mx-auto mt-10 max-w-2xl">
        <Suspense fallback={null}>
          <ContactForm />
        </Suspense>
      </div>
    </Section>
  );
}

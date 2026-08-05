import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/layout/Section";
import { ContactForm } from "@/components/forms/ContactForm";
import { ContactChannels } from "@/components/contact/ContactChannels";
import { FaqAccordion } from "@/components/contact/FaqAccordion";
import { CallbackRequestForm } from "@/components/contact/CallbackRequestForm";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send Carpenter & Carleton a message, or book a confidential consultation.",
};

export default function ContactPage() {
  return (
    <>
      <Section className="pt-10 pb-0">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>
            <span className="mx-auto">Contact</span>
          </Eyebrow>
          <h1 className="font-serif text-3xl font-normal text-ink sm:text-4xl">Send us a message</h1>
          <p className="mt-4 text-ink-soft">
            Prefer to talk to someone directly, or want to reserve an actual time slot? Use the
            channels below, or{" "}
            <ButtonLink href="/book" variant="tertiary" className="!p-0 !text-copper-dark">
              book a confidential consultation
            </ButtonLink>
            . We aim to respond within one business day. {site.noGuaranteeNotice}
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-2xl">
          <ContactChannels />
        </div>
        <div className="mx-auto mt-6 max-w-2xl">
          <CallbackRequestForm />
        </div>
        <div className="relative mx-auto mt-10 max-w-2xl">
          <ContactForm />
        </div>
      </Section>

      <Section className="border-t border-line bg-surface">
        <h2 className="mx-auto max-w-2xl font-serif text-2xl font-normal text-ink">
          Frequently asked questions
        </h2>
        <div className="mx-auto mt-6 max-w-2xl">
          <FaqAccordion />
        </div>
      </Section>
    </>
  );
}

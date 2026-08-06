import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/layout/Section";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Carpenter & Carleton collects, uses and protects your information.",
};

export default function PrivacyPage() {
  return (
    <Section className="pt-10">
      <Eyebrow>Privacy</Eyebrow>
      <h1 className="max-w-2xl font-serif text-3xl font-normal text-ink sm:text-4xl">
        Privacy policy
      </h1>
      <div className="mt-6 max-w-2xl space-y-4 text-ink-soft">
        <p>
          A complete, Peter-approved privacy policy — covering data collection, retention,
          document-handling, marketing consent and your rights — is a required launch input and
          will replace this placeholder before public launch (see{" "}
          <code>docs/LAUNCH-INPUTS-CHECKLIST.md</code>).
        </p>
        <p>
          In the meantime: our public forms collect only the minimum information needed to respond
          to your enquiry, marketing consent is always a separate, optional checkbox from service
          enquiry consent, and we never ask you to send passports, bank statements or immigration
          portal passwords through a public form.
        </p>
      </div>

      <div className="mt-10 max-w-2xl border-t border-line pt-6">
        <h2 className="font-serif text-xl font-normal text-ink">Payments</h2>
        <p className="mt-3 text-ink-soft">
          Consultation fee payments are processed by {site.managedBy} via Stripe, on behalf of{" "}
          {site.legalName}. {site.managedBy} manages this website and its payment processing;{" "}
          {site.legalName} remains the practice you are engaging for immigration guidance. Stripe
          receives the payment details needed to process your charge (card details are handled
          directly by Stripe — this site never stores or sees them); it does not receive your
          immigration-related documents or correspondence.
        </p>
      </div>
    </Section>
  );
}

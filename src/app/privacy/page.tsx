import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/layout/Section";

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
    </Section>
  );
}

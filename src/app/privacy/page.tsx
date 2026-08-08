import type { Metadata } from "next";
import { Section, Eyebrow } from "@/components/layout/Section";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Carpenter & Carleton collects, uses and protects your information.",
};

const LAST_UPDATED = "2026-08-09";

export default function PrivacyPage() {
  return (
    <Section className="pt-10">
      <Eyebrow>Privacy</Eyebrow>
      <h1 className="max-w-2xl font-serif text-3xl font-normal text-ink sm:text-4xl">
        Privacy policy
      </h1>
      <p className="mt-3 inline-block rounded-full border border-line bg-sage-pale px-3 py-1 text-xs font-medium text-ink-soft">
        Draft — describes this site&rsquo;s actual data handling as built; pending Peter&rsquo;s and
        legal counsel&rsquo;s final review before this is treated as the firm&rsquo;s official policy.
      </p>

      <div className="mt-6 max-w-2xl space-y-8 text-ink-soft">
        <div>
          <h2 className="font-serif text-xl font-normal text-ink">Who this policy covers</h2>
          <p className="mt-3">
            This policy describes how {site.legalName} handles information submitted through{" "}
            {site.legalName}&rsquo;s website. {site.managedBy} builds and manages this website and
            processes its payments on {site.legalName}&rsquo;s behalf (see &ldquo;Payments&rdquo;
            below); {site.legalName} remains the practice you are engaging for immigration
            guidance and the party responsible for your immigration file.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl font-normal text-ink">Information we collect</h2>
          <p className="mt-3">Our public forms collect only what is needed to respond to you:</p>
          <ul className="mt-3 space-y-2 pl-5 text-sm">
            <li className="list-disc">
              <strong>Contact and enquiry forms:</strong> name, email, phone number (if provided),
              your message, and a separate marketing-consent checkbox (unticked by default and
              never bundled with consent to be contacted about your enquiry).
            </li>
            <li className="list-disc">
              <strong>Booking:</strong> your name, email, phone (if provided), preferred
              consultation type, chosen date/time and timezone, meeting format (video, phone or
              WhatsApp), and any note you add.
            </li>
            <li className="list-disc">
              <strong>Payment (when applicable):</strong> handled entirely by Stripe — see
              &ldquo;Payments&rdquo; below.
            </li>
            <li className="list-disc">
              <strong>Automated spam-prevention signals:</strong> basic technical data (such as
              request timing and, if Cloudflare Turnstile is active, a Turnstile verification
              token) used only to filter automated submissions, not to profile visitors.
            </li>
          </ul>
          <p className="mt-3 font-medium text-ink">{site.sensitiveDocsNotice}</p>
        </div>

        <div>
          <h2 className="font-serif text-xl font-normal text-ink">What we do with it</h2>
          <p className="mt-3">
            Form and booking submissions trigger an email response to you and an internal
            notification to our team — that is their only current purpose. If you have separately
            ticked the marketing-consent checkbox, we may also send you occasional updates; you can
            withdraw that consent at any time by contacting us.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl font-normal text-ink">Cookies and tracking</h2>
          <p className="mt-3">
            This site does not currently run any analytics or advertising tracking, and sets no
            tracking cookies of its own. The only browser storage it uses is a small local flag
            that remembers whether you closed the WhatsApp chat prompt during your visit — it stays
            on your device only, is never sent to us, and carries no personal information.
          </p>
          <p className="mt-3">
            If Cloudflare Turnstile spam protection is active on a form, Cloudflare may set a
            cookie on its own domain solely to verify you are not a bot. If we later enable
            consent-managed analytics (e.g. Google Analytics or PostHog), this section will be
            updated first and a consent option will be shown before any tracking cookie is set.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl font-normal text-ink">Who we share information with</h2>
          <p className="mt-3">
            We use a small number of service providers to operate this site, each only for the
            purpose named:
          </p>
          <ul className="mt-3 space-y-2 pl-5 text-sm">
            <li className="list-disc">
              <strong>Stripe</strong> — processes consultation fee payments (see
              &ldquo;Payments&rdquo; below).
            </li>
            <li className="list-disc">
              <strong>Resend</strong> — delivers transactional emails (booking confirmations, form
              receipts, internal notifications).
            </li>
            <li className="list-disc">
              <strong>Cal.com</strong> — schedules and manages consultation bookings, where
              configured.
            </li>
          </ul>
          <p className="mt-3">
            We do not sell personal information, and we do not share it with any other third party
            except where required by law.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl font-normal text-ink">Data retention</h2>
          <p className="mt-3">
            This site does not currently maintain its own client database — form and booking
            submissions trigger email notifications and are not otherwise stored by the site
            beyond what is technically necessary to prevent duplicate charges and abuse (cleared
            automatically, not a permanent record). Information contained in resulting emails is
            retained according to our normal business email-retention practice. This section will
            be expanded with specific retention periods once finalized.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl font-normal text-ink">Your rights</h2>
          <p className="mt-3">
            Consistent with Canadian privacy law (PIPEDA), you may ask us what personal information
            we hold about you, request a correction, or withdraw marketing consent at any time.
            Contact us at{" "}
            <a href={`mailto:${site.publicEmail}`} className="font-medium text-ink underline underline-offset-4 hover:text-copper-dark">
              {site.publicEmail}
            </a>{" "}
            for any of these requests.
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl font-normal text-ink">Children</h2>
          <p className="mt-3">
            This site is not directed at children, and we do not knowingly collect information from
            children.
          </p>
        </div>
      </div>

      <div className="mt-10 max-w-2xl border-t border-line pt-6 text-ink-soft">
        <h2 className="font-serif text-xl font-normal text-ink">Payments</h2>
        <p className="mt-3">
          Consultation fee payments are processed by {site.managedBy} via Stripe, on behalf of{" "}
          {site.legalName}. {site.managedBy} manages this website and its payment processing;{" "}
          {site.legalName} remains the practice you are engaging for immigration guidance. Stripe
          receives the payment details needed to process your charge (card details are handled
          directly by Stripe — this site never stores or sees them); it does not receive your
          immigration-related documents or correspondence.
        </p>
      </div>

      <p className="mt-10 max-w-2xl text-xs text-muted">
        Last updated {LAST_UPDATED}. This policy will be revised whenever the site&rsquo;s data
        handling changes materially (for example, if analytics tracking or a client-document portal
        is introduced).
      </p>
    </Section>
  );
}

import Link from "next/link";
import { Section } from "@/components/layout/Section";

/**
 * Build brief section 6.3: employer and worker journeys must never share one form or imply an
 * LMIA equals a permit. Two clearly separate branches, each with its own enquiry consultation type.
 */
export function EmployerWorkerSplit() {
  return (
    <Section className="border-t border-line bg-surface">
      <h2 className="font-serif text-2xl font-normal text-ink">Two separate journeys</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        A positive LMIA is an employer-side outcome. It does not itself issue a work permit — the
        worker&rsquo;s application is a separate process with its own consent and documents.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Link
          href="/contact?type=employer"
          className="rounded-2xl border border-line bg-canvas p-6 hover:border-copper"
        >
          <p className="font-medium text-ink">I am an employer exploring hiring / compliance</p>
          <p className="mt-2 text-sm text-muted">
            LMIA-vs-exemption analysis, recruitment and compliance readiness.
          </p>
        </Link>
        <Link
          href="/contact?type=worker"
          className="rounded-2xl border border-line bg-canvas p-6 hover:border-copper"
        >
          <p className="font-medium text-ink">I am a worker exploring a work permit</p>
          <p className="mt-2 text-sm text-muted">
            Understand which permit category may fit your situation and what evidence it needs.
          </p>
        </Link>
      </div>
    </Section>
  );
}

import { site } from "@/content/site";

/**
 * First-class compliance asset per the CICC Code: the College-registered name, license number and
 * a live Public Register link must be prominent, not buried in the footer. Kept sitewide on every
 * page — not just Home.
 */
export function TrustBar() {
  return (
    <div
      role="region"
      aria-label="Licensing and verification"
      className="flex flex-wrap items-center gap-x-6 gap-y-1.5 bg-ink px-6 py-2.5 text-[0.78rem] text-slate-100 sm:px-8 lg:px-12"
    >
      <span className="inline-flex items-center gap-2">
        <span aria-hidden className="inline-block h-[5px] w-[5px] rounded-full bg-sage" />
        <strong className="font-semibold text-white">
          {site.representativeName}, {site.designation}
        </strong>{" "}
        — College ID {site.collegeId}
      </span>
      <a
        href={site.ciccRegisterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white underline decoration-copper underline-offset-2 hover:decoration-white"
      >
        Verify on the CICC Public Register
      </a>
      <span className="opacity-80">{site.noGuaranteeNotice}</span>
    </div>
  );
}

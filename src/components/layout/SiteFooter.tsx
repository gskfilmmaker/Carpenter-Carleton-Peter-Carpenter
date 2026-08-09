import Link from "next/link";
import { Container } from "@/components/layout/Container";
import {
  formatPhoneForDisplay,
  googleMapsHref,
  mailtoHref,
  primaryNav,
  site,
  telHref,
  whatsAppDefaultMessage,
  whatsAppHref,
} from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink text-slate-200">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-serif text-lg text-white">Carpenter &amp; Carleton</p>
          <p className="mt-3 max-w-sm text-sm text-slate-300">
            GTA-based Canadian immigration guidance. Careful, accountable support for individuals,
            families, employers and businesses planning a pathway to Canada.
          </p>
          <div className="mt-5 space-y-1 text-sm text-slate-300">
            <p>
              {site.representativeName}, {site.designation} — College ID {site.collegeId}
            </p>
            <a
              href={site.ciccRegisterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block underline decoration-copper underline-offset-2 hover:decoration-white"
            >
              Verify on the CICC Public Register
            </a>
            <a
              href={googleMapsHref(site.addressLine)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block underline decoration-copper underline-offset-2 hover:decoration-white hover:text-white"
            >
              {site.addressLine}
            </a>
          </div>
          <ul className="mt-5 space-y-1.5 text-sm text-slate-300">
            <li>
              <a href={mailtoHref(site.publicEmail)} className="hover:text-white">
                {site.publicEmail}
              </a>
            </li>
            <li>
              <a href={telHref(site.businessPhone)} className="hover:text-white">
                {formatPhoneForDisplay(site.businessPhone)}
              </a>
            </li>
            <li>
              <a
                href={whatsAppHref(site.businessWhatsApp, whatsAppDefaultMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                WhatsApp: {formatPhoneForDisplay(site.businessWhatsApp)}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Explore</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-white">Trust &amp; privacy</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            <li>
              <Link href="/privacy" className="hover:text-white">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/book" className="hover:text-white">
                Book a consultation
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Send a message
              </Link>
            </li>
            <li>
              <a
                href={site.representativeInfoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Learn about representatives (IRCC)
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Carpenter &amp; Carleton. All rights reserved.</p>
          <p className="max-w-2xl">{site.noGuaranteeNotice}</p>
        </Container>
      </div>

      {/* Low-emphasis management credit — deliberately quieter than everything above it, and never
          competing with the firm brand or the RCIC trust module. */}
      <div className="border-t border-white/5">
        <Container className="py-3">
          {/* text-slate-400 (not -500) — Axe-verified 4.5:1+ against bg-ink; low emphasis comes
              from the small size and its own quiet row, not from failing contrast. */}
          <p className="text-[0.7rem] text-slate-400">Site managed by {site.managedBy}</p>
        </Container>
      </div>
    </footer>
  );
}

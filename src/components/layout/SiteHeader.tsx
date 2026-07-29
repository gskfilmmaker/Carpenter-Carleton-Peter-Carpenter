"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { primaryCta, primaryNav } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [renderedPathname, setRenderedPathname] = useState(pathname);
  const servicesRef = useRef<HTMLDivElement>(null);

  // Reset open menus when the route changes. Adjusting state during render (rather than in an
  // effect) is the recommended pattern for "state that should reset when a prop changes".
  if (pathname !== renderedPathname) {
    setRenderedPathname(pathname);
    setMobileOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setServicesOpen(false);
      }
    }
    function onClickOutside(event: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="font-serif text-xl font-medium tracking-tight text-ink">
          Carpenter <span className="text-copper-dark">&amp;</span> Carleton
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) =>
            item.children ? (
              <div key={item.href} ref={servicesRef} className="relative">
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                  onClick={() => setServicesOpen((open) => !open)}
                  className={clsx(
                    "flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium text-ink-soft hover:bg-sage-pale hover:text-ink",
                    servicesOpen && "bg-sage-pale text-ink"
                  )}
                >
                  {item.label}
                  <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden focusable="false">
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  </svg>
                </button>
                {servicesOpen && (
                  <div
                    role="menu"
                    className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-line bg-surface p-2 shadow-[0_20px_50px_-30px_rgba(16,42,67,0.45)]"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        role="menuitem"
                        className="block rounded-lg px-3.5 py-2.5 text-sm text-ink-soft hover:bg-sage-pale hover:text-ink"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-ink-soft hover:bg-sage-pale hover:text-ink"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:block">
          <ButtonLink href={primaryCta.href} className="!py-2.5 !px-5 text-sm">
            {primaryCta.label}
          </ButtonLink>
        </div>

        <button
          type="button"
          className="flex items-center justify-center rounded-lg border border-line p-2 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden focusable="false">
            {mobileOpen ? (
              <path
                d="M1 1l20 14M21 1L1 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <>
                <line x1="0" y1="1" x2="22" y2="1" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="8" x2="22" y2="8" stroke="currentColor" strokeWidth="2" />
                <line x1="0" y1="15" x2="22" y2="15" stroke="currentColor" strokeWidth="2" />
              </>
            )}
          </svg>
        </button>
      </Container>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-line bg-surface px-6 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink-soft hover:bg-sage-pale hover:text-ink"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="ml-3 flex flex-col gap-0.5 border-l border-line pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-sage-pale hover:text-ink"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          <ButtonLink href={primaryCta.href} className="mt-4 w-full">
            {primaryCta.label}
          </ButtonLink>
        </nav>
      )}
    </header>
  );
}

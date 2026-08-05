"use client";

import { useEffect, useRef, useState } from "react";
import { site, telHref, whatsAppDefaultMessage, whatsAppHref } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { analyticsEvents, track } from "@/lib/analytics";

const SHOW_AFTER_PX = 480;

export function StickyBookCTA() {
  const [visible, setVisible] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const sentinelObserved = useRef(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > SHOW_AFTER_PX);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || sentinelObserved.current) return;
    sentinelObserved.current = true;
    const observer = new IntersectionObserver(
      ([entry]) => setNearFooter(entry.isIntersecting),
      { rootMargin: "0px 0px -15% 0px" }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const show = visible && !nearFooter;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur transition-transform duration-200 motion-reduce:transition-none print:hidden sm:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <a
          href={telHref(site.businessPhone)}
          aria-label="Call us"
          onClick={() => track(analyticsEvents.clickCall, { source: "sticky" })}
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-line text-ink-soft"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path
              d="M4 3.5h3l1.4 4-2 1.4a10 10 0 0 0 4.7 4.7l1.4-2 4 1.4v3a1.5 1.5 0 0 1-1.6 1.5A14 14 0 0 1 2.5 5.1 1.5 1.5 0 0 1 4 3.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </a>
        <a
          href={whatsAppHref(site.businessWhatsApp, whatsAppDefaultMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Message us on WhatsApp"
          onClick={() => track(analyticsEvents.clickWhatsapp, { source: "sticky" })}
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-line text-ink-soft"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.42 1.26 4.86L2 22l5.32-1.28a9.9 9.9 0 0 0 4.72 1.2h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Z" />
          </svg>
        </a>
        <ButtonLink
          href="/book"
          className="flex-1 !py-2.5"
          onClick={() => track(analyticsEvents.clickBookConsultation, { source: "sticky" })}
        >
          Book a Consultation
        </ButtonLink>
      </div>
    </div>
  );
}

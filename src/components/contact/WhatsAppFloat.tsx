"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { site, whatsAppDefaultMessage, whatsAppHref } from "@/content/site";
import { analyticsEvents, track } from "@/lib/analytics";

const DISMISS_KEY = "cc-whatsapp-float-dismissed";
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
function getSnapshot() {
  return sessionStorage.getItem(DISMISS_KEY) === "1";
}
function getServerSnapshot() {
  return false;
}
function dismiss() {
  sessionStorage.setItem(DISMISS_KEY, "1");
  listeners.forEach((listener) => listener());
}

/**
 * Fixed bottom-right WhatsApp entry point. Hides itself once the footer scrolls into view so it
 * never overlaps the footer's own CTAs, and is dismissible (remembered for the session, via
 * `useSyncExternalStore` over sessionStorage rather than an effect-driven read, which avoids a
 * hydration flash) so it never becomes a permanent obstruction. Keyboard accessible (it's a real
 * link), respects `prefers-reduced-motion`, and is hidden from print.
 */
export function WhatsAppFloat() {
  const dismissed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [nearFooter, setNearFooter] = useState(false);

  const sentinelObserved = useRef(false);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || sentinelObserved.current) return;
    sentinelObserved.current = true;
    const observer = new IntersectionObserver(
      ([entry]) => setNearFooter(entry.isIntersecting),
      { rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (dismissed) return null;

  return (
    <div
      className={`fixed right-4 bottom-4 z-40 flex items-end gap-2 print:hidden sm:right-6 sm:bottom-6 transition-opacity duration-200 motion-reduce:transition-none ${
        nearFooter ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <button
        type="button"
        aria-label="Hide WhatsApp contact button"
        onClick={dismiss}
        className="flex h-6 w-6 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-sm hover:text-ink"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
      <a
        href={whatsAppHref(site.businessWhatsApp, whatsAppDefaultMessage)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onClick={() => track(analyticsEvents.clickWhatsapp, { source: "float" })}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_28px_-10px_rgba(0,0,0,0.45)] transition-transform hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.42 1.26 4.86L2 22l5.32-1.28a9.9 9.9 0 0 0 4.72 1.2h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.2h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.15.76.76-3.07-.2-.32a8.18 8.18 0 1 1 6.99 4Zm4.5-6.13c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.2-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28Z" />
        </svg>
      </a>
    </div>
  );
}

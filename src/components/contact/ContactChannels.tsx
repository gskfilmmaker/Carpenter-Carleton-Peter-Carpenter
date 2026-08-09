"use client";

import {
  mailtoHref,
  site,
  telHref,
  formatPhoneForDisplay,
  whatsAppDefaultMessage,
  whatsAppHref,
} from "@/content/site";
import { analyticsEvents, track } from "@/lib/analytics";

const iconClass = "h-4 w-4 flex-none";

function MailIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden>
      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 5.5l7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M4 3.5h3l1.4 4-2 1.4a10 10 0 0 0 4.7 4.7l1.4-2 4 1.4v3a1.5 1.5 0 0 1-1.6 1.5A14 14 0 0 1 2.5 5.1 1.5 1.5 0 0 1 4 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.42 1.26 4.86L2 22l5.32-1.28a9.9 9.9 0 0 0 4.72 1.2h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Zm0 18.2h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.15.76.76-3.07-.2-.32a8.18 8.18 0 1 1 6.99 4Zm4.5-6.13c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.78.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.2-.72-.65-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

const channels = [
  {
    key: "email",
    label: site.publicEmail,
    sub: "Email",
    href: mailtoHref(site.publicEmail),
    icon: <MailIcon />,
    event: undefined,
  },
  {
    key: "call",
    label: formatPhoneForDisplay(site.businessPhone),
    sub: "Call",
    href: telHref(site.businessPhone),
    icon: <PhoneIcon />,
    event: analyticsEvents.clickCall,
  },
  {
    key: "whatsapp",
    label: formatPhoneForDisplay(site.businessWhatsApp),
    sub: "WhatsApp",
    href: whatsAppHref(site.businessWhatsApp, whatsAppDefaultMessage),
    icon: <WhatsAppIcon />,
    event: analyticsEvents.clickWhatsapp,
  },
] as const;

export function ContactChannels({ variant = "grid" }: { variant?: "grid" | "row" }) {
  return (
    <div
      className={
        variant === "grid"
          ? "grid gap-3 sm:grid-cols-3"
          : "flex flex-wrap gap-3"
      }
    >
      {channels.map((channel) => (
        <a
          key={channel.key}
          href={channel.href}
          target={channel.key === "whatsapp" ? "_blank" : undefined}
          rel={channel.key === "whatsapp" ? "noopener noreferrer" : undefined}
          onClick={() => channel.event && track(channel.event)}
          className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink-soft transition-colors hover:border-copper hover:text-ink"
        >
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-sage-pale text-sage">
            {channel.icon}
          </span>
          <span className="min-w-0">
            <span className="block text-xs text-muted">{channel.sub}</span>
            <span className="block break-words font-medium">{channel.label}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

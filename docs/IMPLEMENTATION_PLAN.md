# Implementation Plan — Carpenter & Carleton Immigration Platform

**Status:** Phase 1 complete; Phase 2 (conversion system) complete
**Source brief:** `Claude Code — Premium Immigration Website Build Brief v1.0` + `Market & Website Master Plan`

This document is the first deliverable required by the build brief (section 0). It records the
stack decision, page map, component/content model, integrations, and the accessibility/privacy/
security plan, then defines build phases with acceptance tests. It will be updated as phases land.

---

## 1. Stack decision

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 14 (App Router) + TypeScript** | Server components for fast, low-JS marketing pages; file-based routing matches the IA directly; strong SEO primitives (metadata API, sitemap, robots). |
| Styling | **Tailwind CSS** with a custom design-token theme (`tailwind.config.ts`) | Matches the brief's token system (`ink`, `canvas`, `sage`, `copper`...) 1:1; keeps components maintainable without a heavy component-library dependency. |
| Motion | **Framer Motion** | Scroll-reveal, line-draw and card-elevation motion with first-class `prefers-reduced-motion` support. |
| Forms | **React Hook Form + Zod** | Accessible client validation paired with a server-side Zod re-validation in the API route (never trust client validation alone). |
| Content model | **Typed local content modules** (`src/content/*.ts`) implementing the exact types from brief section 8 (`Service`, `Resource`, `Testimonial`, `FeeItem`, `ApprovalRecord`) | A real headless CMS (Sanity) requires a project/dataset/API token this environment cannot provision or validate. Shipping the identical TypeScript content shape now means swapping in Sanity (or Contentlayer/MDX) later is a data-source change, not an architecture change. This is called out as a launch input in section 12. |
| Email/Calendar/Analytics | **Adapter interfaces with a no-op/dev implementation** (`src/lib/adapters/*`) | Brief explicitly allows "placeholder adapter... once credentials are available." No real provider secrets exist in this environment. |
| Testing | **ESLint, `tsc --noEmit`, `next build`**, plus targeted unit tests (Vitest) for form/validation and route-rule logic | Playwright/Axe E2E is listed as a later-phase acceptance item once the conversion flows are complete; Chromium is preinstalled in this environment for when that lands. |
| Deployment | Unspecified (Vercel-compatible) | No hosting credentials exist yet; the app has zero Vercel-specific code lock-in. |

No existing stack was found in the repo (it was empty), so this is a fresh choice per the brief's
fallback instruction.

---

## 2. Page map (routes)

```
/                                  Home
/start-here                        Pathway Clarity Check (progressive flow)
/services                          Services index
/services/permanent-residence      PR & Express Entry (full template, Phase 1)
/services/provincial-nominee       PNP (template stub, Phase 3)
/services/work-permits-employers   Work permits & employers (employer/worker split)
/services/study-permits            Study & post-graduation planning
/services/family-sponsorship       Family sponsorship & Super Visa
/services/business-pathways        Business pathway assessment
/services/citizenship-pr-cards     Citizenship & PR cards
/services/complex-matters          Complex / time-sensitive matters (referral gate)
/how-it-works                      7-step engagement journey
/fees                              Fees & Consultation (FeeItem architecture, no live prices)
/resources                         Resources index (Policy Desk, Guides, FAQs, Official Links)
/about                             About Peter / Our Practice
/client-experience                 Client Experience (gated testimonials)
/contact                           Send a message (lightweight enquiry — Phase 2)
/book                               Book a Consultation (two-step scheduling flow — Phase 2)
/book/confirmation                 Stripe Checkout return URL — verifies payment, shows confirmation
/api/contact                       POST — contact enquiry (Zod-validated, Turnstile, timing check)
/api/callback                      POST — call-back request (config-flagged, off by default)
/api/book                          POST — booking submission (calendar + optional Stripe Checkout)
/api/book/availability             GET — bookable slots, 08:00–20:00 America/Toronto
/api/book/verify-session           GET — verifies a Stripe Checkout session for the confirmation page
/api/webhooks/stripe               POST — Stripe webhook, signature-verified server-side
/api/pathway-check                 POST — Pathway Clarity Check result (privacy-safe)
```

`primaryCta` (header button, most service-page and homepage CTAs) now points to `/book`. `/contact`
remains for a lighter, no-time-commitment enquiry and is still linked from the footer and the Fees
page ("Contact us for a written scope and fee agreement").

Phase 1 ships every route listed with real, reviewed layout and copy; routes marked "template stub"
get the full service-page template with clearly labeled placeholder body content rather than being
left as 404s, so the whole IA is navigable and testable end-to-end from day one.

---

## 3. Components and content model

### Layout
`SkipLink`, `TrustBar`, `SiteHeader` (desktop + mobile nav, keyboard/focus-managed), `SiteFooter`
(compliance module), `Container`, `Section`.

### Homepage sections (brief §5)
`HeroPathway` (ports the provided SVG prototype into a React/TSX component with the same
hover/focus/keyboard behavior and reduced-motion fallback), `DecisionStatement`, `PathwayCardGrid`,
`CarefulSupportPanel`, `ReadinessBriefTeaser`, `ProcessTimeline`, `PolicyDeskFeed`,
`ClientExperienceProof`, `FinalConversionBand`.

### Content model (`src/content/types.ts`)
Implements `Service`, `Resource`, `Testimonial`, `FeeItem`, `ApprovalRecord` exactly as specified
in brief §8, plus a `PathwayQuestion`/`PathwayRule` type for the Start Here flow. A `assertPublishable()`
guard throws/filters at build time if a `Service`/`Resource` is missing `officialSources`,
`lastReviewed`, or `approval`, and if a `Testimonial` is missing consent metadata — implementing the
brief's CMS approval guard without an actual CMS backend.

### Forms
`ContactForm` (`/contact` — country/status/goal/language/timeline intake, Zod schema shared with
`/api/contact`), `PathwayCheckFlow` (client-side state machine for `/start-here`, no server
round-trip needed until submission), `BookingFlow` (`/book` — two-step: consultation type + meeting
format/video platform, then dual-timezone slot picker + minimal enquiry fields), `CallbackRequestForm`
(config-flagged, off by default).

### Contact & conversion components (Phase 2)
`ContactChannels` (email/call/WhatsApp), `WhatsAppFloat` (sitewide floating entry point, dismissible
via `useSyncExternalStore` over `sessionStorage` rather than an effect, so there's no
hydration-mismatch risk), `StickyBookCTA` (mobile-only, appears on scroll, hides near the footer),
`FaqAccordion` (reused on `/contact` and `/book`), `NextAvailableSlotHint`, `BookingConfirmation`
(shared between the inline no-payment confirmation and the post-Stripe-redirect confirmation page).

### Booking domain (`src/lib/adapters/calendar.ts`, `src/lib/timezone.ts`)
`CalendarAdapter` interface with `listAvailability`/`requestBooking`. `devCalendarAdapter` generates
DST-safe 08:00–20:00 America/Toronto slots with no external dependency (the `zonedTimeToUtc` /
`offsetMinutesAt` helpers in `src/lib/timezone.ts` use the `Intl.DateTimeFormat` `formatToParts`
technique rather than a date library). `calComAdapter` calls Cal.com's v2 API when
`CALCOM_API_KEY`/`CALCOM_EVENT_TYPE_ID` are set and falls back to the dev adapter on any request
failure or unexpected response shape — the booking flow never breaks even if a field name has
drifted from what's documented below.

---

## 4. Integrations / secrets required (not present in this environment)

| Integration | Status | Notes |
|---|---|---|
| Sanity (or chosen CMS) project/token | **Not provisioned** | Content ships as typed local modules now; swap-in point documented above. |
| Cal.com | **Adapter built, real API wired, credentials not provisioned** | `src/lib/adapters/calendar.ts` calls Cal.com v2's `/slots` and `/bookings` endpoints per their publicly documented shape. Their docs/API returned HTTP 403 to this environment's outbound fetcher (bot protection), so exact current field names could not be double-checked live — verify against a real Cal.com sandbox before enabling in production. Falls back safely to the dev slot generator either way. |
| Resend (transactional email) | **Adapter built, real API wired, credentials not provisioned** | `src/lib/adapters/email.ts` posts to `api.resend.com/emails` (including `scheduled_at` for the 3-email pre-consultation sequence) once `RESEND_API_KEY` is set; the dev adapter logs only the template name otherwise. |
| Cloudflare Turnstile | **Client + server code built, keys not provisioned** | `src/components/forms/Turnstile.tsx` renders nothing without `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; `src/lib/turnstile.ts` treats verification as passed without `TURNSTILE_SECRET_KEY`. Forms currently rely on the honeypot field + a render-to-submit timing check + the in-memory rate limiter. |
| Stripe | **Checkout + webhook built, gated off** | `src/lib/payments.ts` requires both `PAYMENTS_ENABLED=true` and the relevant `FeeItem.approved === true` before any Checkout session is created; either gate closed keeps every booking request-only ("Fee confirmed in writing before any representation begins."). Webhook signature is verified server-side (`STRIPE_WEBHOOK_SECRET`) before any confirmation is sent — payment is never inferred from the client redirect alone. Apple Pay/Google Pay come free via Stripe Checkout's built-in wallet detection, no extra integration. |
| GA4 / PostHog | **Not provisioned** | No analytics script ships until a consent-managed provider + key exists; event names from brief §9 (plus `click_whatsapp`, `select_slot`, `select_meeting_format` added in Phase 2) are defined as constants ready to wire up. |
| Domain/hosting | **Not provisioned** | Out of scope for this repo. |

All of the above are also tracked in `docs/LAUNCH-INPUTS-CHECKLIST.md`.

---

## 5. Accessibility, privacy and security plan

**Accessibility (WCAG 2.2 AA target)**
- Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, logical heading order.
- Skip-to-content link, visible focus rings using the copper accent, no color-only meaning.
- Full keyboard operability for nav, mobile menu, pathway cards, hero SVG routes, and the Start Here
  flow (tab order, Enter/Space activation, Escape to close menus).
- `prefers-reduced-motion` respected everywhere Framer Motion or CSS animation is used.
- Accessible form labels/errors (`aria-invalid`, `aria-describedby`, error summary on submit).

**Privacy**
- Minimum data collection; marketing opt-in is a separate checkbox from service-enquiry consent.
- No file upload field on any public form (brief §3, §6.4, §11 item 9).
- No raw PII sent to analytics/console/error tools — form handler logs only non-PII event metadata.
- Explicit "do not send passports/bank statements/portal passwords" notice on contact/booking forms.

**Security**
- Zod schema validated server-side in every API route (never trust client-only validation).
- Honeypot field + a render-to-submit timing check (`src/lib/form-timing.ts`) + basic IP/time-window
  rate limiting on `/api/contact`, `/api/book`, `/api/callback` and `/api/pathway-check`.
- Cloudflare Turnstile verified server-side when configured (`src/lib/turnstile.ts`); a no-op pass
  when it isn't, so forms stay usable either way.
- No secrets in source; `.env.example` documents required keys without values. `server-only` guards
  `src/lib/adapters/email.ts`, `src/lib/payments.ts` and `src/lib/server/internal-contact.ts` so a
  build fails loudly if any client component ever imports them.
- Stripe secret key and webhook secret never reach the client bundle (verified against the built
  `.next/static` output); Checkout is created server-side and the browser only ever receives a
  redirect URL. The webhook route verifies `stripe-signature` against the raw request body before
  trusting any event.
- Peter's secondary phone number is exported only from a `server-only`-guarded module and is not
  rendered anywhere in the current UI — see `docs/LAUNCH-INPUTS-CHECKLIST.md`.
- No Government of Canada / CICC logos or crests anywhere; CICC Public Register is a plain text link.

---

## 6. Build phases and acceptance tests

### Phase 1 — Foundation (this PR)
Design tokens, layout shell (trust bar/header/footer/skip link), full route map with real content or
clearly labeled placeholders, typed content model + seed data, homepage with all 9 sections, Start
Here flow, booking form with Zod validation + honeypot + rate limiting, docs (`IMPLEMENTATION_PLAN.md`,
`LAUNCH-INPUTS-CHECKLIST.md`).

**Acceptance:** `npm run lint`, `tsc --noEmit`, and `npm run build` all pass; every route in the page
map resolves; mobile nav opens/closes via mouse and keyboard; no invented licensing/price/testimonial
claim exists anywhere in seed content.

### Phase 2 — Conversion system (this PR)
Real contact details wired sitewide from a single source of truth (`src/content/site.ts`); a working
`/contact` enquiry form (country/status/goal/language/timeline, Turnstile-ready, honeypot + timing +
rate-limited); email/call/WhatsApp contact channels plus a sitewide floating WhatsApp button and a
mobile sticky booking bar; a full `/book` two-step scheduling flow (consultation type → meeting
format/video platform → dual-timezone slot picker → minimal enquiry) backed by a DST-safe dev slot
generator and a real (fallback-safe) Cal.com v2 adapter; a gated Stripe Checkout integration that
stays request-only until `PAYMENTS_ENABLED` and a specific `FeeItem.approved` are both true; a
3-email pre-consultation sequence; a config-flagged call-back request form; `ProfessionalService`
JSON-LD with only confirmed NAP fields; every primary "Book a Consultation" CTA sitewide repointed
from `/contact` to `/book`.

**Acceptance:** `npm run lint`, `tsc --noEmit` and `npm run build` all pass (33 routes generated).
Manually verified against the production build: `/`, `/book`, `/contact`, `/book/confirmation` and a
service page all return 200; `/api/book/availability` returns correctly-windowed Toronto slots; a
full `/api/book` submission (no payment configured) returns a reference and triggers the 3-email dev
log sequence with no PII in the log output; the honeypot rejects a spam-shaped submission with 400.
Confirmed via `grep` against `.next/static` that neither `STRIPE_SECRET_KEY` nor the secondary phone
number appear in the client bundle. Deferred to Phase 4 (not yet run): Playwright + Axe automated
pass — see `docs/LAUNCH-INPUTS-CHECKLIST.md` for the credentials Phase 2's real integrations still
need before they're live (Cal.com, Resend, Turnstile, Stripe).

### Phase 3 — Editorial authority
Full content for all remaining service pages, Policy Desk articles, FAQs, internal linking, SEO
metadata/sitemap/robots, `LocalBusiness`/`ProfessionalService` structured data (only once NAP is
approved).

**Acceptance:** every published service/resource page has official sources + `lastReviewed` + caveat
+ CTA; `assertPublishable()` guard passes for all published content.

### Phase 4 — Premium polish
Final photography/illustration system, expanded motion polish, consented testimonial system,
Lighthouse/Axe/Playwright test suite, cross-browser QA.

**Acceptance:** Lighthouse Performance 90+ mobile, Axe has zero critical violations on Home/Start
Here/Booking, Playwright happy-path passes.

---

## 7. Open questions / risks tracked separately

See `docs/LAUNCH-INPUTS-CHECKLIST.md` for every business fact (legal name, RCIC display wording,
address/phone, fees, biography, languages, policies, credentials) that blocks public launch and
requires Peter's sign-off.

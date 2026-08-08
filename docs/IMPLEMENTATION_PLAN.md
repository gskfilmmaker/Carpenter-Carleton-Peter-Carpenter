# Implementation Plan — Carpenter & Carleton Immigration Platform

**Status:** Phase 1 complete; Phase 2 (conversion system) complete; Phase 2b (payments finalization, real transactional email, test infrastructure) complete
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
| Testing | **ESLint, `tsc --noEmit`, `next build`, Vitest** (`npm test` — 33 tests across statement-descriptor/tax-config/timezone-DST/validation-schema/site-config coverage) **and Playwright + `@axe-core/playwright`** (`npm run test:e2e` — accessibility + keyboard-navigation pass on `/book`, `/book/confirmation`, `/contact`, `/privacy`, using the environment's preinstalled Chromium at `/opt/pw-browsers/chromium`) | The Axe pass caught a real WCAG AA color-contrast failure (the `--color-muted` token and one footer text color) during Phase 2b — both fixed, not suppressed; see section 5. |
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
| Resend (transactional email) | **Adapter built, real API wired, credentials not provisioned** | `src/lib/adapters/email.ts` posts to `api.resend.com/emails` (including `scheduled_at` for the legacy 3-email pre-consultation sequence) once `RESEND_API_KEY` is set; sends "from" `info@carpentercarleton.ca` / reply-to same, to both the client and — for paid bookings — `getInternalNotificationRecipients()` (`info@carpentercarleton.ca` + `carpenter@bellnet.ca`, server-only, see section 5). If a send fails (most likely: the domain isn't verified in Resend yet), it automatically retries once from Resend's sandbox sender (`onboarding@resend.dev`) and logs a warning — never a silent drop. The dev adapter (no key set) logs only the template name and recipient count, never an address or body. |
| Cloudflare Turnstile | **Client + server code built, keys not provisioned** | `src/components/forms/Turnstile.tsx` renders nothing without `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; `src/lib/turnstile.ts` treats verification as passed without `TURNSTILE_SECRET_KEY`. Forms currently rely on the honeypot field + a render-to-submit timing check + the in-memory rate limiter. |
| Stripe | **Checkout + webhook built and exercised (error paths only — no real test-mode charge could be run, see section 6)** | Single GSK Productions Inc. account, GSK as merchant of record — **not** Stripe Connect, no connected-accounts/onboarding/transfer code exists. `src/lib/payments.ts` requires both `PAYMENTS_ENABLED=true` and the relevant `FeeItem.approved === true` before any Checkout session is created (the `consultation` tier is `amount: 250, approved: true` per explicit instruction — see `docs/LAUNCH-INPUTS-CHECKLIST.md`); either gate closed keeps every booking request-only ("Fee confirmed in writing before any representation begins."). Every Checkout Session sets `payment_intent_data.statement_descriptor` to `getStatementDescriptor()` (default `"CARPENTER CARLETON"`, sanitized/truncated per Stripe's rules in `src/lib/statement-descriptor.ts`) so the charge doesn't show as "GSK" on the client's card statement, and `receipt_email` so Stripe emails its own receipt too. Tax is a separate line item computed from `NEXT_PUBLIC_CONSULT_TAX` (`src/lib/tax-config.ts`) when it parses a percentage, otherwise no tax line is added and the UI/emails show a "to be confirmed" note — nothing is guessed. The webhook (`checkout.session.completed`) is idempotent on the Stripe session id (`src/lib/booking-store.ts`, in-memory) — a duplicate delivery is a no-op — and is the **only** place a booking is finalized: the calendar event, join link, and both confirmation emails are created there, never at Checkout-session-creation time, so a browser back-button or abandoned checkout never books or emails anything. Apple Pay/Google Pay come free via Stripe Checkout's built-in wallet detection, no extra integration. |
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
  trusting any event, and is idempotent on the Stripe session id so a retried delivery can't
  double-book or double-email (`src/lib/booking-store.ts`).
- Peter's secondary phone number **and** the internal-notification recipient list
  (`carpenter@bellnet.ca`) are exported only from `src/lib/server/internal-contact.ts`
  (`server-only`-guarded) rather than the shared `site` config — an Axe/bundle audit during Phase 2b
  caught `carpenter@bellnet.ca` leaking into a client chunk when it briefly lived on `site` instead
  (that object is imported by client components like the header/footer, so anything on it ships
  client-side even if never rendered). Fixed by moving it; a `grep` against `.next/static` after the
  fix confirms it no longer appears. This is the general rule for anything internal-only added to
  this codebase going forward: if it has no client-side purpose, it does not belong on `site`.
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

### Phase 2b — Payments finalization, real transactional email & test infrastructure (this PR)
Flips the consultation fee to the real $250 CAD figure (`approved: true`, per explicit
instruction); reorders the booking flow so the calendar event, join link and confirmation emails
are only ever created by the webhook after Stripe confirms payment (previously the calendar
reservation happened before payment); adds a per-charge Stripe statement descriptor
(`"CARPENTER CARLETON"`, sanitized against Stripe's character/length rules) so charges from GSK's
single Stripe account are recognizable to the client rather than showing as "GSK"; adds an
env-driven, never-guessed tax line (`NEXT_PUBLIC_CONSULT_TAX`); makes the webhook idempotent on the
Stripe session id; wires a real Resend integration (verified-domain sender with an automatic
sandbox-sender fallback and warning log, dual-recipient internal notifications, richer client
confirmation copy); adds the "Site managed by GSK Productions Inc." footer credit and a truthful
GSK-as-payment-processor disclosure on `/privacy`; and sets up real test infrastructure (Vitest unit
tests, Playwright + Axe accessibility tests) where none existed before.

**Acceptance:** `npm run lint`, `npx tsc --noEmit`, `npm test` (33/33 passing) and
`npm run test:e2e` (8/8 passing, including a full Axe pass on `/book`, `/book/confirmation`,
`/contact`, `/privacy`) all pass, alongside `npm run build` (33 routes). A `grep` against the built
`.next/static` output confirms no Stripe secret, no Resend key, and no internal-only contact detail
(`carpenter@bellnet.ca`) reaches the client bundle. The Axe pass surfaced and led to fixing one real
pre-existing WCAG AA contrast failure (`--color-muted` token, 4.28:1 → 5.86:1 against white) and one
introduced by this phase's own new footer line (`text-slate-500` → `text-slate-400`, 3.07:1 →
5.71:1 against `bg-ink`) — both confirmed via a computed-contrast check, not just re-running Axe
once.

**What could not be verified in this sandbox, and why:** end-to-end Stripe test-card charges. No
live (even test-mode) Stripe API keys exist in this environment, and this sandbox's outbound network
goes through a proxy with no Stripe credentials configured. What *was* verified: the code compiles
and typechecks; the dev-fallback (no-payment) booking path works end-to-end against the running
production build; feeding a syntactically-valid-but-fake `STRIPE_SECRET_KEY` exercises the Checkout
Session creation code path and confirms it fails closed (500 with a clean user-facing error, no
crash, no partial booking) rather than silently succeeding; the webhook correctly rejects a request
with no valid signature. A real test-mode charge — confirming the statement descriptor actually
appears on the resulting PaymentIntent, the tax line renders as expected, and the full
payment→webhook→calendar→dual-email chain fires — needs to be run by whoever has real Stripe test
keys, ideally in a staging deployment before going anywhere near live keys.

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

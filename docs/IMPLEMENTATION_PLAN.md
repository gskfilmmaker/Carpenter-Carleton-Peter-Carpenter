# Implementation Plan — Carpenter & Carleton Immigration Platform

**Status:** Phase 1 in progress
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
/contact                           Contact / Book Consultation
/api/booking                       POST — booking/service enquiry (Zod-validated)
/api/pathway-check                 POST — Pathway Clarity Check result (privacy-safe)
```

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
`ContactForm` (Zod schema shared between client and `/api/booking` route), `PathwayCheckFlow`
(client-side state machine, no server round-trip needed until submission).

---

## 4. Integrations / secrets required (not present in this environment)

| Integration | Status | Notes |
|---|---|---|
| Sanity (or chosen CMS) project/token | **Not provisioned** | Content ships as typed local modules now; swap-in point documented above. |
| Calendly / Cal.com / Google/Microsoft Calendar | **Not provisioned** | Booking route currently stores/echoes a structured request via the adapter interface; no calendar write happens. |
| Resend (or transactional email) | **Not provisioned** | Email adapter is a typed interface with a dev console logger; no PII leaves the server. |
| Cloudflare Turnstile (or equivalent) | **Not provisioned** | Honeypot field + basic in-memory rate limit ship now; Turnstile site/secret key is a launch input. |
| GA4 / PostHog | **Not provisioned** | No analytics script ships until a consent-managed provider + key exists; event names from brief §9 are defined as constants ready to wire up. |
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
- Zod schema validated server-side in the API route (never trust client-only validation).
- Honeypot field + basic IP/time-window rate limiting on `/api/booking` and `/api/pathway-check`.
- No secrets in source; `.env.example` documents required keys without values.
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

### Phase 2 — Conversion system
Wire a real calendar adapter once credentials exist; CRM lead adapter; email templates; resource/
lead-magnet gated download flow; expand Pathway Clarity Check result copy with Peter-approved route
rules.

**Acceptance:** end-to-end Home → Start Here → result → booking → confirmation works with no console
PII leakage.

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

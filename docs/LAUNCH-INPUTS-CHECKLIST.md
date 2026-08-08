# Launch Inputs Checklist

These are the business facts and decisions that **block public launch**. Everything in this
codebase uses clearly labelled, safe placeholders in their place — nothing here should be treated
as approved, and nothing on the live site should go public until Peter has signed off on each item.
See build brief section 12 and master-plan section 10 for the source requirements.

## Blockers

- [ ] **Approved firm/legal marketing name and spelling.** The current site uses "Carpenter &
      Carleton"; confirm this matches the registered/marketing name exactly (the CICC register
      shows a different employer-name spelling — reconcile before publishing).
- [ ] **Peter's approved RCIC display wording, license number and CICC register link
      presentation.** Currently shown: "Peter Carpenter, RCIC — College ID R408495" with a link to
      the CICC Public Register. Confirm exact wording.
- [x] **Public email and office address** — `info@carpentercarleton.ca` and `3062 Lake Shore Blvd
      W, Etobicoke, ON M8V 4C9` (`src/content/site.ts`), the address corroborated by the firm's
      Google Business Profile and an independent directory listing. Also now included in the
      `ProfessionalService` structured data (`src/components/seo/StructuredData.tsx`).
- [ ] **Phone number conflict — unresolved, do not launch without fixing.** The site currently
      publishes `+1 647 861 3970` for both calls and WhatsApp (previously supplied as "real,
      current"). Research for this checklist turned up two *different* numbers for the same firm:
      the Google Business Profile shows `(905) 271-7733`, and an independent directory listing
      shows `(416) 252-7733`. All three could be legitimate (e.g. a WhatsApp/mobile line kept
      separate from an office landline), or one or two may be stale — **confirm with Peter which
      number(s) are current before launch**, then update `site.businessPhone` /
      `site.businessWhatsApp` in `src/content/site.ts` accordingly.
- [ ] **Office hours.** Not published anywhere on the site yet. Only one data point surfaced in
      research ("opens 9am Monday") — not enough to publish a full weekly schedule. Get the
      complete hours from Peter, then add them to the footer/About page and as
      `openingHoursSpecification` in the structured data.
- [ ] **Peter's direct line — confirm it should stay unpublished.** Stored server-only in
      `src/lib/server/internal-contact.ts`, gated by `SHOW_SECONDARY_PHONE` (default off). Nothing
      in the current UI renders it. Confirm this is the intended posture before any internal/staff
      view is built to surface it.
- [ ] **Final approved service scope and referral protocol**, especially for the Complex /
      Time-Sensitive Matters page (`/services/complex-matters`).
- [ ] **HST/tax treatment on the $250 CAD consultation fee.** `src/content/fees.ts`'s
      `consultation` tier is now `amount: 250, approved: true` (per explicit instruction to this
      repo — not independently verified with Peter). Tax is **not** hard-coded: it's read from
      `NEXT_PUBLIC_CONSULT_TAX` (`src/lib/tax-config.ts`) and left unset shows a clearly-labelled
      "to be confirmed with Peter's accountant" note everywhere the fee appears (booking UI, Stripe
      Checkout line items, confirmation emails). Get Peter's accountant's answer, then set
      `NEXT_PUBLIC_CONSULT_TAX` (e.g. `"HST 13%"`, or `"Taxes included"` if no separate line should
      show).
- [ ] **Refund/cancellation wording.** The confirmation page and emails currently say "reply to
      your confirmation email and we'll find a new time — there's no charge for rescheduling with
      reasonable notice" as a truthful-but-placeholder policy (`src/components/booking/
      BookingConfirmation.tsx`, `src/lib/adapters/email.ts`). Replace with Peter's actual final
      policy once written.
- [ ] **Peter's written OK that consultation fees may be processed through GSK Productions Inc.'s
      Stripe account as merchant of record.** This is a single existing GSK-owned Stripe account
      (not Stripe Connect) — GSK, not Carpenter & Carleton, is the entity Stripe and the client's
      card issuer see. The footer credit and `/privacy` already disclose this truthfully
      (`site.managedBy`), but that disclosure is not the same as Peter's sign-off on the
      arrangement itself.
- [ ] **Which scheduling provider to use, and its credentials.** `/book` defaults to a built-in
      08:00–20:00 America/Toronto slot generator; wiring `CALCOM_API_KEY` + `CALCOM_EVENT_TYPE_ID`
      switches to real Cal.com availability/booking. (Calendly was the build brief's other named
      option — the current adapter targets Cal.com specifically; swapping to Calendly is a new
      adapter implementation, not a config change, if that's preferred instead.)
- [ ] **Live Stripe keys and go-live decision for paid booking.** `STRIPE_SECRET_KEY`,
      `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` and `PAYMENTS_ENABLED=true` are all
      required in the Vercel project's environment variables — **this repo cannot set them for
      you**; it's a manual step in the Vercel dashboard (Project → Settings → Environment
      Variables). Test in Stripe test mode first. `STATEMENT_DESCRIPTOR` defaults to
      `"CARPENTER CARLETON"` and doesn't need to be set unless the wording should change.
- [ ] **Resend domain verification for carpentercarleton.ca.** See "Email deliverability" below —
      exact record types and the manual step to get the real values.
- [ ] **In-person meetings — offer them or not?** `features.inPersonMeetings` in
      `src/content/site.ts` defaults to `false` (video/phone only in the `/book` flow). Flip it once
      an office/meeting address exists.
- [ ] **Call-back request feature — enable it?** `features.callbackRequest` defaults to `false`;
      the form and `/api/callback` route are built but hidden until enabled.
- [ ] **Final approved biography, headshot and brand assets** for the About page.
- [ ] **Approved languages and qualified translation/review process** before any non-English
      content ships.
- [ ] **Privacy policy, cookie policy, retention policy and consent wording** — `/privacy` is a
      placeholder pending this input.
- [ ] **CRM and secure client-document portal.** Not yet built (no CRM lead-sync adapter or
      authenticated document upload exists — booking/contact submissions currently only trigger
      email notifications, with no persistence layer / database in this environment).
- [ ] **Analytics (GA4/PostHog) credentials.** Event names are defined and call sites wired
      (`src/lib/analytics.ts`); no script loads until a consent-managed provider + key exists.
- [ ] **Approved testimonials and review permissions.** `src/content/testimonials.ts` ships empty;
      nothing renders on `/client-experience` or the homepage proof section until consent +
      approval metadata exists for a specific quotation.
- [ ] **Domain/hosting ownership and a redirect plan for legacy URLs** from
      `canadaimmigrationhelp.ca` (currently showing an "Account Suspended" page per the market
      research — see master plan section 1.3 for the recommended 10-day rescue plan).
- [ ] **Cloudflare Turnstile site/secret keys.** The widget and server verification are built
      (`src/components/forms/Turnstile.tsx`, `src/lib/turnstile.ts`) and activate automatically once
      `NEXT_PUBLIC_TURNSTILE_SITE_KEY`/`TURNSTILE_SECRET_KEY` are set; until then, forms rely on the
      honeypot field, a render-to-submit timing check, and a basic in-memory rate limiter.
- [ ] **Sign-off on every service page's content** (`src/content/services.ts`) and every Policy
      Desk article (`src/content/resources.ts`) — each currently has `approval.approved: false`
      and a visible "draft" badge until reviewed.

## Email deliverability — Resend domain verification for carpentercarleton.ca

Sending "from" `info@carpentercarleton.ca` only works once that domain is verified in Resend
(Resend dashboard → **Domains** → **Add Domain** → `carpentercarleton.ca`). Resend then **generates
and displays the exact records to add** — the DKIM key value in particular is unique per domain and
per account, so **it cannot be written here in advance**; anyone who tells you otherwise is
guessing. What can be documented up front is the record *types* Resend's flow will ask for, based
on their public documentation (Resend sends through Amazon SES infrastructure):

| Record | Type | Host (typical) | Value |
|---|---|---|---|
| SPF | TXT | `carpentercarleton.ca` (or `send.carpentercarleton.ca` if Resend assigns a subdomain) | `v=spf1 include:amazonses.com ~all` — **confirm exact value in the Resend dashboard**, it may combine with an existing SPF record if one already exists for this domain |
| DKIM | CNAME (usually 3 records) | Resend-generated, e.g. `resend._domainkey.carpentercarleton.ca` and similar | **Resend-generated per domain — copy verbatim from the dashboard** |
| DMARC (recommended, not required by Resend) | TXT | `_dmarc.carpentercarleton.ca` | Suggested starting point: `v=DMARC1; p=none; rua=mailto:info@carpentercarleton.ca` (monitor-only; tighten to `p=quarantine` once mail flow is confirmed clean) |

**Until this is done:** `src/lib/adapters/email.ts` automatically retries any failed send from
Resend's shared sandbox sender (`onboarding@resend.dev`) and logs a warning — mail still goes out,
it just won't carry the `carpentercarleton.ca` domain in the From address until verification is
complete. Nothing is ever silently dropped.

## Notes for whoever picks this list up

- Every content type in `src/content/types.ts` carries an `approval`/`lastReviewed`/
  `officialSources` shape specifically so a reviewer can see, per item, whether it is launch-ready.
- Nothing above blocks *internal* review or staging deployment — only public marketing launch.
- `src/lib/rate-limit.ts` is process-local (in-memory), fine for a single-instance deployment but
  should move to a shared store (Upstash/Redis) before a multi-instance production deployment.
- `src/lib/booking-store.ts` (idempotency + confirmation-page detail cache for paid bookings) is
  also process-local/in-memory, same caveat — a cold start between the webhook firing and the
  visitor's redirect landing is the one edge case that shows "check your email" instead of full
  details on `/book/confirmation`. Needs a real database before a multi-instance production
  deployment; tracked alongside the CRM/database item below.
- No database/persistence layer exists yet — `/api/book`, `/api/contact` and the Stripe webhook are
  otherwise stateless (they trigger emails and, for `/api/book`, a Stripe Checkout session, but
  nothing durable is stored server-side beyond process memory). A CRM/database is an open input.
- The calendar event (and its join link) for a paid booking is only created **after** Stripe
  confirms payment (in the webhook), per this task's explicit ordering requirement. That means the
  slot itself isn't reserved while a client is on the Stripe payment page — a real concurrency-safe
  hold (via Cal.com's own booking-hold mechanism, or reserving at Checkout-session-creation time
  and releasing on expiry/cancel) is worth revisiting once real traffic volume makes double-booking
  a practical risk rather than a theoretical one.

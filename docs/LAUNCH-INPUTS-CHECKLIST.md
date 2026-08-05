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
- [x] **Public email, phone and WhatsApp number** — supplied directly and wired sitewide via
      `src/content/site.ts` (`info@carpentercarleton.ca`, `+1 647 861 3970`). Still open: **exact
      office address** and **hours** (`site.addressLine` remains a placeholder), and confirmation
      that publishing the phone/WhatsApp number as given is approved for public use.
- [ ] **Peter's direct line — confirm it should stay unpublished.** Stored server-only in
      `src/lib/server/internal-contact.ts`, gated by `SHOW_SECONDARY_PHONE` (default off). Nothing
      in the current UI renders it. Confirm this is the intended posture before any internal/staff
      view is built to surface it.
- [ ] **Final approved service scope and referral protocol**, especially for the Complex /
      Time-Sensitive Matters page (`/services/complex-matters`).
- [ ] **Final consultation and representation fee schedule**, taxes, payment/cancellation/refund
      policy. The Fees page (`/fees`) and `src/content/fees.ts` ship with structure only — every
      tier's `approved` flag is intentionally false. The `consultation` tier carries an
      **illustrative test-mode `amount` ($150 CAD)** purely so the Stripe integration could be
      wired and exercised end-to-end — it is never rendered publicly and must be replaced with
      Peter's actual approved figure (or removed) before `PAYMENTS_ENABLED` is ever set to `true`.
- [ ] **Which scheduling provider to use, and its credentials.** `/book` defaults to a built-in
      08:00–20:00 America/Toronto slot generator; wiring `CALCOM_API_KEY` + `CALCOM_EVENT_TYPE_ID`
      switches to real Cal.com availability/booking. (Calendly was the build brief's other named
      option — the current adapter targets Cal.com specifically; swapping to Calendly is a new
      adapter implementation, not a config change, if that's preferred instead.)
- [ ] **Live Stripe keys and go-live decision for paid booking.** `STRIPE_SECRET_KEY`,
      `STRIPE_WEBHOOK_SECRET` and `PAYMENTS_ENABLED=true` are all required, **and** the specific
      `FeeItem.approved` must be flipped to `true`, before any consultation fee can be charged.
      Test in Stripe test mode first.
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

## Notes for whoever picks this list up

- Every content type in `src/content/types.ts` carries an `approval`/`lastReviewed`/
  `officialSources` shape specifically so a reviewer can see, per item, whether it is launch-ready.
- Nothing above blocks *internal* review or staging deployment — only public marketing launch.
- `src/lib/rate-limit.ts` is process-local (in-memory), fine for a single-instance deployment but
  should move to a shared store (Upstash/Redis) before a multi-instance production deployment.
- No database/persistence layer exists yet — `/api/book` and `/api/contact` are stateless (they
  trigger emails and, for `/api/book`, an optional Stripe Checkout session, but nothing is stored
  server-side beyond that request). A CRM/database is listed above as an open input.

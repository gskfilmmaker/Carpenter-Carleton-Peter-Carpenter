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
- [ ] **Verified business address, public telephone, public email, hours and service area.**
      Currently placeholders in `src/content/site.ts`.
- [ ] **Final approved service scope and referral protocol**, especially for the Complex /
      Time-Sensitive Matters page (`/services/complex-matters`).
- [ ] **Final consultation and representation fee schedule**, taxes, payment/cancellation/refund
      policy. The Fees page (`/fees`) and `src/content/fees.ts` ship with structure only — every
      `amount` and `approved` flag is intentionally empty/false.
- [ ] **Final approved biography, headshot and brand assets** for the About page.
- [ ] **Approved languages and qualified translation/review process** before any non-English
      content ships.
- [ ] **Privacy policy, cookie policy, retention policy and consent wording** — `/privacy` is a
      placeholder pending this input.
- [ ] **CRM, booking calendar (Calendly/Cal.com/Google/Microsoft), email provider (e.g. Resend),
      secure client-document portal, and analytics (GA4/PostHog) credentials.** Adapter interfaces
      exist (`src/lib/adapters/*`) with no-op dev implementations; wiring a real provider is a
      credential change, not a code change.
- [ ] **Approved testimonials and review permissions.** `src/content/testimonials.ts` ships empty;
      nothing renders on `/client-experience` or the homepage proof section until consent +
      approval metadata exists for a specific quotation.
- [ ] **Domain/hosting ownership and a redirect plan for legacy URLs** from
      `canadaimmigrationhelp.ca` (currently showing an "Account Suspended" page per the market
      research — see master plan section 1.3 for the recommended 10-day rescue plan).
- [ ] **Cloudflare Turnstile (or equivalent) site/secret keys.** Forms currently rely on a
      honeypot field and a basic in-memory rate limiter only.
- [ ] **Sign-off on every service page's content** (`src/content/services.ts`) and every Policy
      Desk article (`src/content/resources.ts`) — each currently has `approval.approved: false`
      and a visible "draft" badge until reviewed.

## Notes for whoever picks this list up

- Every content type in `src/content/types.ts` carries an `approval`/`lastReviewed`/
  `officialSources` shape specifically so a reviewer can see, per item, whether it is launch-ready.
- Nothing above blocks *internal* review or staging deployment — only public marketing launch.

# Carpenter & Carleton — Immigration Advisory Platform

A premium, conversion-led, regulatory-conscious Canadian immigration advisory website for
Carpenter & Carleton / Peter Carpenter, RCIC. Built with Next.js (App Router), TypeScript and
Tailwind CSS.

Start with `docs/IMPLEMENTATION_PLAN.md` for the stack decision, page map, content model and build
phases, and `docs/LAUNCH-INPUTS-CHECKLIST.md` for the business facts that must be approved before
public launch.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — start the development server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npx tsc --noEmit` — TypeScript check

## Project structure

```
src/
  app/            Routes (App Router)
  components/     Reusable UI, layout and page-section components
  content/        Typed local content model + seed data (Service, Resource, Testimonial, FeeItem…)
  lib/            Validation schemas, adapters (email/calendar), rate limiting, analytics stubs
docs/             Implementation plan and launch-inputs checklist
```

No real licensing, price, testimonial or biographical claim ships until Peter approves it — see the
`approval` metadata on every content item in `src/content/`.

import "server-only";

/**
 * Peter's direct line. NOT part of `site` in src/content/site.ts on purpose — that module is
 * imported by client components (header, footer) and anything exported there ships in the client
 * bundle. This module is guarded by the `server-only` package, which throws a build error if any
 * client component ever imports it, so the secondary phone number cannot leak into the public
 * bundle by accident.
 *
 * Nothing in the current site renders this — it exists for a future internal/staff-only surface
 * (e.g. an authenticated admin view). SHOW_SECONDARY_PHONE defaults to false/unset.
 */
const SECONDARY_PHONE = "+14169962168";

export function getSecondaryPhone(): string | null {
  return process.env.SHOW_SECONDARY_PHONE === "true" ? SECONDARY_PHONE : null;
}

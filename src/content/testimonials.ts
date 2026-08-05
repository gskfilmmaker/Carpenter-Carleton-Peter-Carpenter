import type { Testimonial } from "@/content/types";

/**
 * No client testimonial ships until written consent evidence and public-use approval exist
 * (build brief section 3 / 7). This list stays empty in Phase 1 — the Client Experience page
 * renders its consent-gated empty state rather than any placeholder quote, so nothing resembling
 * a real endorsement is ever fabricated.
 */
export const testimonials: Testimonial[] = [];

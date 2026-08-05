/**
 * Consent-managed analytics event names (build brief section 9). No provider (GA4/PostHog) is
 * wired up yet — `track()` only logs the event name and safe, non-PII metadata so call sites are
 * ready to connect a real, consent-gated provider later without changing components.
 */

export const analyticsEvents = {
  viewServicePage: "view_service_page",
  startPathwayCheck: "start_pathway_check",
  completePathwayCheck: "complete_pathway_check",
  viewReadinessBrief: "view_readiness_brief",
  clickBookConsultation: "click_book_consultation",
  beginBooking: "begin_booking",
  completeBookingRequest: "complete_booking_request",
  leadMagnetDownload: "lead_magnet_download",
  resourceSubscribe: "resource_subscribe",
  clickCall: "click_call",
  clickWhatsapp: "click_whatsapp",
  clickCiccVerify: "click_cicc_verify",
  selectSlot: "select_slot",
  selectMeetingFormat: "select_meeting_format",
} as const;

export type AnalyticsEvent = (typeof analyticsEvents)[keyof typeof analyticsEvents];

export function track(event: AnalyticsEvent, metadata: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined") return;
  console.debug(`[analytics:dev] ${event}`, metadata);
}

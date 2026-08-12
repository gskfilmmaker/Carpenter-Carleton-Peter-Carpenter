import "server-only";

/**
 * Every booking/enquiry notification goes to both mailboxes. Kept here rather than on `site` for
 * the same reason as the secondary phone above: nothing about this list is client-facing (it's
 * only read from src/app/api/webhooks/stripe/route.ts and the /api/contact, /api/callback routes),
 * so it has no reason to ship in the client bundle — an Axe/bundle audit caught it doing exactly
 * that when it briefly lived on `site` instead.
 */
export function getInternalNotificationRecipients(): string[] {
  return ["info@carpentercarleton.ca", "carpenter@bellnet.ca"];
}

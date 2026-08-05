/** Minimum plausible time (ms) between a form rendering and a human submitting it. */
const MIN_HUMAN_SUBMIT_MS = 1500;

/** `renderedAt` is a client timestamp (Date.now()) captured on mount and posted with the form. */
export function submittedTooFast(renderedAt: number | undefined): boolean {
  if (!renderedAt) return false;
  return Date.now() - renderedAt < MIN_HUMAN_SUBMIT_MS;
}

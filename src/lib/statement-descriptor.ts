/**
 * Pure string logic, deliberately NOT `server-only` — it touches no secret, just formats a public
 * label, and needs to be unit-testable directly (importing anything `server-only`-guarded throws
 * outside Next's bundler resolution, including in plain Vitest). See src/lib/payments.ts for the
 * server-only wrapper that reads `process.env.STATEMENT_DESCRIPTOR` and calls this.
 *
 * Stripe's `statement_descriptor` rules: max 22 characters, must contain at least one letter, and
 * cannot contain < > \ ' " * or line breaks.
 */
const DEFAULT_STATEMENT_DESCRIPTOR = "CARPENTER CARLETON";

export function sanitizeStatementDescriptor(input: string): string {
  const cleaned = input
    .replace(/[<>\\'"*\n\r\t]/g, "")
    .trim()
    .slice(0, 22);
  return /[a-zA-Z]/.test(cleaned) ? cleaned : DEFAULT_STATEMENT_DESCRIPTOR;
}

export { DEFAULT_STATEMENT_DESCRIPTOR };

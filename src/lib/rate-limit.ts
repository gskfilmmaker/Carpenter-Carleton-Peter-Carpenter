/**
 * Minimal in-memory rate limiter for public form endpoints. This is process-local — fine for a
 * single-instance deployment, but a multi-instance production deployment should replace it with a
 * shared store (Upstash/Redis) before launch. Tracked as a launch input.
 */

const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;

export function isRateLimited(key: string, limit = 5): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);
  return timestamps.length > limit;
}

export function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

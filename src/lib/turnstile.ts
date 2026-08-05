import "server-only";

/**
 * Verifies a Cloudflare Turnstile token server-side. Returns true (i.e. "passed") when
 * TURNSTILE_SECRET_KEY isn't configured, matching the client component's graceful no-op — this
 * environment has no live Turnstile credentials, so spam protection currently relies on the
 * honeypot field + submit-timing check + rate limiter. Wire a real secret key to activate it with
 * no call-site changes.
 */
export async function verifyTurnstile(token: string | undefined, remoteIp?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: remoteIp }),
    });
    const result: { success: boolean } = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("[turnstile] verification request failed", error);
    return false;
  }
}

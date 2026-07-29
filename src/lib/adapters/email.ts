/**
 * Transactional email adapter interface (build brief section 8/12: "Resend (or provider adapter)").
 * No email provider credentials exist in this environment, so the dev implementation only logs
 * non-PII metadata — it never prints recipient addresses or message bodies to the console/log
 * stream, and it never actually sends anything. Swap `devEmailAdapter` for a real provider once
 * `RESEND_API_KEY` (or equivalent) is configured, without changing any call site.
 */

export type EmailMessage = {
  to: string;
  template: "booking-confirmation" | "pathway-check-summary" | "resource-download";
  data: Record<string, unknown>;
};

export interface EmailAdapter {
  send(message: EmailMessage): Promise<{ ok: true } | { ok: false; error: string }>;
}

export const devEmailAdapter: EmailAdapter = {
  async send(message) {
    console.log(`[email:dev-adapter] would send "${message.template}" template (no provider configured)`);
    return { ok: true };
  },
};

export const emailAdapter: EmailAdapter = devEmailAdapter;

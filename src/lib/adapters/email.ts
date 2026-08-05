import "server-only";
import { site } from "@/content/site";

/**
 * Transactional email adapter interface (build brief section 8/12: "Resend (or provider adapter)").
 * `resendEmailAdapter` is a real, working Resend integration used automatically once
 * RESEND_API_KEY is set; with no key configured (the default in this environment), `devEmailAdapter`
 * logs only non-PII metadata — never a recipient address or message body — and sends nothing.
 * Every call site is written against the `EmailAdapter` interface, so nothing else needs to change
 * when a real key is added.
 */

export type EmailTemplate =
  | "contact-enquiry" // internal notification to staff
  | "contact-receipt" // confirmation to the visitor who submitted /contact
  | "callback-request" // internal notification to staff
  | "booking-confirmation"
  | "booking-prep-guide"
  | "booking-representation-explainer"
  | "pathway-check-summary"
  | "resource-download";

export type EmailMessage = {
  to: string;
  template: EmailTemplate;
  data: Record<string, unknown>;
  /** RFC3339 timestamp — schedules a future send via Resend's `scheduledAt`. Ignored by the dev adapter. */
  scheduledAt?: string;
};

export interface EmailAdapter {
  send(message: EmailMessage): Promise<{ ok: true } | { ok: false; error: string }>;
}

export const devEmailAdapter: EmailAdapter = {
  async send(message) {
    console.log(
      `[email:dev-adapter] would send "${message.template}" template${
        message.scheduledAt ? ` (scheduled ${message.scheduledAt})` : ""
      } — no provider configured`
    );
    return { ok: true };
  },
};

const subjects: Record<EmailTemplate, string> = {
  "contact-enquiry": "New enquiry from the website",
  "contact-receipt": "We received your message",
  "callback-request": "New call-back request from the website",
  "booking-confirmation": "Your consultation request",
  "booking-prep-guide": "What to prepare for your consultation",
  "booking-representation-explainer": "How representation works",
  "pathway-check-summary": "Your Canada Pathway Readiness summary",
  "resource-download": "Your requested guide",
};

/** Quiet, elegant plain-text bodies — no pressure tactics, no outcome claims. */
function bodyFor(template: EmailTemplate, data: Record<string, unknown>): string {
  switch (template) {
    case "contact-enquiry":
      return `A new enquiry was submitted on the website.\n\n${JSON.stringify(data, null, 2)}`;
    case "contact-receipt":
      return `Thank you for reaching out to ${site.legalName}. We aim to respond within one business day.\n\n${site.noGuaranteeNotice}\n\n${site.sensitiveDocsNotice}`;
    case "callback-request":
      return `A new call-back request was submitted on the website.\n\n${JSON.stringify(data, null, 2)}`;
    case "booking-confirmation":
      return `Thank you for booking a consultation.\n\nReference: ${data.reference ?? ""}\nConsultation type: ${data.consultationType ?? ""}\n\nWe will follow up shortly to confirm details.\n\n${site.noGuaranteeNotice}\n\n${site.sensitiveDocsNotice}`;
    case "booking-prep-guide":
      return `A little before your consultation, here is what helps us make the most of the time: a short written summary of your situation, any relevant dates, and general document categories (not the documents themselves) you think may be relevant. ${site.sensitiveDocsNotice}`;
    case "booking-representation-explainer":
      return `Ahead of your consultation, a short note on how representation works: hiring a representative is optional, no representative can guarantee a decision, approval or processing time, and government authorities make all decisions. If we proceed together after your consultation, you will receive a written scope of work and fee agreement first.`;
    case "pathway-check-summary":
      return `Thank you for completing the Pathway Clarity Check. This is not an eligibility result or advice — a consultation is the right next step to review your facts and current program instructions.`;
    case "resource-download":
      return `Thank you for your interest. Your requested guide is linked from the resource page — this is general information only, not a personalized checklist.`;
  }
}

function createResendAdapter(apiKey: string): EmailAdapter {
  return {
    async send(message) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: `${site.legalName} <${site.publicEmail}>`,
            to: message.to,
            subject: subjects[message.template],
            text: bodyFor(message.template, message.data),
            ...(message.scheduledAt ? { scheduled_at: message.scheduledAt } : {}),
          }),
        });
        if (!response.ok) {
          const errorBody = await response.text().catch(() => "");
          return { ok: false, error: `Resend request failed: ${response.status} ${errorBody}` };
        }
        return { ok: true };
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "Unknown email error" };
      }
    },
  };
}

export const emailAdapter: EmailAdapter = process.env.RESEND_API_KEY
  ? createResendAdapter(process.env.RESEND_API_KEY)
  : devEmailAdapter;

/**
 * The 3-email pre-consultation sequence from build brief section 6.4 / Phase-2 UX ask: booking
 * confirmation immediately, a "what to prepare" note the next morning, and a short
 * "how representation works" note the day before. Uses Resend's `scheduledAt` when a real
 * provider is configured; the dev adapter just logs the intended schedule.
 */
export async function sendPreConsultationSequence(params: {
  to: string;
  reference: string;
  consultationType: string;
  consultationAtUtc: string;
}) {
  const { to, reference, consultationType, consultationAtUtc } = params;

  await emailAdapter.send({
    to,
    template: "booking-confirmation",
    data: { reference, consultationType },
  });

  const prepAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const explainerAt = new Date(new Date(consultationAtUtc).getTime() - 24 * 60 * 60 * 1000).toISOString();

  await emailAdapter.send({
    to,
    template: "booking-prep-guide",
    data: { reference },
    scheduledAt: prepAt < explainerAt ? prepAt : undefined,
  });

  await emailAdapter.send({
    to,
    template: "booking-representation-explainer",
    data: { reference },
    scheduledAt: new Date(explainerAt) > new Date() ? explainerAt : undefined,
  });
}

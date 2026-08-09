import "server-only";
import { site } from "@/content/site";
import { formatInTimeZone, TORONTO_TZ } from "@/lib/timezone";

/**
 * Transactional email adapter interface (build brief section 8/12: "Resend (or provider adapter)").
 * `createResendAdapter` is a real, working Resend integration used automatically once
 * RESEND_API_KEY is set; with no key configured (the default in this environment), `devEmailAdapter`
 * logs only non-PII metadata — never a recipient address or message body — and sends nothing.
 * Every call site is written against the `EmailAdapter` interface, so nothing else needs to change
 * when a real key is added.
 *
 * IMPORTANT — domain verification: sending "from" info@carpentercarleton.ca only works once that
 * domain is verified in the Resend dashboard (Domains → Add Domain → add the SPF/DKIM/DMARC
 * records Resend generates — see docs/LAUNCH-INPUTS-CHECKLIST.md for the record types and why the
 * exact DKIM value can't be written here). Until then, every send from the real domain will fail;
 * this adapter catches that, logs a loud warning, and retries once from Resend's shared sandbox
 * sender (`onboarding@resend.dev`) so mail is never silently dropped — it just won't look like it
 * came from carpentercarleton.ca until the domain is verified.
 */

export type EmailTemplate =
  | "contact-enquiry" // internal notification to staff
  | "contact-receipt" // confirmation to the visitor who submitted /contact
  | "callback-request" // internal notification to staff
  | "booking-confirmation" // client-facing, sent only after webhook-confirmed payment
  | "booking-internal-notification" // to internalNotificationRecipients, may contain PII
  | "booking-prep-guide"
  | "booking-representation-explainer"
  | "pathway-check-summary"
  | "resource-download";

export type EmailMessage = {
  to: string | string[];
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
    const recipientCount = Array.isArray(message.to) ? message.to.length : 1;
    console.log(
      `[email:dev-adapter] would send "${message.template}" template to ${recipientCount} recipient(s)${
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
  "booking-confirmation": "Your consultation is confirmed",
  "booking-internal-notification": "New consultation booking",
  "booking-prep-guide": "What to prepare for your consultation",
  "booking-representation-explainer": "How representation works",
  "pathway-check-summary": "Your Canada Pathway Readiness summary",
  "resource-download": "Your requested guide",
};

/** `booking-internal-notification`'s subject reflects the actual payment status instead of always
 * saying "paid" — staff should never see a request-only (unpaid) booking mislabeled as paid. */
function subjectFor(message: EmailMessage): string {
  if (message.template === "booking-internal-notification") {
    return message.data.paymentStatus === "paid"
      ? "New paid consultation booking"
      : "New consultation request (unpaid)";
  }
  return subjects[message.template];
}

const platformLabels: Record<string, string> = {
  teams: "Microsoft Teams",
  zoom: "Zoom",
  meet: "Google Meet",
  whatsapp: "WhatsApp video",
};

function formatMeetingLine(data: Record<string, unknown>): string {
  const meetingFormat = String(data.meetingFormat ?? "");
  const videoPlatform = data.videoPlatform ? String(data.videoPlatform) : undefined;

  if (meetingFormat === "video" && videoPlatform === "whatsapp") {
    return `Format: WhatsApp video — we will call ${data.phone ? String(data.phone) : "the number you provided"} at the scheduled time.`;
  }
  if (meetingFormat === "video" && videoPlatform) {
    const label = platformLabels[videoPlatform] ?? videoPlatform;
    return `Format: ${label}${data.joinUrl ? `\nJoin link: ${data.joinUrl}` : " — your join link will follow separately if it is not shown above."}`;
  }
  if (meetingFormat === "in-person") return "Format: In person.";
  return "Format: Phone — we will call you at the scheduled time.";
}

function formatWhenLines(data: Record<string, unknown>): string {
  const slotStartUtc = data.slotStartUtc ? String(data.slotStartUtc) : undefined;
  if (!slotStartUtc) return "";
  const visitorTz = data.visitorTimeZone ? String(data.visitorTimeZone) : undefined;
  const torontoLine = `${formatInTimeZone(slotStartUtc, TORONTO_TZ)} (Toronto time)`;
  const visitorLine = visitorTz && visitorTz !== TORONTO_TZ ? `\n${formatInTimeZone(slotStartUtc, visitorTz)} (your time)` : "";
  return `When: ${torontoLine}${visitorLine}`;
}

/** Quiet, elegant plain-text bodies — no pressure tactics, no outcome claims. */
function bodyFor(template: EmailTemplate, data: Record<string, unknown>): string {
  switch (template) {
    case "contact-enquiry":
      return `A new enquiry was submitted on the website.\n\n${JSON.stringify(data, null, 2)}`;
    case "contact-receipt":
      return `Thank you for reaching out to ${site.legalName}. We aim to respond within one business day.\n\n${site.noGuaranteeNotice}\n\n${site.sensitiveDocsNotice}`;
    case "callback-request":
      return `A new call-back request was submitted on the website.\n\n${JSON.stringify(data, null, 2)}`;

    case "booking-confirmation": {
      const amountLine =
        typeof data.amountPaid === "number"
          ? `Amount paid: ${data.currency ?? "CAD"} $${data.amountPaid.toFixed(2)}`
          : undefined;
      const receiptLine = data.receiptUrl ? `Receipt: ${data.receiptUrl}` : undefined;
      return [
        `Thank you — your consultation is confirmed.`,
        ``,
        `Reference: ${data.reference ?? ""}`,
        `Consultation type: ${data.consultationType ?? ""}`,
        formatWhenLines(data),
        formatMeetingLine(data),
        amountLine,
        receiptLine,
        ``,
        `What to prepare: a short summary of your situation and any relevant dates.`,
        `Cancelling or rescheduling: reply to this email and we'll find a new time — there's no charge for rescheduling with reasonable notice.`,
        ``,
        site.noGuaranteeNotice,
        site.sensitiveDocsNotice,
        ``,
        `Verify on the CICC Public Register: ${site.ciccRegisterUrl}`,
        `Learn about representatives (IRCC): ${site.representativeInfoUrl}`,
      ]
        .filter(Boolean)
        .join("\n");
    }

    case "booking-internal-notification": {
      const amountLine =
        typeof data.amountPaid === "number"
          ? `Amount paid: ${data.currency ?? "CAD"} $${data.amountPaid.toFixed(2)}`
          : "Amount paid: (request-only, no payment)";
      return [
        `New consultation booking — payment ${data.paymentStatus ?? "unknown"}.`,
        ``,
        `Reference: ${data.reference ?? ""}`,
        `Client: ${data.name ?? ""} <${data.email ?? ""}>${data.phone ? ` — ${data.phone}` : ""}`,
        `Consultation type: ${data.consultationType ?? ""}`,
        formatWhenLines(data),
        formatMeetingLine(data),
        amountLine,
        data.receiptUrl ? `Receipt: ${data.receiptUrl}` : undefined,
        data.calendarOk === false ? `ACTION NEEDED: calendar/video-link creation failed — confirm the meeting manually.` : undefined,
        data.message ? `\nClient note:\n${data.message}` : undefined,
      ]
        .filter(Boolean)
        .join("\n");
    }

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

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/**
 * Shared, table-based email signature. Inline styling keeps it reliable in Outlook, Gmail, Apple
 * Mail and other common email clients, which strip or ignore <style> blocks and most CSS.
 */
function signatureHtml(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;color:#243B53;">
<tr>
<td style="padding:0 18px 0 0;vertical-align:top;border-right:2px solid #B46F4B;">
<div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:bold;color:#102A43;line-height:1.2;white-space:nowrap;">Carpenter &amp; Carleton</div>
<div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#627D98;letter-spacing:0.3px;padding-top:2px;">Canadian Immigration Guidance</div>
</td>
<td style="padding:0 0 0 18px;vertical-align:top;">
<div style="font-size:15px;font-weight:bold;color:#102A43;line-height:1.3;">Peter Carpenter, RCIC</div>
<div style="font-size:12px;color:#627D98;padding:1px 0 8px 0;">Regulated Canadian Immigration Consultant &middot; College ID R408495</div>
<div style="font-size:12px;color:#243B53;line-height:1.7;">
<span style="color:#B46F4B;font-weight:bold;">T</span>&nbsp;<a href="tel:+14162527733" style="color:#243B53;text-decoration:none;">+1 (416) 252-7733</a>&nbsp;&nbsp;|&nbsp;&nbsp;<span style="color:#B46F4B;font-weight:bold;">W</span>&nbsp;<a href="https://wa.me/16478613970" style="color:#243B53;text-decoration:none;">WhatsApp +1 (647) 861-3970</a><br />
<span style="color:#B46F4B;font-weight:bold;">E</span>&nbsp;<a href="mailto:info@carpentercarleton.ca" style="color:#243B53;text-decoration:none;">info@carpentercarleton.ca</a>&nbsp;&nbsp;|&nbsp;&nbsp;<span style="color:#B46F4B;font-weight:bold;">Web</span>&nbsp;<a href="https://carpentercarleton.ca" style="color:#243B53;text-decoration:none;">carpentercarleton.ca</a><br />
<span style="color:#B46F4B;font-weight:bold;">A</span>&nbsp;<a href="https://www.google.com/maps/search/?api=1&amp;query=3062%20Lake%20Shore%20Blvd%20W%2C%20Etobicoke%2C%20ON%20M8V%204C9" style="color:#243B53;text-decoration:none;">3062 Lake Shore Blvd W, Etobicoke, ON M8V 4C9</a>
</div>
<div style="font-size:11px;padding-top:8px;"><a href="https://college-ic.ca/protecting-the-public/find-an-immigration-consultant" style="color:#B46F4B;text-decoration:none;font-weight:bold;">Verify this consultant on the CICC Public Register &rsaquo;</a></div>
</td>
</tr>
<tr><td colspan="2" style="padding:12px 0 0 0;"><div style="border-top:1px solid #D7D4CC;padding-top:8px;font-size:10px;color:#829AB1;line-height:1.5;font-family:Arial,Helvetica,sans-serif;max-width:560px;">Hiring a representative is optional. A representative cannot guarantee a decision, approval or processing time &mdash; government authorities make all decisions.<br />This email and any attachments are confidential and intended only for the named recipient. Please do not send passports, bank statements, immigration portal passwords or other highly sensitive documents by email. If you received this in error, please delete it and notify the sender.</div></td></tr>
</table>`;
}

function htmlFor(template: EmailTemplate, data: Record<string, unknown>): string {
  const body = escapeHtml(bodyFor(template, data)).replace(/\n/g, "<br />");
  return `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#243B53;">${body}</div><div style="height:24px;line-height:24px;">&nbsp;</div>${signatureHtml()}`;
}

const SANDBOX_FROM = "onboarding@resend.dev";

function createResendAdapter(apiKey: string): EmailAdapter {
  async function attempt(fromAddress: string, message: EmailMessage) {
    return fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${site.legalName} <${fromAddress}>`,
        to: message.to,
        reply_to: site.emailReplyTo,
        subject: subjectFor(message),
        text: bodyFor(message.template, message.data),
        html: htmlFor(message.template, message.data),
        ...(message.scheduledAt ? { scheduled_at: message.scheduledAt } : {}),
      }),
    });
  }

  return {
    async send(message) {
      try {
        let response = await attempt(site.emailFrom, message);

        if (!response.ok) {
          const errorBody = await response.text().catch(() => "");
          console.warn(
            `[email:resend] send from ${site.emailFrom} failed (${response.status}) — is carpentercarleton.ca verified in Resend? Retrying with sandbox sender.`,
            errorBody
          );
          response = await attempt(SANDBOX_FROM, message);

          if (!response.ok) {
            const fallbackError = await response.text().catch(() => "");
            console.error(`[email:resend] sandbox-sender retry also failed (${response.status})`, fallbackError);
            return { ok: false, error: `Resend failed on both domain and fallback sender: ${response.status} ${fallbackError}` };
          }

          console.warn(`[email:resend] delivered "${message.template}" via sandbox sender — verify the domain to send as ${site.emailFrom}.`);
        }

        return { ok: true };
      } catch (error) {
        console.error(`[email:resend] send threw for template "${message.template}"`, error);
        return { ok: false, error: error instanceof Error ? error.message : "Unknown email error" };
      }
    },
  };
}

export const emailAdapter: EmailAdapter = process.env.RESEND_API_KEY
  ? createResendAdapter(process.env.RESEND_API_KEY)
  : devEmailAdapter;

/**
 * The dev-fallback-only pre-consultation sequence used when payments aren't live (no Stripe keys
 * in this environment): booking confirmation immediately, a "what to prepare" note the next
 * morning, and a short "how representation works" note the day before. Once payments are live, the
 * webhook-triggered "booking-confirmation" email (src/app/api/webhooks/stripe/route.ts) is the
 * real transactional trigger and already contains everything this sequence's first email does.
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
    data: { reference, consultationType, slotStartUtc: consultationAtUtc },
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

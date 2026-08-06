import { site, whatsAppHref } from "@/content/site";
import { formatInTimeZone, TORONTO_TZ, getBrowserTimeZone } from "@/lib/timezone";
import type { MeetingFormat, VideoPlatform } from "@/lib/adapters/calendar";

const platformLabels: Record<VideoPlatform, string> = {
  teams: "Microsoft Teams",
  zoom: "Zoom",
  meet: "Google Meet",
  whatsapp: "WhatsApp video",
};

export function BookingConfirmation({
  reference,
  consultationType,
  meetingFormat,
  videoPlatform,
  slotStartUtc,
  joinUrl,
  amountPaid,
  currency,
  receiptUrl,
  finalizing,
  paid,
}: {
  reference?: string;
  consultationType?: string;
  meetingFormat?: MeetingFormat | string;
  videoPlatform?: VideoPlatform | string;
  slotStartUtc?: string;
  joinUrl?: string;
  amountPaid?: number;
  currency?: string;
  receiptUrl?: string;
  /** True once Stripe confirms payment but before the webhook has finished creating the calendar
   * event / join link — details below are shown as far as they're known, rather than blocking. */
  finalizing?: boolean;
  paid?: boolean;
}) {
  const visitorTz = typeof window !== "undefined" ? getBrowserTimeZone() : TORONTO_TZ;

  return (
    <div className="rounded-3xl border border-line bg-surface p-8">
      <p className="text-xs font-semibold uppercase tracking-wide text-sage">
        {paid ? "Payment confirmed" : "Request received"}
      </p>
      <h2 className="mt-2 font-serif text-2xl font-normal text-ink">
        Thank you — your consultation {paid ? "is confirmed" : "request is confirmed"}
      </h2>

      {finalizing && (
        <p className="mt-3 rounded-xl bg-sage-pale p-4 text-sm text-ink-soft">
          Your payment is confirmed. We&rsquo;re finalizing your meeting details now — you&rsquo;ll
          receive an email with your join details shortly.
        </p>
      )}

      <dl className="mt-5 space-y-2 text-sm text-ink-soft">
        {reference && (
          <div className="flex gap-2">
            <dt className="font-medium text-ink">Reference</dt>
            <dd>{reference}</dd>
          </div>
        )}
        {consultationType && (
          <div className="flex gap-2">
            <dt className="font-medium text-ink">Type</dt>
            <dd>{consultationType}</dd>
          </div>
        )}
        {slotStartUtc && (
          <div className="flex gap-2">
            <dt className="font-medium text-ink">Time</dt>
            <dd>
              {formatInTimeZone(slotStartUtc, TORONTO_TZ)} (Toronto time)
              {visitorTz !== TORONTO_TZ && <> · {formatInTimeZone(slotStartUtc, visitorTz)} (your time)</>}
            </dd>
          </div>
        )}
        {meetingFormat && (
          <div className="flex gap-2">
            <dt className="font-medium text-ink">Format</dt>
            <dd>
              {meetingFormat === "video" && videoPlatform
                ? platformLabels[videoPlatform as VideoPlatform] ?? videoPlatform
                : meetingFormat === "in-person"
                  ? "In person"
                  : meetingFormat[0]?.toUpperCase() + meetingFormat.slice(1)}
            </dd>
          </div>
        )}
        {typeof amountPaid === "number" && (
          <div className="flex gap-2">
            <dt className="font-medium text-ink">Amount paid</dt>
            <dd>
              {currency ?? "CAD"} ${amountPaid.toFixed(2)}
              {receiptUrl && (
                <>
                  {" · "}
                  <a href={receiptUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
                    View receipt
                  </a>
                </>
              )}
            </dd>
          </div>
        )}
      </dl>

      {meetingFormat === "video" && videoPlatform === "whatsapp" && (
        <p className="mt-4 rounded-xl bg-sage-pale p-4 text-sm text-ink-soft">
          We will call your WhatsApp number at the scheduled time —{" "}
          <a
            href={whatsAppHref(site.businessWhatsApp, "Hi, confirming my upcoming consultation.")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            message us on WhatsApp
          </a>{" "}
          if anything changes.
        </p>
      )}
      {meetingFormat === "video" && videoPlatform !== "whatsapp" && !finalizing && (
        <p className="mt-4 rounded-xl bg-sage-pale p-4 text-sm text-ink-soft">
          {joinUrl ? (
            <>
              Your join link:{" "}
              <a href={joinUrl} className="underline underline-offset-2">
                {joinUrl}
              </a>
            </>
          ) : (
            "We'll send your join link by email ahead of the consultation."
          )}
        </p>
      )}

      <div className="mt-6 space-y-3 border-t border-line pt-5 text-sm text-ink-soft">
        <p>
          <strong className="text-ink">What to prepare:</strong> a short summary of your situation
          and any relevant dates. {site.sensitiveDocsNotice}
        </p>
        <p>
          <strong className="text-ink">Cancelling or rescheduling:</strong> reply to your
          confirmation email and we&rsquo;ll find a new time — there&rsquo;s no charge for
          rescheduling with reasonable notice.
        </p>
        <p>{site.noGuaranteeNotice}</p>
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <a href={site.ciccRegisterUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            Verify on the CICC Public Register
          </a>
          <a href={site.representativeInfoUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            Learn about representatives (IRCC)
          </a>
        </p>
      </div>
    </div>
  );
}

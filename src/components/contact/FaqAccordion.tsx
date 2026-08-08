import { site } from "@/content/site";
import { feeTiers } from "@/content/fees";
import { getConsultTaxConfig, computeTaxAmount } from "@/lib/tax-config";

type Faq = { question: string; answer: string };

const consultationFee = feeTiers.find((tier) => tier.service === "consultation");

function costAnswer(): string {
  if (consultationFee?.approved && consultationFee.amount) {
    const tax = getConsultTaxConfig();
    const taxAmount = computeTaxAmount(consultationFee.amount, tax);
    const totalLine =
      taxAmount > 0
        ? ` plus ${tax.label} (${consultationFee.currency} $${taxAmount.toFixed(2)}), ${consultationFee.currency} $${(consultationFee.amount + taxAmount).toFixed(2)} total`
        : ` (${tax.label})`;
    return `A ${consultationFee.publicLabel.toLowerCase()} is ${consultationFee.currency} $${consultationFee.amount.toFixed(2)}${totalLine}. ${site.noGuaranteeNotice}`;
  }
  return `Our approved fee schedule is being finalized — see the Fees page for the current structure. ${site.noGuaranteeNotice}`;
}

const defaultFaqs: Faq[] = [
  {
    question: "How quickly will you respond?",
    answer: "We aim to respond to every enquiry within one business day.",
  },
  {
    question: "What does a consultation cost, and are outcomes guaranteed?",
    answer: costAnswer(),
  },
  {
    question: "What should I prepare before we talk?",
    answer:
      "A short summary of your situation and general goal is enough to start. We'll tell you exactly what documents are relevant after understanding your file — please don't send sensitive documents through this site.",
  },
  {
    question: "What languages can I communicate in?",
    answer:
      "English is our primary working language today. Tell us your preferred language in the form and we'll let you know what's possible for your situation.",
  },
  {
    question: "Is this confidential?",
    answer:
      "Yes. What you share with us through these forms is used only to respond to your enquiry, consistent with our privacy policy.",
  },
];

export function FaqAccordion({ items = defaultFaqs }: { items?: Faq[] }) {
  return (
    <div className="space-y-3">
      {items.map((faq) => (
        <details key={faq.question} className="rounded-2xl border border-line bg-surface p-5">
          <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
            {faq.question}
          </summary>
          <p className="mt-3 text-sm text-ink-soft">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}

/**
 * Content model shared by every page. Shape matches the CMS types specified in the build brief
 * (section 8) so a future headless CMS (e.g. Sanity) can replace these local modules as a
 * data-source swap rather than an architecture change.
 */

export type Audience = "individual" | "family" | "employer" | "business";

export type SourceOwner = "IRCC" | "ESDC" | "Province" | "CICC";

export type Source = {
  label: string;
  url: string;
  sourceOwner: SourceOwner;
  checkedAt: string;
};

export type ApprovalRecord = {
  /** Person/role who reviewed and approved this content for publication. */
  approvedBy: string | null;
  approvedAt: string | null;
  /** True only once an authorized reviewer (Peter) has signed off. */
  approved: boolean;
};

export type ProcessStep = {
  title: string;
  body: string;
};

export type Service = {
  slug: string;
  title: string;
  audience: Audience[];
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
  };
  overview: string;
  consultationCanReview: string[];
  evidenceCategories: string[];
  processSteps: ProcessStep[];
  caveats: string[];
  officialSources: Source[];
  lastReviewed: string;
  ctaLabel: string;
  isPublished: boolean;
  approval: ApprovalRecord;
  faqs?: { question: string; answer: string }[];
};

export type ResourceContentType =
  | "policy-update"
  | "guide"
  | "faq"
  | "document-readiness";

export type Resource = {
  slug: string;
  title: string;
  summary: string;
  body: string;
  contentType: ResourceContentType;
  relatedServices: string[];
  officialSources: Source[];
  lastReviewed: string;
  reviewDueAt: string;
  status: "draft" | "needs-review" | "approved" | "published" | "archived";
  approval: ApprovalRecord;
  /** Plain-language fields shown on Policy Desk cards. */
  whatChanged?: string;
  whoItMayAffect?: string;
  whatToCheckNext?: string;
};

export type Testimonial = {
  quote: string;
  displayName: string;
  serviceCategory?: string;
  sourceUrl?: string;
  writtenConsentReceivedAt?: string;
  approvedForPublicUseAt?: string;
  anonymizationApproved?: boolean;
  isPublished: boolean;
};

export type PriceType = "fixed" | "from" | "range" | "consultation-required";

export type FeeItem = {
  service: string;
  publicLabel: string;
  priceType: PriceType;
  amount?: number;
  currency: "CAD";
  taxNote?: string;
  inclusions: string[];
  exclusions: string[];
  paymentPolicy?: string;
  cancellationPolicy?: string;
  effectiveDate: string;
  approved: boolean;
};

export type PathwayGoal =
  | "permanent-residence"
  | "work"
  | "study"
  | "family"
  | "business"
  | "status-citizenship";

export type PathwayQuestion = {
  id: string;
  prompt: string;
  helpText?: string;
  type: "single-select" | "multi-select";
  options: { value: string; label: string }[];
};

/**
 * Guards production rendering: content is publishable only when it carries the accountability
 * trail the build brief requires (sources, review date, approval, consent). This is the CMS
 * "approval guard" described in section 8, implemented without an external CMS backend.
 */
export function isServicePublishable(service: Service): boolean {
  return (
    service.isPublished &&
    service.approval.approved &&
    service.officialSources.length > 0 &&
    Boolean(service.lastReviewed)
  );
}

export function isResourcePublishable(resource: Resource): boolean {
  return (
    resource.status === "published" &&
    resource.approval.approved &&
    resource.officialSources.length > 0 &&
    Boolean(resource.lastReviewed)
  );
}

export function isTestimonialPublishable(testimonial: Testimonial): boolean {
  return (
    testimonial.isPublished &&
    Boolean(testimonial.writtenConsentReceivedAt) &&
    Boolean(testimonial.approvedForPublicUseAt)
  );
}

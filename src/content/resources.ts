import type { Resource } from "@/content/types";

const REVIEWED = "2026-07-29";
const REVIEW_DUE = "2026-08-29";

export const resources: Resource[] = [
  {
    slug: "2026-28-levels-plan-what-it-means",
    title: "Canada's 2026–28 levels plan: what it means for your timeline",
    summary:
      "Annual permanent-residence admissions are planned at 380,000 through 2026–28, while new temporary-resident admissions fall. Here is what that shift means for pathway planning.",
    body: "Canada's 2026–28 immigration levels plan holds annual permanent-residence admissions at 380,000 while targeting fewer new temporary-resident admissions — 385,000 in 2026 and 370,000 in 2027–28. The economic-class share of planned admissions rises to 64% by 2027. In practice, this favours applicants who can show documented, economic-pathway readiness — Express Entry and PNP fit, legitimate employer pathways, and family reunification — over generic study-to-PR assumptions. Always confirm the current-year plan on the official source below before making a decision based on any specific number.",
    contentType: "policy-update",
    relatedServices: ["permanent-residence", "provincial-nominee", "study-permits"],
    officialSources: [
      {
        label: "IRCC — 2026–27 Departmental Plan",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/corporate/publications-manuals/departmental-plans/2026-27-departmental-plan/departmental-plan-2026-2027-full.html",
        sourceOwner: "IRCC",
        checkedAt: REVIEWED,
      },
    ],
    lastReviewed: REVIEWED,
    reviewDueAt: REVIEW_DUE,
    status: "published",
    approval: { approvedBy: null, approvedAt: null, approved: false },
    whatChanged: "Planned PR admissions held at 380,000/year; new temporary-resident targets fall.",
    whoItMayAffect: "Skilled workers, students weighing a study-to-PR plan, and employers hiring temporary workers.",
    whatToCheckNext: "Review the current departmental plan and your program's category before assuming a prior year's numbers still apply.",
  },
  {
    slug: "category-based-selection-explained",
    title: "Category-based Express Entry rounds: what they change about your strategy",
    summary:
      "Express Entry now runs category-based rounds alongside general rounds. Understanding the difference matters more than chasing a single CRS number.",
    body: "In addition to general Express Entry rounds, IRCC runs category-based selection rounds that target specific occupations, French-language ability, or other criteria set for that year. Cut-off scores and category priorities change round to round and year to year. A documented, current profile — language results, education assessment, and accurate work-history evidence — matters more than any single publicised score. Confirm the current round structure on the official page below before planning around a specific category.",
    contentType: "policy-update",
    relatedServices: ["permanent-residence"],
    officialSources: [
      {
        label: "IRCC — Category-based selection rounds",
        url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile/rounds-invitations/category-based-selection.html",
        sourceOwner: "IRCC",
        checkedAt: REVIEWED,
      },
    ],
    lastReviewed: REVIEWED,
    reviewDueAt: REVIEW_DUE,
    status: "published",
    approval: { approvedBy: null, approvedAt: null, approved: false },
    whatChanged: "Category-based rounds continue to run alongside general Express Entry rounds.",
    whoItMayAffect: "Express Entry candidates evaluating which round type may realistically apply to them.",
    whatToCheckNext: "Check the current year's category list and round history before assuming a category will recur.",
  },
  {
    slug: "low-wage-lmia-refusal-list",
    title: "Low-wage LMIA refusals in high-unemployment regions: what employers should check first",
    summary:
      "ESDC can refuse low-wage LMIA processing in metro areas based on the current unemployment-rate list, subject to exceptions. Employers should screen geography and stream before recruiting.",
    body: "Employment and Social Development Canada can refuse to process low-wage Labour Market Impact Assessment applications in Census Metropolitan Areas with elevated unemployment, based on a periodically updated list — with defined exceptions for certain sectors and streams. Employers in the GTA should check the current list and any applicable exception before beginning recruitment tied to a low-wage LMIA. This is an employer-side screen and is separate from any individual worker's application.",
    contentType: "policy-update",
    relatedServices: ["work-permits-employers"],
    officialSources: [
      {
        label: "ESDC — LMIA refusal to process",
        url: "https://www.canada.ca/en/employment-social-development/services/foreign-workers/refusal.html",
        sourceOwner: "ESDC",
        checkedAt: REVIEWED,
      },
    ],
    lastReviewed: REVIEWED,
    reviewDueAt: REVIEW_DUE,
    status: "published",
    approval: { approvedBy: null, approvedAt: null, approved: false },
    whatChanged: "ESDC's live unemployment-rate list can still change which CMAs face low-wage LMIA refusal.",
    whoItMayAffect: "GTA employers considering a low-wage Labour Market Impact Assessment application.",
    whatToCheckNext: "Confirm current CMA status and applicable exceptions before recruiting for a low-wage role.",
  },
];

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((resource) => resource.slug === slug);
}

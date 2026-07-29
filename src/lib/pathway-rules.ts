import type { PathwayGoal } from "@/content/types";

export type PathwayAnswers = Record<string, string>;

export type PathwayResult = {
  goal: PathwayGoal;
  heading: string;
  body: string;
  relatedServiceSlug: string;
  consultationType: string;
  isUrgent: boolean;
};

const goalToService: Record<PathwayGoal, { label: string; slug: string; consultationType: string }> = {
  "permanent-residence": {
    label: "permanent residence",
    slug: "permanent-residence",
    consultationType: "Individual pathway",
  },
  work: {
    label: "work in Canada or hiring internationally",
    slug: "work-permits-employers",
    consultationType: "Employer or worker",
  },
  study: {
    label: "study planning",
    slug: "study-permits",
    consultationType: "Individual pathway",
  },
  family: {
    label: "family reunification",
    slug: "family-sponsorship",
    consultationType: "Family",
  },
  business: {
    label: "business immigration",
    slug: "business-pathways",
    consultationType: "Business",
  },
  "status-citizenship": {
    label: "status maintenance or citizenship",
    slug: "citizenship-pr-cards",
    consultationType: "Status & citizenship",
  },
};

/**
 * Route-rule logic for the Pathway Clarity Check. This is deliberately simple, human-readable
 * config rather than a scoring model: it never produces an eligibility conclusion, only a
 * recommended conversation category, per build brief section 6.1.
 */
export function resolvePathwayResult(answers: PathwayAnswers): PathwayResult {
  const goal = (answers.goal as PathwayGoal) ?? "permanent-residence";
  const match = goalToService[goal] ?? goalToService["permanent-residence"];
  const isUrgent = answers.timeline === "urgent";

  return {
    goal,
    heading: isUrgent
      ? `An urgent conversation about ${match.label} may be useful`
      : `A conversation about ${match.label} may be useful`,
    body: isUrgent
      ? "You flagged a deadline or expiring status. This is not an eligibility result or advice — book an urgent review so we can look at your dates and documents as soon as possible."
      : "Based on the topics you selected, a conversation about this route may be useful. This is not an eligibility result or advice. A consultation is the right next step to review your facts and current program instructions.",
    relatedServiceSlug: match.slug,
    consultationType: isUrgent ? "Urgent review" : match.consultationType,
    isUrgent,
  };
}

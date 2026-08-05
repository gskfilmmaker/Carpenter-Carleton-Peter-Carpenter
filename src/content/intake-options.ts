import { pathwayQuestions } from "@/content/pathway-questions";

/** Reuses the Pathway Clarity Check's option vocabulary so goal/status/timeline stay consistent
 * across the Start Here flow, the contact form and the booking flow instead of drifting apart. */
function optionsFor(id: string) {
  return pathwayQuestions.find((q) => q.id === id)?.options ?? [];
}

export const goalOptions = optionsFor("goal");
export const statusOptions = optionsFor("status");
export const timelineOptions = optionsFor("timeline");

export const languageOptions = [
  { value: "english", label: "English" },
  { value: "french", label: "French" },
  { value: "punjabi", label: "Punjabi" },
  { value: "hindi", label: "Hindi" },
  { value: "urdu", label: "Urdu" },
  { value: "bengali", label: "Bengali" },
  { value: "arabic", label: "Arabic" },
  { value: "other", label: "Other" },
] as const;

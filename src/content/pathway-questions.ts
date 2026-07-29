import type { PathwayQuestion } from "@/content/types";

/**
 * Question set for the Pathway Clarity Check (/start-here). Config-driven per build brief 6.1,
 * so wording/order can change without touching component code. None of these questions determine
 * eligibility — they route to an educational category only (see src/lib/pathway-rules.ts).
 */
export const pathwayQuestions: PathwayQuestion[] = [
  {
    id: "goal",
    prompt: "What is your primary goal?",
    type: "single-select",
    options: [
      { value: "permanent-residence", label: "Build a permanent future in Canada" },
      { value: "work", label: "Work in Canada, or hire someone internationally" },
      { value: "study", label: "Study with a plan" },
      { value: "family", label: "Bring family closer" },
      { value: "business", label: "Explore business options" },
      { value: "status-citizenship", label: "Maintain status, renew a PR card, or apply for citizenship" },
    ],
  },
  {
    id: "location",
    prompt: "Where are you currently living?",
    type: "single-select",
    options: [
      { value: "in-canada", label: "In Canada" },
      { value: "outside-canada", label: "Outside Canada" },
    ],
  },
  {
    id: "status",
    prompt: "Do you currently hold a Canadian immigration status?",
    helpText: "If you're outside Canada or unsure, that's a valid answer too.",
    type: "single-select",
    options: [
      { value: "none", label: "No current status / not applicable" },
      { value: "visitor", label: "Visitor" },
      { value: "study-permit", label: "Study permit" },
      { value: "work-permit", label: "Work permit" },
      { value: "pr", label: "Permanent resident" },
      { value: "unsure", label: "Not sure" },
    ],
  },
  {
    id: "education",
    prompt: "What is your highest level of education?",
    type: "single-select",
    options: [
      { value: "secondary", label: "Secondary school" },
      { value: "post-secondary", label: "Diploma or certificate" },
      { value: "bachelor", label: "Bachelor's degree" },
      { value: "graduate", label: "Master's or doctoral degree" },
    ],
  },
  {
    id: "occupation",
    prompt: "What best describes your main work or occupation area?",
    type: "single-select",
    options: [
      { value: "skilled-trade", label: "Skilled trade" },
      { value: "healthcare", label: "Healthcare" },
      { value: "tech-engineering", label: "Technology or engineering" },
      { value: "business-finance", label: "Business or finance" },
      { value: "other", label: "Other / not currently working" },
    ],
  },
  {
    id: "language",
    prompt: "What is your current language-testing status?",
    helpText: "We're asking about status only — not predicting a score.",
    type: "single-select",
    options: [
      { value: "have-results", label: "I already have valid test results" },
      { value: "booked", label: "I've booked a test" },
      { value: "not-yet", label: "I haven't taken a test yet" },
    ],
  },
  {
    id: "canadian-experience",
    prompt: "Do you have Canadian work or study experience?",
    type: "single-select",
    options: [
      { value: "work", label: "Canadian work experience" },
      { value: "study", label: "Canadian study experience" },
      { value: "both", label: "Both" },
      { value: "none", label: "Neither yet" },
    ],
  },
  {
    id: "family",
    prompt: "Which best describes your family situation for this plan?",
    type: "single-select",
    options: [
      { value: "just-me", label: "Just me" },
      { value: "spouse-partner", label: "With a spouse or partner" },
      { value: "with-children", label: "With dependent children" },
      { value: "sponsoring-parents", label: "Looking to sponsor parents or grandparents" },
    ],
  },
  {
    id: "timeline",
    prompt: "What is your desired timeline?",
    type: "single-select",
    options: [
      { value: "urgent", label: "Urgent — there's a deadline or expiring status" },
      { value: "0-6-months", label: "0–6 months" },
      { value: "6-18-months", label: "6–18 months" },
      { value: "exploring", label: "Just exploring for now" },
    ],
  },
];

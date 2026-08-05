import { z } from "zod";
import { goalOptions, languageOptions, statusOptions, timelineOptions } from "@/content/intake-options";

const goalValues = goalOptions.map((o) => o.value) as [string, ...string[]];
const statusValues = statusOptions.map((o) => o.value) as [string, ...string[]];
const timelineValues = timelineOptions.map((o) => o.value) as [string, ...string[]];
const languageValues = languageOptions.map((o) => o.value) as [string, ...string[]];

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.email("Please enter a valid email address."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  countryOfResidence: z.string().trim().min(2, "Please enter your country of residence.").max(80),
  currentStatus: z.enum(statusValues),
  goal: z.enum(goalValues),
  preferredLanguage: z.enum(languageValues),
  timeline: z.enum(timelineValues),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  serviceConsent: z.literal(true, {
    error: "Please confirm you consent to us contacting you about your enquiry.",
  }),
  marketingConsent: z.boolean(),
  turnstileToken: z.string().optional().or(z.literal("")),
  renderedAt: z.number().optional(),
  // Honeypot: real users never fill this hidden field.
  companyWebsite: z.string().max(0, "Spam check failed.").optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof contactSchema>;

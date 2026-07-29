import { z } from "zod";

export const pathwayCheckSchema = z.object({
  answers: z.record(z.string(), z.string()).refine((answers) => Object.keys(answers).length > 0, {
    message: "At least one answer is required.",
  }),
  email: z.email().optional().or(z.literal("")),
  marketingConsent: z.boolean(),
  // Honeypot: real users never fill this hidden field.
  companyWebsite: z.string().max(0, "Spam check failed.").optional().or(z.literal("")),
});

export type PathwayCheckInput = z.infer<typeof pathwayCheckSchema>;

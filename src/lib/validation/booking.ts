import { z } from "zod";

export const consultationTypes = [
  "Individual pathway",
  "Family",
  "Employer",
  "Worker",
  "Business",
  "Status & citizenship",
  "Urgent review",
] as const;

export const preferredContactTypes = ["video", "phone", "in-person"] as const;

export const bookingSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.email("Please enter a valid email address."),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  consultationType: z.enum(consultationTypes),
  preferredContact: z.enum(preferredContactTypes),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  serviceConsent: z.literal(true, {
    error: "Please confirm you consent to us contacting you about your enquiry.",
  }),
  marketingConsent: z.boolean(),
  // Honeypot: real users never fill this hidden field.
  companyWebsite: z.string().max(0, "Spam check failed.").optional().or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

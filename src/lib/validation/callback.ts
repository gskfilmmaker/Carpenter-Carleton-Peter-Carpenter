import { z } from "zod";

export const callbackSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(120),
  email: z.email("Please enter a valid email address."),
  phone: z.string().trim().min(4, "Please enter a phone number to call.").max(40),
  preferredWindow: z.string().trim().min(2, "Please tell us a preferred window.").max(200),
  timeZone: z.string().trim().min(1).max(80),
  serviceConsent: z.literal(true, {
    error: "Please confirm you consent to us contacting you about this request.",
  }),
  renderedAt: z.number().optional(),
  companyWebsite: z.string().max(0, "Spam check failed.").optional().or(z.literal("")),
});

export type CallbackInput = z.infer<typeof callbackSchema>;

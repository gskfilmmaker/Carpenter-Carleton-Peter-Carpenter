import { z } from "zod";
import { meetingFormats, videoPlatforms } from "@/lib/adapters/calendar";

export const consultationTypes = [
  "Individual pathway",
  "Family",
  "Employer",
  "Worker",
  "Business",
  "Status & citizenship",
  "Urgent review",
] as const;

export const bookingSchema = z
  .object({
    name: z.string().trim().min(2, "Please enter your full name.").max(120),
    email: z.email("Please enter a valid email address."),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    consultationType: z.enum(consultationTypes),
    meetingFormat: z.enum(meetingFormats),
    videoPlatform: z.enum(videoPlatforms).optional(),
    slotStartUtc: z.iso.datetime({ message: "Please choose a time slot." }),
    visitorTimeZone: z.string().trim().min(1).max(80),
    message: z.string().trim().max(2000).optional().or(z.literal("")),
    serviceConsent: z.literal(true, {
      error: "Please confirm you consent to us contacting you about this booking.",
    }),
    marketingConsent: z.boolean(),
    turnstileToken: z.string().optional().or(z.literal("")),
    renderedAt: z.number().optional(),
    // Honeypot: real users never fill this hidden field.
    companyWebsite: z.string().max(0, "Spam check failed.").optional().or(z.literal("")),
  })
  .refine((data) => data.meetingFormat !== "video" || Boolean(data.videoPlatform), {
    message: "Please choose a video platform.",
    path: ["videoPlatform"],
  });

export type BookingInput = z.infer<typeof bookingSchema>;

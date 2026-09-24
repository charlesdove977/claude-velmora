// zod schemas shared by the API endpoints and the client-side forms.
import { z } from "zod";

const phone = z
  .string()
  .trim()
  .min(7, "Enter a phone number")
  .max(25)
  .regex(/^[+()\-.\s\d]+$/, "Enter a valid phone number");

const name = z.string().trim().min(2, "Enter your name").max(80);
const email = z.string().trim().email("Enter a valid email").max(120);
const message = z.string().trim().min(10, "Tell us a little more").max(2000, "Keep it under 2,000 characters");

export const contactSchema = z.object({
  name,
  email,
  phone: phone.optional().or(z.literal("")),
  message,
});

export const supportTopics = ["Booking or rescheduling", "Before my visit", "Aftercare question", "Billing or membership", "Policies", "Something else"] as const;

export const supportSchema = z.object({
  name,
  email,
  phone: phone.optional().or(z.literal("")),
  topic: z.enum(supportTopics, { message: "Choose a topic" }),
  message,
});

export const giftCardSchema = z.object({
  purchaserName: name,
  purchaserEmail: email,
  recipientName: z.string().trim().min(2, "Enter the recipient's name").max(80),
  recipientEmail: z.string().trim().email("Enter a valid email").max(120).optional().or(z.literal("")),
  amount: z.coerce.number().int().min(100, "Minimum $100").max(5000, "Maximum $5,000"),
  delivery: z.enum(["email", "pickup"]),
  message: z.string().trim().max(300).optional().or(z.literal("")),
});

export const newsletterSchema = z.object({
  email,
  firstName: z.string().trim().max(60).optional().or(z.literal("")),
});

export const bookingSchema = z.object({
  treatments: z.array(z.string().min(1)).min(1, "Choose at least one treatment"),
  provider: z.string().min(1, "Choose a provider"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Choose a time"),
  name,
  email,
  phone,
  firstVisit: z.boolean(),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  smsConsent: z.boolean(),
  policyAck: z.literal(true, { message: "Please acknowledge the policies" }),
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type SupportInput = z.infer<typeof supportSchema>;
export type GiftCardInput = z.infer<typeof giftCardSchema>;

export function flattenErrors(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

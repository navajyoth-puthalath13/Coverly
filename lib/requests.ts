import { z } from "zod";

/**
 * Schema for the "Request a template" form. Kept server- and client-shared so
 * validation is identical in the browser and in the API route. No third-party
 * form service is involved — submissions are posted to our own route handler.
 */
export const templateRequestSchema = z.object({
  name: z.string().trim().max(120, "Name is too long").optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .max(200)
    .optional()
    .or(z.literal("")),
  title: z
    .string()
    .trim()
    .min(1, "Please describe the cover or form you want")
    .max(200, "Keep the title under 200 characters"),
  fields: z
    .string()
    .trim()
    .min(1, "List the fields it should include")
    .max(2000, "That's a bit long — keep it under 2000 characters"),
  notes: z.string().trim().max(2000, "Keep notes under 2000 characters").optional().or(z.literal("")),
});

export type TemplateRequest = z.infer<typeof templateRequestSchema>;

export const DEFAULT_REQUEST: TemplateRequest = {
  name: "",
  email: "",
  title: "",
  fields: "",
  notes: "",
};

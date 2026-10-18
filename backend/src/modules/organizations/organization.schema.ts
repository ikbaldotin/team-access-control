import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, "Organization name must contain at least 2 characters")
    .max(120, "Organization name must not exceed 120 characters"),
});

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Organization name must contain at least 2 characters")
    .max(120, "Organization name must not exceed 120 characters"),
});
export type createOrganizationDTO = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationDTO = z.infer<typeof updateOrganizationSchema>;

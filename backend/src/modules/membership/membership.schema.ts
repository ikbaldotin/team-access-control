import { z } from "zod";
export const AddEmailSchema = z.object({
  email: z.email().trim().toLowerCase(),
});
export const bodySchema = z.object({
  roleCode: z.enum(["ADMIN", "MEMBER"]),
});
export type AddEmailDTO = z.infer<typeof AddEmailSchema>;

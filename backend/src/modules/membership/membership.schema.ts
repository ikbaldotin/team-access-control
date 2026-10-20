import { z } from "zod";
export const AddEmailSchema = z.object({
  email: z.email().trim().toLowerCase(),
});

export type AddEmailDTO = z.infer<typeof AddEmailSchema>;

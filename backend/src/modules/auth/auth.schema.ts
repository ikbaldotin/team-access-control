import { email, z } from "zod";

export const registerUseSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(128, "Password must not exceed 128 characters"),
});

export type registerUseDTO = z.infer<typeof registerUseSchema>;

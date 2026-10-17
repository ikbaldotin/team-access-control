import { z } from "zod";
export const envSchema = z.object({
  PORT: z.coerce.number(),
  NODE_ENV: z.string(),
  DATABASE_URL: z.url(),
  SALT_ROUNDS: z.coerce.number(),
  ACCESS_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
});

export type Env = z.infer<typeof envSchema>;

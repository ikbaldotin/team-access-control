import type { User } from "../../generated/prisma/index.js";
export type SafeAuthUser = Pick<User, "id" | "email" | "createdAt">;

export const toSafeAuthUser = (user: User): SafeAuthUser => {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
};

import { Membership, Role, User } from "../generated/prisma/index.js";

export type MembershipWithDetails = Membership & {
  user: Pick<User, "id" | "email">;
  role: Pick<Role, "id" | "code">;
};

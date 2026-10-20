import { Membership, Role, User } from "../../generated/prisma/index.js";
import { MembershipWithDetails } from "../../types/membershipWithDetails.type.js";

export interface IMembership {
  findByEmail(email: string): Promise<User | null>;
  findOrganization(organizationId: string): Promise<boolean>;
  findRoleByCode(code: string): Promise<Role | null>;
  findMembership(
    userId: string,
    organizationId: string,
  ): Promise<Membership | null>;
  findAllMembers(
    organizationId: string,
  ): Promise<MembershipWithDetails[] | null>;
  addEmail(
    userId: string,
    organizationId: string,
    roleId: string,
  ): Promise<Membership>;
}

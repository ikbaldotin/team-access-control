import { Membership, Role, User } from "../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { IMembership } from "./membership.interface.js";

export class MembershipRepository implements IMembership {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
  async findOrganization(organizationId: string): Promise<boolean> {
    const organization = await prisma.organization.findUnique({
      where: {
        id: organizationId,
        deletedAt: null,
      },
    });
    return organization !== null;
  }
  async findRoleByCode(code: string): Promise<Role | null> {
    const role = await prisma.role.findUnique({
      where: {
        code,
      },
    });
    return role;
  }
  async findMembership(
    userId: string,
    organizationId: string,
  ): Promise<Membership | null> {
    const membership = await prisma.membership.findUnique({
      where: {
        userId_organizationId: { userId, organizationId },
      },
    });
    return membership;
  }
  async addEmail(
    userId: string,
    organizationId: string,
    roleId: string,
  ): Promise<Membership> {
    const membership = await prisma.membership.create({
      data: {
        userId,
        organizationId,
        roleId,
      },
    });
    return membership;
  }
}

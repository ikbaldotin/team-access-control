import { Membership, Role, User } from "../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { MembershipWithDetails } from "../../types/membershipWithDetails.type.js";
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
    const organization = await prisma.organization.findFirst({
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
  async findAllMembers(
    organizationId: string,
  ): Promise<MembershipWithDetails[] | null> {
    const member = await prisma.membership.findMany({
      where: {
        organizationId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        role: {
          select: {
            id: true,
            code: true,
          },
        },
      },
      orderBy: {
        joinedAt: "asc",
      },
    });
    return member;
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
  async findOrganizationOwnerId(
    organizationId: string,
  ): Promise<string | null> {
    const organization = await prisma.organization.findFirst({
      where: {
        id: organizationId,
        deletedAt: null,
      },
      select: {
        ownerId: true,
      },
    });
    if (!organization) {
      return null;
    }

    return organization.ownerId;
  }
  async updateMembershipStatus(
    userId: string,
    organizationId: string,
    status: Membership["status"],
  ): Promise<Membership> {
    const member = await prisma.membership.update({
      where: {
        userId_organizationId: { userId, organizationId },
      },
      data: {
        status,
      },
    });
    return member;
  }
  async updateMemberRole(
    userId: string,
    organizationId: string,
    roleId: string,
  ): Promise<Membership> {
    return prisma.membership.update({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      data: {
        roleId,
      },
    });
  }
  async findMemberDetails(
    userId: string,
    organizationId: string,
  ): Promise<MembershipWithDetails | null> {
    return prisma.membership.findUnique({
      where: {
        userId_organizationId: { userId, organizationId },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        role: {
          select: {
            id: true,
            code: true,
          },
        },
      },
    });
  }
}

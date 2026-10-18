import { Organization } from "../../generated/prisma/index.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../shared/error/AppError.js";
import { IOrganizationRepository } from "./organization.interface.js";
import { createOrganizationDTO } from "./organization.schema.js";

export class OrganizationRepository implements IOrganizationRepository {
  async createWithOwner(
    data: createOrganizationDTO,
    ownerId: string,
  ): Promise<Organization> {
    return await prisma.$transaction(async (tx) => {
      const ownerRole = await tx.role.findUnique({
        where: {
          code: "OWNER",
        },
      });
      if (!ownerRole) {
        throw new AppError(
          "OWNER role not found. Run the database seed script first.",
          500,
        );
      }
      const organization = await tx.organization.create({
        data: {
          name: data.name,
          ownerId,
        },
      });
      await tx.membership.create({
        data: {
          userId: ownerId,
          organizationId: organization.id,
          roleId: ownerRole.id,
        },
      });
      return organization;
    });
  }
  async findAllForUser(userId: string): Promise<Organization[] | null> {
    const organization = await prisma.organization.findMany({
      where: {
        memberships: {
          some: {
            userId,
            status: "ACTIVE",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return organization;
  }
  async findById(organizationId: string): Promise<Organization | null> {
    const organization = await prisma.organization.findFirst({
      where: {
        id: organizationId,
        deletedAt: null,
      },
    });
    return organization;
  }
}

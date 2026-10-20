import { AppError } from "../../shared/error/AppError.js";
import { IMembership } from "./membership.interface.js";
import { AddEmailDTO } from "./membership.schema.js";

export class MembershipService {
  constructor(private membershipRepo: IMembership) {}
  async addEmail(organizationId: string, data: AddEmailDTO) {
    const organization =
      await this.membershipRepo.findOrganization(organizationId);
    if (!organization) {
      throw new AppError("Organization not found", 404);
    }
    const user = await this.membershipRepo.findByEmail(data.email);
    if (!user) {
      throw new AppError("No registered user found with this email", 404);
    }
    const exitingMembership = await this.membershipRepo.findMembership(
      user.id,
      organizationId,
    );
    if (exitingMembership) {
      throw new AppError(
        "This user is already a member of the organization",
        409,
      );
    }
    const memberRole = await this.membershipRepo.findRoleByCode("MEMBER");
    if (!memberRole) {
      throw new AppError(
        "MEMBER role not found. Run the database seed script first.",
        500,
      );
    }
    const addEmail = await this.membershipRepo.addEmail(
      user.id,
      organizationId,
      memberRole.id,
    );
    return addEmail;
  }
  async listAllMembet(organizationId: string) {
    const allMember = await this.membershipRepo.findAllMembers(organizationId);
    if (!allMember) {
      throw new AppError("Organization not found", 404);
    }
    const result = allMember.map((membership) => ({
      userId: membership.userId,
      email: membership.user.email,
      role: membership.role.code,
      status: membership.status,
      joinedAt: membership.joinedAt,
    }));
    return result;
  }
  async removeMember(userId: string, organizationId: string) {
    const organizationExists =
      await this.membershipRepo.findOrganization(organizationId);

    if (!organizationExists) {
      throw new AppError("Organization not found", 404);
    }
    const ownerId =
      await this.membershipRepo.findOrganizationOwnerId(organizationId);
    if (ownerId === userId) {
      throw new AppError("The organization owner cannot be removed", 403);
    }
    const membership = await this.membershipRepo.findMembership(
      userId,
      organizationId,
    );
    if (!membership) {
      throw new AppError("Membership not found", 404);
    }

    if (membership.status === "SUSPENDED") {
      throw new AppError("This member is already suspended", 409);
    }
    return await this.membershipRepo.updateMembershipStatus(
      userId,
      organizationId,
      "SUSPENDED",
    );
  }
  async updateMemberRole(
    organizationId: string,
    userId: string,
    roleCode: string,
  ) {
    const organizationExists =
      await this.membershipRepo.findOrganization(organizationId);

    if (!organizationExists) {
      throw new AppError("Organization not found", 404);
    }
    const ownerId =
      await this.membershipRepo.findOrganizationOwnerId(organizationId);
    if (ownerId === userId) {
      throw new AppError("The organization owner cannot be removed", 403);
    }
    const membership = await this.membershipRepo.findMembership(
      userId,
      organizationId,
    );
    if (!membership) {
      throw new AppError("Membership not found", 404);
    }
    if (membership.status === "SUSPENDED") {
      throw new AppError("Cannot update the role of a suspended member", 409);
    }
    const role = await this.membershipRepo.findRoleByCode(roleCode);

    if (!role || role.code === "OWNER") {
      throw new AppError("Invalid target role", 400);
    }

    if (membership.roleId === role.id) {
      throw new AppError("Member already has this role", 409);
    }

    const updateRole = this.membershipRepo.updateMemberRole(
      userId,
      organizationId,
      role.id,
    );
    return updateRole;
  }
  async reactivateMember(organizationId: string, userId: string) {
    const organizationExists =
      await this.membershipRepo.findOrganization(organizationId);

    if (!organizationExists) {
      throw new AppError("Organization not found", 404);
    }

    const membership = await this.membershipRepo.findMembership(
      userId,
      organizationId,
    );

    if (!membership) {
      throw new AppError("Membership not found", 404);
    }

    if (membership.status === "ACTIVE") {
      throw new AppError("This member is already active", 409);
    }

    return this.membershipRepo.updateMembershipStatus(
      userId,
      organizationId,
      "ACTIVE",
    );
  }
  async getMemberDetails(organizationId: string, userId: string) {
    const organizationExists =
      await this.membershipRepo.findOrganization(organizationId);

    if (!organizationExists) {
      throw new AppError("Organization not found", 404);
    }

    const membership = await this.membershipRepo.findMemberDetails(
      userId,
      organizationId,
    );

    if (!membership) {
      throw new AppError("Membership not found", 404);
    }

    return {
      userId: membership.userId,
      organizationId: membership.organizationId,
      email: membership.user.email,
      role: membership.role.code,
      status: membership.status,
      joinedAt: membership.joinedAt,
    };
  }
}

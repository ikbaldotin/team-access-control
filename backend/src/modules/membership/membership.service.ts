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
}

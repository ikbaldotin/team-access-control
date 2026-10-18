import { IOrganizationRepository } from "./organization.interface.js";
import { createOrganizationDTO } from "./organization.schema.js";

export class OrganizationService {
  constructor(private organizatonRepo: IOrganizationRepository) {}
  async createOrganization(data: createOrganizationDTO, ownerId: string) {
    return this.organizatonRepo.createWithOwner(data, ownerId);
  }
  async getOrganization(organizationId: string) {
    return this.organizatonRepo.findById(organizationId);
  }
  async listOrganizations(userId: string) {
    return this.organizatonRepo.findAllForUser(userId);
  }
}

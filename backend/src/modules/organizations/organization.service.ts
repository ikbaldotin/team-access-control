import { IOrganizationRepository } from "./organization.interface.js";
import {
  createOrganizationDTO,
  UpdateOrganizationDTO,
} from "./organization.schema.js";

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
  async updateOrganization(
    organizationId: string,
    data: UpdateOrganizationDTO,
  ) {
    return this.organizatonRepo.update(organizationId, data);
  }
  async deleteOrganization(organizationId: string) {
    return this.organizatonRepo.softDelete(organizationId);
  }
}

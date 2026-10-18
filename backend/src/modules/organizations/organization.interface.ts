import { Organization } from "../../generated/prisma/index.js";
import {
  createOrganizationDTO,
  UpdateOrganizationDTO,
} from "./organization.schema.js";

export interface IOrganizationRepository {
  createWithOwner(
    data: createOrganizationDTO,
    ownerId: string,
  ): Promise<Organization>;
  findAllForUser(userId: string): Promise<Organization[] | null>;
  findById(organizationId: string): Promise<Organization | null>;

  update(
    organizationId: string,
    data: UpdateOrganizationDTO,
  ): Promise<Organization>;
  softDelete(organizationId: string): Promise<void>;
}

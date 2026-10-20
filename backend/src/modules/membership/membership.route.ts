import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorizeOrganizationPermission } from "../../middleware/authorizeOrganization.js";
import {
  addEmailController,
  getMemberDetailsController,
  listAllMemberController,
  reactivateMemberController,
  removeMemberController,
  updateMemberRoleController,
} from "./membership.controller.js";

const membershipRouter = express.Router();

membershipRouter.post(
  "/:organizationId",
  authenticate,
  authorizeOrganizationPermission("members:invite"),
  addEmailController,
);
membershipRouter.get(
  "/:organizationId",
  authenticate,
  authorizeOrganizationPermission("organization:read"),
  listAllMemberController,
);
membershipRouter.post(
  "/:organizationId/:userId",
  authenticate,
  authorizeOrganizationPermission("members:remove"),
  removeMemberController,
);
membershipRouter.patch(
  "/:organizationId/:userId/role",
  authenticate,
  authorizeOrganizationPermission("members:role-update"),
  updateMemberRoleController,
);
membershipRouter.post(
  "/:organizationId/:userId/role",
  authenticate,
  authorizeOrganizationPermission("members:role-update"),
  updateMemberRoleController,
);
membershipRouter.patch(
  "/:organizationId/:userId/reactivate",
  authenticate,
  authorizeOrganizationPermission("members:reactivate"),
  reactivateMemberController,
);
membershipRouter.get(
  "/:organizationId/:userId",
  authenticate,
  authorizeOrganizationPermission("organization:read"),
  getMemberDetailsController,
);
export default membershipRouter;

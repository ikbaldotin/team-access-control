import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorizeOrganizationPermission } from "../../middleware/authorizeOrganization.js";
import {
  addEmailController,
  listAllMemberController,
  reactivateMemberController,
  removeMemberController,
  updateMemberRoleController,
} from "./membership.controller.js";

const membershipRouter = express.Router();

membershipRouter.post(
  "/:organizationId",
  authenticate,
  authorizeOrganizationPermission("MEMBERSHIP_INVITE"),
  addEmailController,
);
membershipRouter.get(
  "/:organizationId",
  authenticate,
  authorizeOrganizationPermission("MEMBERSHIP_READ"),
  listAllMemberController,
);
membershipRouter.post(
  "/:organizationId/:userId",
  authenticate,
  authorizeOrganizationPermission("MEMBERSHIP_REMOVE"),
  removeMemberController,
);
membershipRouter.post(
  "/:organizationId/:userId",
  authenticate,
  authorizeOrganizationPermission("MEMBERSHIP_ROLE_UPDATE"),
  updateMemberRoleController,
);
membershipRouter.patch(
  "/:organizationId/:userId/reactivate",
  authenticate,
  authorizeOrganizationPermission("MEMBERSHIP_REACTIVATE"),
  reactivateMemberController,
);
export default membershipRouter;

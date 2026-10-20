import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import { authorizeOrganizationPermission } from "../../middleware/authorizeOrganization.js";
import { addEmailController } from "./membership.controller.js";

const membershipRouter = express.Router();

membershipRouter.post(
  "/:organizationId",
  authenticate,
  authorizeOrganizationPermission("MEMBERSHIP_INVITE"),
  addEmailController,
);

export default membershipRouter;

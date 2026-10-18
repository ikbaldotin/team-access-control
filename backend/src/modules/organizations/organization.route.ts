import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import {
  createOrganizationController,
  getOrganizationController,
  listOrganizationsController,
} from "./organization.controller.js";
import { authorizeOrganizationPermission } from "../../middleware/authorizeOrganization.js";

const organizationRouter = express.Router();
organizationRouter.post("/", authenticate, createOrganizationController);
organizationRouter.get("/list", authenticate, listOrganizationsController);
organizationRouter.get(
  "/:organizationId",
  authenticate,
  authorizeOrganizationPermission("ORGANIZATION_READ"),
  getOrganizationController,
);
export default organizationRouter;

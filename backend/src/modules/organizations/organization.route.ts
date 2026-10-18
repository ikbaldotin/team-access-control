import express from "express";
import { authenticate } from "../../middleware/authenticate.js";
import {
  createOrganizationController,
  deleteOrganizationController,
  getOrganizationController,
  listOrganizationsController,
  updateOrganizationController,
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

organizationRouter.patch(
  "/update/:organizationId",
  authenticate,
  authorizeOrganizationPermission("ORGANIZATION_UPDATE"),
  updateOrganizationController,
);
organizationRouter.patch(
  "/delete/:organizationId",
  authenticate,
  authorizeOrganizationPermission("ORGANIZATION_DELETE"),
  deleteOrganizationController,
);
export default organizationRouter;

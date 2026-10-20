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
  authorizeOrganizationPermission("organization:read"),
  getOrganizationController,
);

organizationRouter.patch(
  "/update/:organizationId",
  authenticate,
  authorizeOrganizationPermission("organization:update"),
  updateOrganizationController,
);
organizationRouter.patch(
  "/delete/:organizationId",
  authenticate,
  authorizeOrganizationPermission("organization:delete"),
  deleteOrganizationController,
);
export default organizationRouter;

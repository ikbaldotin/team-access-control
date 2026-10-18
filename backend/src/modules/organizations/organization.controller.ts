import { Request, Response } from "express";
import { catchAsync } from "../../shared/helper/CatchAsync.js";
import { createOrganizationSchema } from "./organization.schema.js";
import organizationService from "./organization.container.js";
import { AppError } from "../../shared/error/AppError.js";

export const createOrganizationController = catchAsync(
  async (req: Request, res: Response) => {
    const data = createOrganizationSchema.parse(req.body);
    const userId = req.user.userId as string;
    if (!userId) {
      throw new AppError("Authentication required", 401);
    }
    const result = await organizationService.createOrganization(data, userId);
    return res.status(201).json({
      success: true,
      message: "Organization created successfully",
      data: {
        organization: {
          id: result.id,
          name: result.name,
          ownerId: result.ownerId,
          createdAt: result.createdAt,
        },
      },
    });
  },
);

export const listOrganizationsController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user.userId as string;
    const result = await organizationService.listOrganizations(userId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  },
);

export const getOrganizationController = catchAsync(
  async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId as string;
    const result = await organizationService.getOrganization(organizationId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  },
);

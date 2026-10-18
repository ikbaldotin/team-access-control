import { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/error/AppError.js";
import { prisma } from "../lib/prisma.js";

export const authorizeOrganizationPermission = (permissionCode: string) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user.userId;
      const organizationId = req.params.organizationId;
      if (typeof userId !== "string" || !userId) {
        throw new AppError("Authentication required", 401);
      }
      if (typeof organizationId !== "string" || !organizationId) {
        throw new AppError("Organization ID is required", 400);
      }
      const membership = await prisma.membership.findFirst({
        where: {
          userId,
          organizationId,
          status: "ACTIVE",
          organization: {
            deletedAt: null,
          },
        },
        include: {
          role: {
            include: {
              rolePermissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });
      if (!membership) {
        throw new AppError("You do not have access to this organization", 403);
      }
      const hasPermission = membership.role.rolePermissions.map(
        (rolePermission) => rolePermission.permission.code === permissionCode,
      );
      if (!hasPermission) {
        throw new AppError(
          "You do not have permission to perform this action",
          403,
        );
      }
      req.user = {
        userId: membership.userId,
        organizationId: membership.organizationId,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};

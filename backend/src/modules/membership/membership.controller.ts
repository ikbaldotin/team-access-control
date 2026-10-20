import { Request, Response } from "express";
import { catchAsync } from "../../shared/helper/CatchAsync.js";
import membershipService from "./membership.container.js";
import { AddEmailSchema, bodySchema } from "./membership.schema.js";

export const addEmailController = catchAsync(
  async (req: Request, res: Response) => {
    const data = AddEmailSchema.parse(req.body);
    const organizationId = req.params.organizationId as string;
    const result = await membershipService.addEmail(organizationId, data);
    return res.status(200).json({
      success: true,
      message: "Member added successfully",
      membership: {
        id: result.id,
        userId: result.userId,
        organizationId: result.organizationId,
        roleId: result.roleId,
        status: result.status,
        joinedAT: result.joinedAt,
      },
    });
  },
);

export const listAllMemberController = catchAsync(
  async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId as string;
    const result = await membershipService.listAllMembet(organizationId);
    return res.status(200).json({
      success: true,
      message: "Members fetched successfully",
      result,
    });
  },
);

export const removeMemberController = catchAsync(
  async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId as string;
    const userId = req.params.userId as string;
    const result = await membershipService.removeMember(userId, organizationId);

    return res.status(200).json({
      success: true,
      message: "Member suspended successfully",
      membership: {
        userId: result.userId,
        organizationId: result.organizationId,
        status: result.status,
      },
    });
  },
);

export const updateMemberRoleController = catchAsync(
  async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId as string;
    const userId = req.params.userId as string;
    const { roleCode } = bodySchema.parse(req.body);
    const result = await membershipService.updateMemberRole(
      organizationId,
      userId,
      roleCode,
    );
    return res.status(200).json({
      success: true,
      message: "Member role updated successfully",
      membership: {
        userId: result.userId,
        organizationId: result.organizationId,
        roleId: result.roleId,
        status: result.status,
      },
    });
  },
);

export const reactivateMemberController = catchAsync(
  async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId as string;
    const userId = req.params.userId as string;

    const result = await membershipService.reactivateMember(
      organizationId,
      userId,
    );

    return res.status(200).json({
      success: true,
      message: "Member reactivated successfully",
      membership: {
        userId: result.userId,
        organizationId: result.organizationId,
        status: result.status,
      },
    });
  },
);
export const getMemberDetailsController = catchAsync(
  async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId as string;
    const userId = req.params.userId as string;

    const result = await membershipService.getMemberDetails(
      organizationId,
      userId,
    );

    return res.status(200).json({
      success: true,
      message: "Member details fetched successfully",
      membership: result,
    });
  },
);

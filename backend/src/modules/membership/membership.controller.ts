import { Request, Response } from "express";
import { catchAsync } from "../../shared/helper/CatchAsync.js";
import membershipService from "./membership.container.js";
import { AddEmailSchema } from "./membership.schema.js";

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

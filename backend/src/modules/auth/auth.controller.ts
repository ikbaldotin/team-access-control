import { Request, Response } from "express";
import { catchAsync } from "../../shared/helper/CatchAsync.js";
import { setAuthCookies } from "./auth.helper.js";

import authService from "./auth.container.js";
import { loginUserSchema, registerUserSchema } from "./auth.schema.js";

export const registerUserController = catchAsync(
  async (req: Request, res: Response) => {
    const data = registerUserSchema.parse(req.body);
    const result = await authService.registerUserService(data);
    setAuthCookies(res, result.refreshToken);
    return res.status(200).json({
      success: true,
      message: "user create successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  },
);

export const loginUserController = catchAsync(
  async (req: Request, res: Response) => {
    const data = loginUserSchema.parse(req.body);
    const result = await authService.loginUserService(data);
    setAuthCookies(res, result.refreshToken);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  },
);

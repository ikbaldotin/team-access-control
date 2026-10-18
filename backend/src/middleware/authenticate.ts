import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../modules/auth/auth.helper.js";
import { AppError } from "../shared/error/AppError.js";
import jwt from "jsonwebtoken";
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError("authentication required", 404);
    }
    if (!authHeader.startsWith("Bearer ")) {
      throw new AppError("invalid formate for authentication header", 401);
    }
    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) {
      throw new AppError("access token is missing", 401);
    }
    const payload = await verifyAccessToken(accessToken);
    if (!payload) {
      throw new AppError("invalid accesstoken", 404);
    }
    req.user = {
      userId: payload.userId,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Token expires", 401));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("invalid token", 401));
    }
    return next(error);
  }
};

import { NextFunction, Request, Response } from "express";
import { AppError } from "../shared/error/AppError.js";
import { success } from "zod";

export const globalErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _nex: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

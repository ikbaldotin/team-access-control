import bcrypt from "bcrypt";
import { env } from "../../config/env.config.js";
import { JwtPayloadType } from "./auth.types.js";
import jwt, { SignOptions } from "jsonwebtoken";
import { Response } from "express";
import ms from "ms";
export const hashedPassword = async (password: string) => {
  const salt = env.SALT_ROUNDS;
  const pass = await bcrypt.hash(password, salt);
  return pass;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  const pass = await bcrypt.compare(password, hashedPassword);
  return pass;
};

export const signAccessToken = (payload: JwtPayloadType) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const signRefreshToken = (payload: JwtPayloadType) => {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = async (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayloadType;
};
export const verifyRefreshToken = async (token: string) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as JwtPayloadType;
};

export const setAuthCookies = (res: Response, refreshToken: string) => {
  const refreshTokenAge = ms(env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "prod",
    sameSite: "lax", // only development
    maxAge: refreshTokenAge,
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "prod",
    sameSite: "lax", // only development
  });
};

import { AppError } from "../../shared/error/AppError.js";
import {
  comparePassword,
  hashedPassword,
  signAccessToken,
  signRefreshToken,
} from "./auth.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { toSafeAuthUser } from "./auth.response.js";
import { loginUserDTO, registerUserDTO } from "./auth.schema.js";

export class AuthService {
  constructor(private authRepo: IAuthRepository) {}
  async registerUserService(data: registerUserDTO) {
    const exitingUserByEmail = await this.authRepo.findByEmail(data.email);
    if (exitingUserByEmail) {
      throw new AppError("Email is already registered", 409);
    }

    const hashPassword = await hashedPassword(data.password);
    const user = await this.authRepo.create({
      email: data.email,
      password: hashPassword,
    });
    const accessToken = signAccessToken({
      userId: user.id,
    });
    const refreshToken = signRefreshToken({
      userId: user.id,
    });
    return {
      user: toSafeAuthUser(user),
      accessToken,
      refreshToken,
    };
  }
  async loginUserService(data: loginUserDTO) {
    const user = await this.authRepo.findByEmail(data.email);
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }
    const isPassword = await comparePassword(data.password, user.passwordHash);
    if (!isPassword) {
      throw new AppError("Invalid email or password", 401);
    }
    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });
    return {
      user: toSafeAuthUser(user),
      accessToken,
      refreshToken,
    };
  }
}

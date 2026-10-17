import { AppError } from "../../shared/error/AppError.js";
import {
  hashedPassword,
  signAccessToken,
  signRefreshToken,
} from "./auth.helper.js";
import { IAuthRepository } from "./auth.interface.js";
import { toSafeAuthUser } from "./auth.response.js";
import { registerUseDTO } from "./auth.schema.js";

export class AuthService {
  constructor(private authRepo: IAuthRepository) {}
  async registerUserService(data: registerUseDTO) {
    const exitingUser = await this.authRepo.findByEmail(data.email);
    if (exitingUser) {
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
}

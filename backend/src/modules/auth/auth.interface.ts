import { User } from "../../generated/prisma/index.js";
import { registerUseDTO } from "./auth.schema.js";

export interface IAuthRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: registerUseDTO): Promise<User>;
}

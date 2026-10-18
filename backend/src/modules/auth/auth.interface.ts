import { User } from "../../generated/prisma/index.js";
import { registerUseRDTO } from "./auth.schema.js";

export interface IAuthRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: registerUseRDTO): Promise<User>;
}

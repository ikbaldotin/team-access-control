import { User } from "../../generated/prisma/index.js";
import { registerUserDTO } from "./auth.schema.js";

export interface IAuthRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: registerUserDTO): Promise<User>;
}

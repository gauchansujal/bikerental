import { UserModel, IUser } from "../models/user.model";

type CreateUserDTO = Pick<IUser, "email" | "password" | "role">;

export class UserRepository {
  async createUser(data: CreateUserDTO) {
    return UserModel.create(data);
  }

  async findByEmail(email: string) {
    return UserModel.findOne({ email });
  }
}

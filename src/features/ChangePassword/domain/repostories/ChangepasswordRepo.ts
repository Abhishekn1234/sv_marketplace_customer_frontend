import type { UpdatePasswordInput, UpdatePasswordResponse } from "../entities/changepassword";

export interface IChangePasswordRepository {
  updatePassword(
    data: UpdatePasswordInput
  ): Promise<UpdatePasswordResponse>;
}
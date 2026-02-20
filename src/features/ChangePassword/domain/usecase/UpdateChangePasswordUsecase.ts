
import type { UpdatePasswordInput } from "../entities/changepassword";
import type { IChangePasswordRepository } from "../repostories/ChangepasswordRepo";

export class UpdatePasswordUseCase {
 private userRepository: IChangePasswordRepository
 constructor(userRepo:IChangePasswordRepository){
    this.userRepository=userRepo;
 }
  async execute(data: UpdatePasswordInput) {
    if (!data.oldPassword || !data.newPassword) {
      throw new Error("All fields are required");
    }

    if (data.newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    return await this.userRepository.updatePassword(data);
  }
}
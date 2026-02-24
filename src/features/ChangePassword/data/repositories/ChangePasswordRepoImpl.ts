
import type { IChangePasswordRepository } from "../../domain/repostories/ChangepasswordRepo";
import type {
  UpdatePasswordInput,
  UpdatePasswordResponse,
} from "../../domain/entities/changepassword";
import apiClient from "@/features/api/interceptor";

export class ChangePasswordRepositoryImpl implements IChangePasswordRepository{
  async updatePassword(
    data: UpdatePasswordInput
  ): Promise<UpdatePasswordResponse> {
    const response = await apiClient.patch(
      "/user/update-password",
      data,
    );

    return response.data;
  }
}
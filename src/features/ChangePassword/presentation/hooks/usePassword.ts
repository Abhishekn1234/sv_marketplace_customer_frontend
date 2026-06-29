import { useState } from "react";
import { ChangePasswordRepositoryImpl } from "../../data/repositories/ChangePasswordRepoImpl";
import { UpdatePasswordUseCase } from "../../domain/usecase/UpdateChangePasswordUsecase";
import { handleApiError } from "@/components/common/ApiError";

export const useUpdatePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repo = new ChangePasswordRepositoryImpl();
  const useCase = new UpdatePasswordUseCase(repo);

  const updatePassword = async (
    oldPassword: string,
    newPassword: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const result = await useCase.execute({
        oldPassword,
        newPassword,
      });

      return result;
    } catch (err: any) {
     handleApiError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updatePassword, loading, error };
};
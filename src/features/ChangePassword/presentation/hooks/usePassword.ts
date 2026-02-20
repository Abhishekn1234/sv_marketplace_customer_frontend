import { useState } from "react";
import { ChangePasswordRepositoryImpl } from "../../data/repositories/ChangePasswordRepoImpl";
import { UpdatePasswordUseCase } from "../../domain/usecase/UpdateChangePasswordUsecase";

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
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updatePassword, loading, error };
};
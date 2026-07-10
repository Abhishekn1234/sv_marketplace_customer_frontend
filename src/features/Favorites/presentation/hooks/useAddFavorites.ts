import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { FavoriteServiceRepoImpl } from "../../data/repositories/FavoriteRepoImpl";
import { AddFavoriteServiceUsecase } from "../../domain/usecase/PostFavoritesUsecase";

export function useAddFavoriteService() {
  const queryClient = useQueryClient();

  const repo = new FavoriteServiceRepoImpl();
  const usecase = new AddFavoriteServiceUsecase(repo);

  return useMutation({
    mutationFn: (serviceId: string) => usecase.execute(serviceId),

    onSuccess: (_, serviceId) => {
      // Update cached favorite status
      queryClient.setQueryData(
        ["favorite-status", serviceId],
        true
      );

      toast.success("Added to favorites");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to add favorite"
      );
    },
  });
}
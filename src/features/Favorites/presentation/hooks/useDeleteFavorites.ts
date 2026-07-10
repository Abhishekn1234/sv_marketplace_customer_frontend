import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { FavoriteServiceRepoImpl } from "../../data/repositories/FavoriteRepoImpl";
import { RemoveFavoriteServiceUsecase } from "../../domain/usecase/RemoveFavoriteServiceUsecase";

export function useRemoveFavoriteService() {
  const queryClient = useQueryClient();

  const repo = new FavoriteServiceRepoImpl();
  const usecase = new RemoveFavoriteServiceUsecase(repo);

  return useMutation({
    mutationFn: (serviceId: string) => usecase.execute(serviceId),

    onSuccess: (_, serviceId) => {
      // Update favorite status cache
      queryClient.setQueryData(
        ["favorite-status", serviceId],
        false
      );

      // Remove the service from all favorite-services queries
      queryClient.setQueriesData(
        { queryKey: ["favorite-services"] },
        (oldData: InfiniteData<any> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.filter(
                (service: any) => service._id !== serviceId
              ),
            })),
          };
        }
      );

      toast.success("Removed from favorites");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ??
          "Failed to remove favorite"
      );
    },
  });
}
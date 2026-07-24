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

    onMutate: async (serviceId) => {
      await queryClient.cancelQueries({ queryKey: ["service-categories"] });
      await queryClient.cancelQueries({ queryKey: ["services"] });

      const previousCategories = queryClient.getQueryData(["service-categories"]);
      const previousServices = queryClient.getQueryData(["services"]);

      queryClient.setQueryData(["service-categories"], (old: any) => {
        if (!old) return old;

        return old.map((category: any) => ({
          ...category,
          services: category.services.map((service: any) =>
            service._id === serviceId
              ? { ...service, isFavorited: true }
              : service
          ),
        }));
      });

      queryClient.setQueryData(["services"], (old: any) => {
        if (!old) return old;

        return old.map((service: any) =>
          service._id === serviceId
            ? { ...service, isFavorited: true }
            : service
        );
      });

      return { previousCategories, previousServices };
    },

    onSuccess: () => {
      toast.success("Added to favorites");
    },

    onError: (error: any, _, context) => {
      if (context?.previousCategories) {
        queryClient.setQueryData(
          ["service-categories"],
          context.previousCategories
        );
      }

      if (context?.previousServices) {
        queryClient.setQueryData(["services"], context.previousServices);
      }

      toast.error(
        error?.response?.data?.message || "Failed to add favorite"
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-services"] });
    },
  });
}
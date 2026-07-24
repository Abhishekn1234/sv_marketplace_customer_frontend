import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

import { FavoriteServiceRepoImpl } from "../../data/repositories/FavoriteRepoImpl";
import { RemoveFavoriteServiceUsecase } from "../../domain/usecase/RemoveFavoriteServiceUsecase";

export function useRemoveFavoriteService() {
  const queryClient = useQueryClient();

  const repo = new FavoriteServiceRepoImpl();
  const usecase = new RemoveFavoriteServiceUsecase(repo);

  return useMutation({
    mutationFn: (serviceId: string) => usecase.execute(serviceId),

    onMutate: async (serviceId) => {
      await queryClient.cancelQueries({ queryKey: ["service-categories"] });
      await queryClient.cancelQueries({ queryKey: ["services"] });
      await queryClient.cancelQueries({ queryKey: ["favorite-services"] });

      const previousCategories = queryClient.getQueryData(["service-categories"]);
      const previousServices = queryClient.getQueryData(["services"]);
      const previousFavorites = queryClient.getQueriesData({
        queryKey: ["favorite-services"],
      });

      queryClient.setQueryData(["service-categories"], (old: any) => {
        if (!old) return old;

        return old.map((category: any) => ({
          ...category,
          services: category.services.map((service: any) =>
            service._id === serviceId
              ? { ...service, isFavorited: false }
              : service
          ),
        }));
      });

      queryClient.setQueryData(["services"], (old: any) => {
        if (!old) return old;

        return old.map((service: any) =>
          service._id === serviceId
            ? { ...service, isFavorited: false }
            : service
        );
      });

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

      return {
        previousCategories,
        previousServices,
        previousFavorites,
      };
    },

    onSuccess: () => {
      toast.success("Removed from favorites");
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

      if (context?.previousFavorites) {
        context.previousFavorites.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error(
        error?.response?.data?.message ||
          "Failed to remove favorite"
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-services"] });
    },
  });
}
import {
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { FavoriteServiceRepoImpl } from "../../data/repositories/FavoriteRepoImpl";
import { GetFavoriteServicesUseCase } from "../../domain/usecase/GetFavoriteServicesUseCase";

export function useInfiniteFavoriteServices(search?: string) {
  return useInfiniteQuery({
    queryKey: ["favorite-services", search],
    initialPageParam: 1,
    placeholderData: keepPreviousData,

    queryFn: async ({ pageParam }) => {
      const repo = new FavoriteServiceRepoImpl();
      const usecase = new GetFavoriteServicesUseCase(repo);

      return usecase.execute({
        page: pageParam,
        limit: 10,
        sort: "createdAt:desc",
        search,
      });
    },

    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
  });
}
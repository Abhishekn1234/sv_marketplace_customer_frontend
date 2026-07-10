import { useQuery } from "@tanstack/react-query";
import { FavoriteServiceRepoImpl } from "../../data/repositories/FavoriteRepoImpl";
import { GetFavoriteStatusUsecase } from "../../domain/usecase/GetFavoritesUsecase";


export function useFavoriteStatus(serviceId: string) {
  const repo = new FavoriteServiceRepoImpl();
  const usecase = new GetFavoriteStatusUsecase(repo);

  return useQuery({
    queryKey: ["favorite-status", serviceId],
    queryFn: () => usecase.execute(serviceId),
    enabled: !!serviceId,
  });
}
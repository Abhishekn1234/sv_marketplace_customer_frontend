import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FavoriteServiceRepoImpl } from "../../data/repositories/FavoriteRepoImpl";
import { GetFavoriteServicesUseCase } from "../../domain/usecase/GetFavoriteServicesUseCase";
import { FavoriteServicesQuery } from "../../domain/entities/favoritesrequestparams";

export function useGetFavoriteServices(
  query: FavoriteServicesQuery
) {
  return useQuery({
    queryKey: ["favorite-services", query],
    queryFn: () => {
      const repository = new FavoriteServiceRepoImpl();
      const useCase = new GetFavoriteServicesUseCase(repository);

      return useCase.execute(query);
    },
     placeholderData:keepPreviousData,
  });
}
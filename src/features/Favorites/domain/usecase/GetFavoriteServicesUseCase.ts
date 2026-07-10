
import { FavoriteServicesQuery, FavoriteServicesResponse } from "../entities/favoritesrequestparams";
import type { FavoriteServicesRepository } from "../repositories/FavoriteServicesRepository";

export class GetFavoriteServicesUseCase {
  constructor(private repository: FavoriteServicesRepository) {}

  execute(
    query: FavoriteServicesQuery
  ): Promise<FavoriteServicesResponse> {
    return this.repository.getFavorites(query);
  }
}
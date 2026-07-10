import { FavoriteServicesQuery, FavoriteServicesResponse } from "../entities/favoritesrequestparams";


export interface FavoriteServicesRepository {
  getFavorites(
    query: FavoriteServicesQuery
  ): Promise<FavoriteServicesResponse>;
}
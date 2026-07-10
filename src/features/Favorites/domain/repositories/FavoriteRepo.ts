import { FavoriteServiceResponse } from "../entities/favoriteresponse";


export interface FavoriteServiceRepo {
  addFavorite(serviceId: string): Promise<FavoriteServiceResponse>;

  removeFavorite(serviceId: string): Promise<FavoriteServiceResponse>;

  getFavoriteStatus(serviceId: string): Promise<FavoriteServiceResponse>;
}
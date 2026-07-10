import apiClient from "@/features/api/interceptor";
import { FavoriteServiceResponse } from "../../domain/entities/favoriteresponse";

import { FavoriteServiceRepo } from "../../domain/repositories/FavoriteRepo";
import { FavoriteServicesQuery, FavoriteServicesResponse } from "../../domain/entities/favoritesrequestparams";

export class FavoriteServiceApi {
  async addFavorite(
    serviceId: string
  ): Promise<FavoriteServiceResponse> {
    const { data } = await apiClient.post(
      `/services/favorites/${serviceId}`
    );
    return data;
  }

  async removeFavorite(
    serviceId: string
  ): Promise<FavoriteServiceResponse> {
    const { data } = await apiClient.delete(
      `/services/favorites/${serviceId}`
    );
    return data;
  }

  async getFavoriteStatus(
    serviceId: string
  ): Promise<FavoriteServiceResponse> {
    const { data } = await apiClient.get(
      `/services/favorites/${serviceId}/status`
    );
    return data;
  }

  async getFavorites(
    query: FavoriteServicesQuery
  ): Promise<FavoriteServicesResponse> {
    const { data } = await apiClient.get("/services/favorites", {
      params: query,
    });
    return data;
  }
}

export class FavoriteServiceRepoImpl
  implements FavoriteServiceRepo
{
  private api = new FavoriteServiceApi();

  addFavorite(
    serviceId: string
  ): Promise<FavoriteServiceResponse> {
    return this.api.addFavorite(serviceId);
  }

  removeFavorite(
    serviceId: string
  ): Promise<FavoriteServiceResponse> {
    return this.api.removeFavorite(serviceId);
  }

  getFavoriteStatus(
    serviceId: string
  ): Promise<FavoriteServiceResponse> {
    return this.api.getFavoriteStatus(serviceId);
  }

  getFavorites(
    query: FavoriteServicesQuery
  ): Promise<FavoriteServicesResponse> {
    return this.api.getFavorites(query);
  }
}
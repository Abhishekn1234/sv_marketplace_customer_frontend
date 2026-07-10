import { Service } from "@/features/Bookings/domain/entities/service.types";

export interface FavoriteServicesResponse {
  data: Service[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface FavoriteServicesQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}
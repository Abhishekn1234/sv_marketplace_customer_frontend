export interface GetServicesParams {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  categoryId?: string;
  servicesLimitPerCategory?: number;
  language?: "en" | "ar" | "hi";
}
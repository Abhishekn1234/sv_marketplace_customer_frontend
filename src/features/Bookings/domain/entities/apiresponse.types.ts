import type { Pagination } from "./paginationservices.types";

export interface APIResponse<T> {
  data: T;
  pagination?: Pagination;
}

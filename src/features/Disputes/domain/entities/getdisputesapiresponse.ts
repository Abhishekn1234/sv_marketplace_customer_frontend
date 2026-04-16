import type { GetDisputesPagination } from "./getdisputesallpagination";

export interface ApiResponse<T> {
  data: T[];
  pagination: GetDisputesPagination;
}
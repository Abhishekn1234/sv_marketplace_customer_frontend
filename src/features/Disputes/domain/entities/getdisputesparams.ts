export type SortOrder = "asc" | "desc";

export interface GetDisputesQueryParams {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: SortOrder;
  search?: string;
  sort?:string;
}
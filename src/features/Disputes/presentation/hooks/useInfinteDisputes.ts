import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { GetDisputesUsecase } from "../../domain/usecase/GetDisputesUsecase";
import { GetDisputesRepoImpl } from "../../data/repositories/GetDisputesRepoImpl";
const LIMIT = 10;
export function useInfiniteDisputes(search: string) {
  const usecase = useRef(new GetDisputesUsecase(new GetDisputesRepoImpl()));

  return useInfiniteQuery({
    queryKey: ["disputes", search],
    queryFn: ({ pageParam = 1 }) =>
      usecase.current.execute({
        page: pageParam as number,
        limit: LIMIT,
        sort: "createdAt:desc",
        search,
      }),
    getNextPageParam: (last) =>
      last.pagination?.hasNextPage ? last.pagination.currentPage + 1 : undefined,
    initialPageParam: 1,
  });
}
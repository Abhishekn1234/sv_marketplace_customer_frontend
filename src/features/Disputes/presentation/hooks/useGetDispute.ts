import { useMemo } from "react";
import { useQuery,keepPreviousData } from "@tanstack/react-query";
import { GetDisputesRepoImpl } from "../../data/repositories/GetDisputesRepoImpl";
import { GetDisputesUsecase } from "../../domain/usecase/GetDisputesUsecase";
import type { GetDisputesQueryParams } from "../../domain/entities/getdisputesparams";

export function useGetDispute(params?: GetDisputesQueryParams) {
  // ✅ keep stable instances
  const usecase = useMemo(() => {
    const repo = new GetDisputesRepoImpl();
    return new GetDisputesUsecase(repo);
  }, []);

  // ✅ stable query key
  const queryKey = useMemo(() => {
    return [
      "getDisputes",
      params?.page,
      params?.limit,
      params?.sort,
      params?.search,
    ];
  }, [params?.page, params?.limit, params?.sort, params?.search]);

  return useQuery({
    queryKey,
    queryFn: () => usecase.execute(params),
    placeholderData: keepPreviousData,
  });
}
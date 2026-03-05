
import { GenerateInvoiceImpl } from "../../data/repositories/GenerateInvoiceImpl";
import { GenerateInvoiceRepoUsecase } from "../../domain/usecase/GenerateInvoiceRepoUsecase";
import { useQuery } from "@tanstack/react-query";
import type { GenerateInvoice } from "../../domain/entities/generateinvoice";

export function useGenerateInvoice(bookingId: string) {
  const repo = new GenerateInvoiceImpl();
  const usecase = new GenerateInvoiceRepoUsecase(repo);

  return useQuery<GenerateInvoice, Error>({
    queryKey: ["getinvoice", bookingId],
    queryFn: () => usecase.execute({ bookingId }),
    enabled: !!bookingId, // only fetch if bookingId exists
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
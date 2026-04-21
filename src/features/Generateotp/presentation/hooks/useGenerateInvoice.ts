import { useQuery } from "@tanstack/react-query";
import { GenerateInvoiceImpl } from "../../data/repositories/GenerateInvoiceImpl";
import { GenerateInvoiceRepoUsecase } from "../../domain/usecase/GenerateInvoiceRepoUsecase";
import type { GenerateInvoice } from "../../domain/entities/generateinvoice";

export function useGenerateInvoice(bookingId?: string) {
  const repo = new GenerateInvoiceImpl();
  const usecase = new GenerateInvoiceRepoUsecase(repo);

  return useQuery<GenerateInvoice, Error>({
    queryKey: ["invoice", bookingId],
    queryFn: () => usecase.execute({ bookingId: bookingId! }),
    enabled: !!bookingId, // prevents empty call
  });
}
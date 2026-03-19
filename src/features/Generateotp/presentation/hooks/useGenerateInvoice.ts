import { useMutation } from "@tanstack/react-query";
import { GenerateInvoiceImpl } from "../../data/repositories/GenerateInvoiceImpl";
import { GenerateInvoiceRepoUsecase } from "../../domain/usecase/GenerateInvoiceRepoUsecase";
import type { GenerateInvoice } from "../../domain/entities/generateinvoice";

export function useGenerateInvoice() {
  const repo = new GenerateInvoiceImpl();
  const usecase = new GenerateInvoiceRepoUsecase(repo);

  return useMutation<GenerateInvoice, Error, string>({
    mutationFn: (bookingId: string) =>
      usecase.execute({ bookingId }),
  });
}
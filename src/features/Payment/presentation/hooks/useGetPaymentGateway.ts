import { useQuery } from "@tanstack/react-query";
import { PaymentGatewayRepoImpl } from "../../data/repositories/PaymentGatewayImpl";
import { GetPaymentGatewayUsecase } from "../../domain/usecase/GetPaymentGatewayUsecase";
import type { PaymentGatewayTypes } from "../../domain/entities/getbookinggatewayparams";

export function useGetPaymentGateway(type?: PaymentGatewayTypes) {
  const repo = new PaymentGatewayRepoImpl();
  const usecase = new GetPaymentGatewayUsecase(repo);

  return useQuery({
    queryKey: ["payment-gateways", type], 
    queryFn: () => usecase.execute(type),
  });
}
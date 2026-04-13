import apiClient from "@/features/api/interceptor";
import type { PaymentGatewayRepo } from "../../domain/repositories/PaymentGatewayRepo";
import type { PaymentGatewayTypes } from "../../domain/entities/getbookinggatewayparams";
import type { PaymentGateway } from "../../domain/entities/paymentgatewaygetresponse";

export class PaymentGatewayRepoImpl implements PaymentGatewayRepo {
  async getPaymentGateway(type?: PaymentGatewayTypes):Promise<PaymentGateway[]> {
    const response = await apiClient.get("/booking/payment/methods", {
      params: type ? { type } : undefined,
    });

    return response.data;
  }
}
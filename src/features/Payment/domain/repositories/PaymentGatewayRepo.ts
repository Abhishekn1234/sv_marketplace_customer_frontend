import type { PaymentGatewayTypes } from "../entities/getbookinggatewayparams";
import type { PaymentGateway } from "../entities/paymentgatewaygetresponse";

export interface PaymentGatewayRepo {
  getPaymentGateway(type?: PaymentGatewayTypes): Promise<PaymentGateway[]>;
}
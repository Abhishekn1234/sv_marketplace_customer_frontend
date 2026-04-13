import type { PaymentGatewayTypes } from "../entities/getbookinggatewayparams";
import type { PaymentGateway } from "../entities/paymentgatewaygetresponse";
import type { PaymentGatewayRepo } from "../repositories/PaymentGatewayRepo";

export class GetPaymentGatewayUsecase {
  private paymentGatewayRepo: PaymentGatewayRepo;
 constructor(paymentGateRepo:PaymentGatewayRepo){
     this.paymentGatewayRepo=paymentGateRepo
 }
  async execute(type?: PaymentGatewayTypes):Promise<PaymentGateway[]> {
    return await this.paymentGatewayRepo.getPaymentGateway(type);
  }
}
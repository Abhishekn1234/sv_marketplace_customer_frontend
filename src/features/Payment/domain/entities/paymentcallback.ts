import type { PaymentStatus } from "./paymentstatus";

export interface PaymentCallback{
    paymentId:string;
    status:PaymentStatus;
    transactionId:string;
    signature?:string;
    gatewayResponse?:Object;
}
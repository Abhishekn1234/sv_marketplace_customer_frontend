import type { PaymentStatus } from "./paymentstatus";

export interface PaymentCallback{
    paymentId:string;
    bookingId?:string;
    status:PaymentStatus;
    transactionId?:string;
    signature?:string;
    gatewayResponse?:Object;
    session_id?:string;
    sessionId?:string;
}
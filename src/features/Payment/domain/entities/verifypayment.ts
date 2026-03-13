export interface VerifyPaymentRequest {
  paymentId: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  paymentId?:string;
}
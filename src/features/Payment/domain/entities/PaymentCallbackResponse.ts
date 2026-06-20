export interface PaymentCallbackResponse {
  success: boolean;
  message: string;
  paymentId: string;
  bookingDetails: any;
}
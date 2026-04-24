export interface CancelBookingRequest {
  bookingId: string;
  cancelReason: string;
  cancelReasonType?: string;
}
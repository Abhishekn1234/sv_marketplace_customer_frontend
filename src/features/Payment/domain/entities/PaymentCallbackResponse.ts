import { Booking } from "@/features/Bookings/domain/entities/booking.types";

export interface PaymentCallbackResponse {
  success: boolean;
  message: string;
  paymentId: string;
  bookingDetails: Booking;
}
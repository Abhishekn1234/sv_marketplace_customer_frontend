import type { CancelBookingRequest } from "../entities/cancelbookingrequest.types";

export function validatecancelbooking(request: CancelBookingRequest) {
  if (!request.bookingId) throw new Error("Booking ID is required");
  if (!request.cancelReason?.trim()) throw new Error("Cancel reason is required");
  if (!request.cancelReasonType) throw new Error("Cancellation reason is required");
}
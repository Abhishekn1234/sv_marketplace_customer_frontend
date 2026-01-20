import type { CancelBookingRequest } from "../entities/cancelbookingrequest.types";

export function validatecancelbooking(request:CancelBookingRequest){
    if (!request.bookingId) throw new Error("Booking ID is required");
}
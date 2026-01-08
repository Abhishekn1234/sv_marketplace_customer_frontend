// src/repositories/impl/BookingRepository.ts
import type { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import type {
  Booking,
  BookingPayload,
  GetBookingsRequest,
  GetBookingsResponse,
  CancelBookingRequest,
} from "../../domain/entities/booking.types";
import apiClient from "../../../api/interceptor";

export class BookingRepository implements IBookingRepository {
  private readonly baseUrl = "/booking";

  /**
   * CREATE BOOKING
   */
  async createBooking(payload: BookingPayload): Promise<Booking> {
    const response = await apiClient.post<Booking>(
      `${this.baseUrl}/create`,
      payload
    );
    console.log(response.data);
    return response.data;
  }

  /**
   * GET BOOKINGS FOR A PARTICULAR USER
   */
  async getBookings(): Promise<GetBookingsResponse> {
  const response = await apiClient.get<Booking>(this.baseUrl);

  console.log("API DATA:", response.data);

  return {
    bookings: response.data ? [response.data] : [],
  };
}


  /**
   * GET BOOKING BY ID
   */
  async getBookingById(bookingId: string): Promise<Booking> {
    const response = await apiClient.get<Booking>(
      `${this.baseUrl}/${bookingId}`
    );
    return response.data;
  }

  /**
   * CANCEL BOOKING
   */
  async cancelBooking(
    request: CancelBookingRequest
  ): Promise<Booking> {
    const response = await apiClient.patch<Booking>(
      `${this.baseUrl}/${request.bookingId}/cancel`
    );
    return response.data;
  }

  /**
   * UPDATE BOOKING STATUS
   */
  async updateBookingStatus(
    bookingId: string,
    status: string
  ): Promise<Booking> {
    const response = await apiClient.patch<Booking>(
      `${this.baseUrl}/${bookingId}/status`,
      { status }
    );
    return response.data;
  }
}

export default new BookingRepository();

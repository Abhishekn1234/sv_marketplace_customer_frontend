import type { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import type {
  Booking,


} from "../../domain/entities/booking.types";
import type { CancelBookingRequest } from "../../domain/entities/cancelbookingrequest.types";
import type { GetBookingsResponse } from "../../domain/entities/getbookingresponse.types";
import type { BookingPayload } from "../../domain/entities/bookingpayload.types";
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
    console.log("Created Booking:", response.data);
    return response.data;
  }

  /**
   * GET ALL BOOKINGS
   */
async getBookings(): Promise<GetBookingsResponse> {
  const response = await apiClient.get(this.baseUrl);
  console.log("Data part:", response.data);

  // Wrap single object into array
  const bookingsArray = response.data ? [response.data] : [];

  return { bookings: bookingsArray };
}


  /**
   * GET BOOKING BY ID
   */
  async getBookingById(bookingId: string): Promise<Booking> {
    const response = await apiClient.get<Booking>(`${this.baseUrl}/${bookingId}`);
    return response.data;
  }

  /**
   * CANCEL BOOKING
   */
   async cancelBooking(request:CancelBookingRequest): Promise<Booking> {
    const response = await apiClient.post("/booking/cancel",request);
    return response.data;
  }
  /**
   * UPDATE BOOKING STATUS
   */
  async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    const response = await apiClient.patch<Booking>(
      `${this.baseUrl}/${bookingId}/status`,
      { status }
    );
    return response.data;
  }
}

export default new BookingRepository();

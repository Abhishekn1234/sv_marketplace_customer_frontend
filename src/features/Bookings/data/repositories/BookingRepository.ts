import type { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import type {
  Booking,


} from "../../domain/entities/booking.types";
import type { CancelBookingRequest } from "../../domain/entities/cancelbookingrequest.types";
import type { GetBookingsResponse } from "../../domain/entities/getbookingresponse.types";
import type { BookingPayload } from "../../domain/entities/bookingpayload.types";
import apiClient from "../../../api/interceptor";
import type { BookingById } from "../../domain/entities/bookingbyid.types";
import type { BookingHistoryQueryParams, BookingHistoryResponse } from "../../domain/entities/bookinghistory.types";

export class BookingRepository implements IBookingRepository {
  private readonly baseUrl = "/booking";

 
  async createBooking(payload: BookingPayload): Promise<Booking> {
    const response = await apiClient.post<Booking>(
      `${this.baseUrl}/create`,
      payload
    );
    console.log("Created Booking:", response.data);
    return response.data;
  }

async getBookings(): Promise<GetBookingsResponse> {
  const response = await apiClient.get("/booking");

  console.log("Fetched Bookings:", response.data);

  // ✅ Ensure always array
  const bookingsArray = Array.isArray(response.data)
    ? response.data
    : response.data?.bookings
    ? response.data.bookings
    : [response.data]; // 🔥 wrap single object

  return {
    bookings: bookingsArray,
  };
}
async getBookingHistory(params?:BookingHistoryQueryParams): Promise<BookingHistoryResponse> {

  const response = await apiClient.get<BookingHistoryResponse>(
    `${this.baseUrl}/history`,
    {
      params
    }
  );
  console.log(response);

  return response.data;
}

  
  async getBookingById(bookingId: string): Promise<BookingById> {
    const response = await apiClient.get<BookingById>(`${this.baseUrl}/${bookingId}`);
    console.log("Fetched Booking by ID:", response.data);
    return response.data;
  }

   async cancelBooking(request:CancelBookingRequest): Promise<Booking> {
    const response = await apiClient.post("/booking/cancel",request);
    return response.data;
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    const response = await apiClient.patch<Booking>(
      `${this.baseUrl}/${bookingId}/status`,
      { status }
    );
    return response.data;
  }
}

export default new BookingRepository();

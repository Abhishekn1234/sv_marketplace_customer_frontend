import type { IBookingRepository } from "../../domain/repositories/IBookingRepository";
import type {
  Booking,


} from "../../domain/entities/booking.types";
import type { CancelBookingRequest } from "../../domain/entities/cancelbookingrequest.types";
import type { GetBookingsResponse } from "../../domain/entities/getbookingresponse.types";
import type { BookingPayload } from "../../domain/entities/bookingpayload.types";
import apiClient from "../../../api/interceptor";
import type { BookingById } from "../../domain/entities/bookingbyid.types";

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
  const response = await apiClient.get(this.baseUrl);
  console.log("Data part:", response.data);

 
  const bookingsArray = response.data ? [response.data] : [];

  return { bookings: bookingsArray };
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

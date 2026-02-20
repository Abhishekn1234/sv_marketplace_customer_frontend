import { useQuery } from "@tanstack/react-query";
import { GetBookingByIdUsecase } from "../../domain/usecases/booking/GetBookingIdUsecase";

import BookingRepository from "../../data/repositories/BookingRepository";
import type { BookingById } from "../../domain/entities/bookingbyid.types";

export const BOOKING_BY_ID_QUERY_KEY = (id: string) =>
  ["booking", id] as const;

const bookingRepository = BookingRepository;
const getBookingByIdUseCase = new GetBookingByIdUsecase(bookingRepository);

export const useBookingById = (bookingId?: string) => {
  return useQuery<BookingById, Error>({
    queryKey: bookingId
      ? BOOKING_BY_ID_QUERY_KEY(bookingId)
      : ["booking", "disabled"],

    queryFn: async () => {
      if (!bookingId) throw new Error("Booking ID is required");
      return getBookingByIdUseCase.execute(bookingId);
    },

    enabled: Boolean(bookingId), // only runs if id exists
    staleTime: 60 * 1000,
  });
};

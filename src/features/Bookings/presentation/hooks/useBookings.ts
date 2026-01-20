import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { BookingRepository } from "../../data/repositories/BookingRepository";
import { GetBookingsUseCase } from "../../domain/usecases/booking/GetBookingsUseCase";
import { CreateBookingUseCase } from "../../domain/usecases/booking/CreateBookingUseCase";
import { CancelBookingUseCase } from "../../domain/usecases/booking/CancelBookingUseCase";

import type {
  Booking,

 
  
} from "../../domain/entities/booking.types";
import type { CancelBookingRequest } from "../../domain/entities/cancelbookingrequest.types";
import type { GetBookingsResponse } from "../../domain/entities/getbookingresponse.types";
import type { BookingPayload } from "../../domain/entities/bookingpayload.types";
import type { ServiceTierRef } from "../../domain/entities/servicetier.types";
import { useAuthStore } from "../../../core/store/auth";
import { mapBookingToAuthBooking } from "../../../core/mappers/mapBooking";

import type { Service } from "../../domain/entities/service.types";
import type { AuthBooking } from "../../domain/entities/auth.booking.types";

import {
  SERVICES_QUERY_KEY,
  SERVICE_TIERS_QUERY_KEY,
} from "./useServices";

const bookingRepository = new BookingRepository();
const getBookingsUseCase = new GetBookingsUseCase(bookingRepository);
const createBookingUseCase = new CreateBookingUseCase(bookingRepository);
const cancelBookingUseCase = new CancelBookingUseCase(bookingRepository);

export const BOOKINGS_QUERY_KEY = ["bookings"] as const;

export const useBookings = () => {
  const queryClient = useQueryClient();

  const customerData = useAuthStore((s) => s.customerData);
  const setUser = useAuthStore((s) => s.setUser);

  const user = customerData?.user;

  const { data, isLoading, isError } = useQuery<Booking[], Error>({
    queryKey: BOOKINGS_QUERY_KEY,
    queryFn: async (): Promise<Booking[]> => {
      const res: GetBookingsResponse = await getBookingsUseCase.execute();

      const services = queryClient.getQueryData<Service[]>(
        SERVICES_QUERY_KEY
      );
      const tiers = queryClient.getQueryData<ServiceTierRef[]>(
        SERVICE_TIERS_QUERY_KEY
      );

      if (user) {
        const mappedBookings: AuthBooking[] = res.bookings.map((b) => {
          const service = services?.find(
            (s) => String(s._id) === String(b.serviceId)
          );

          const tier = tiers?.find(
            (t) => String(t._id) === String(b.serviceTierId)
          );

          return mapBookingToAuthBooking(
            b,
            service?.name,
            tier?.displayName
          );
        });

        setUser({
          ...user,
          bookings: mappedBookings,
        });
      }

      return res.bookings;
    },
    staleTime: 60 * 1000,
  });

  const createBooking = useMutation<Booking, Error, BookingPayload>({
    mutationFn: (payload) => createBookingUseCase.execute(payload),
    onSuccess: (newBooking) => {
      queryClient.setQueryData<Booking[]>(BOOKINGS_QUERY_KEY, (old) =>
        old ? [newBooking, ...old] : [newBooking]
      );

      const { customerData } = useAuthStore.getState();
      const currentUser = customerData?.user;

      if (currentUser) {
        const mapped = mapBookingToAuthBooking(
          newBooking,
          newBooking.service?.name,
          newBooking.serviceTier?.displayName
        );

        setUser({
          ...currentUser,
          bookings: [mapped, ...(currentUser.bookings ?? [])],
        });
      }

      toast.success("Booking created successfully ✅");
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  const cancelBooking = useMutation<Booking, Error, CancelBookingRequest>({
    mutationFn: (req) => cancelBookingUseCase.execute(req),
    onSuccess: (updatedBooking) => {
      queryClient.setQueryData<Booking[]>(BOOKINGS_QUERY_KEY, (old) => {
        if (!old) return [];
        return old.map((b) =>
          b._id === updatedBooking._id ? updatedBooking : b
        );
      });

      const { customerData } = useAuthStore.getState();
      const currentUser = customerData?.user;

      if (currentUser?.bookings) {
        setUser({
          ...currentUser,
          bookings: currentUser.bookings.map((b) =>
            b._id === updatedBooking._id
              ? { ...b, status: updatedBooking.status }
              : b
          ),
        });
      }

      toast.success("Booking cancelled successfully ✅");
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  return {
    bookings: data ?? [],
    loading: isLoading,
    error: isError,
    createBooking: createBooking.mutateAsync,
    cancelBooking: cancelBooking.mutateAsync,
  };
};

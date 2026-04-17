"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { BookingRepository } from "../../data/repositories/BookingRepository";
import { GetBookingsUseCase } from "../../domain/usecases/booking/GetBookingsUseCase";
import { CreateBookingUseCase } from "../../domain/usecases/booking/CreateBookingUseCase";
import { CancelBookingUseCase } from "../../domain/usecases/booking/CancelBookingUseCase";

import type { Booking } from "../../domain/entities/booking.types";
import type { CancelBookingRequest } from "../../domain/entities/cancelbookingrequest.types";
import type { BookingPayload } from "../../domain/entities/bookingpayload.types";

import { useAuthStore } from "../../../core/store/auth";
import { mapBookingToAuthBooking } from "../../../core/mappers/mapBooking";

const bookingRepository = new BookingRepository();
const getBookingsUseCase = new GetBookingsUseCase(bookingRepository);
const createBookingUseCase = new CreateBookingUseCase(bookingRepository);
const cancelBookingUseCase = new CancelBookingUseCase(bookingRepository);

export const BOOKINGS_QUERY_KEY = ["bookings"] as const;

export const useBookings = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // ✅ FETCH BOOKINGS (NO BLOCKING CONDITIONS)
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery<Booking[], Error>({
    queryKey: BOOKINGS_QUERY_KEY,
   queryFn: async () => {
  console.log("🔥 Fetching bookings...");

  const res = await getBookingsUseCase.execute();

  const bookings = res?.bookings ?? [];

  // ✅ normalize here
  const normalized = bookings.map((b) => ({
    ...b,
    service: b.serviceId,
    serviceTier: b.serviceTierId,
  }));

  if (user) {
    const mapped = normalized.map((b) =>
      mapBookingToAuthBooking(
        b,
        b.service?.name,
        b.serviceTier?.displayName
      )
    );

    setUser({
      ...user,
      bookings: mapped,
    });
  }

  return normalized;
},

    staleTime: 5 * 60 * 1000, // ✅ 5 min cache
    refetchOnMount: false,   // ✅ no repeated API calls
    refetchOnWindowFocus: false, // ✅ avoid unwanted calls
  });

  // ✅ CREATE BOOKING
  const createBooking = useMutation<Booking, Error, BookingPayload>({
    mutationFn: (payload) => createBookingUseCase.execute(payload),

    onSuccess: (newBooking) => {
      // ✅ Update cache instantly
      queryClient.setQueryData<Booking[]>(BOOKINGS_QUERY_KEY, (old) =>
        old ? [newBooking, ...old] : [newBooking]
      );

      // ✅ Update auth store
      const currentUser = useAuthStore.getState().user;

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

      navigate("/confirmation");
    },

    onError: (err: any) => {
      const message =
        err?.response?.data?.message || err.message || "Something went wrong";

      toast.error(message);
    },
  });

  // ✅ CANCEL BOOKING
  const cancelBooking = useMutation<Booking, Error, CancelBookingRequest>({
    mutationFn: (req) => cancelBookingUseCase.execute(req),

    onSuccess: (updatedBooking) => {
      // ✅ Update cache
      queryClient.setQueryData<Booking[]>(BOOKINGS_QUERY_KEY, (old) => {
        if (!old) return [];
        return old.map((b) =>
          b._id === updatedBooking._id ? updatedBooking : b
        );
      });

      // ✅ Update auth store
      const currentUser = useAuthStore.getState().user;

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
      toast.error(err?.message || "Cancel failed ❌");
    },
  });
  
const updateBookingInCache = (updatedBooking: Booking) => {
  queryClient.setQueryData<Booking[]>(BOOKINGS_QUERY_KEY, (old) => {
    if (!old) return [];

    return old.map((b) =>
      b._id === updatedBooking._id ? { ...b, ...updatedBooking } : b
    );
  });
};

  return {
    bookings: data ?? [],
    loading: isLoading,
    error: isError,
    refetch,

    createBooking: createBooking.mutateAsync,
    cancelBooking: cancelBooking.mutateAsync,
    updateBookingInCache,
  };
};
"use client";

import { useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { BookingRepository } from "../../data/repositories/BookingRepository";
import { GetBookingsUseCase } from "../../domain/usecases/booking/GetBookingsUseCase";
import { CreateBookingUseCase } from "../../domain/usecases/booking/CreateBookingUseCase";
import { CancelBookingUseCase } from "../../domain/usecases/booking/CancelBookingUseCase";

import type { Booking } from "../../domain/entities/booking.types";
import type { BookingPayload } from "../../domain/entities/bookingpayload.types";
import type { CancelBookingRequest } from "../../domain/entities/cancelbookingrequest.types";
import type { BookingStatus } from "../../domain/entities/bookingstatus.types";

import { getSocket } from "@/features/core/Websocket/socket";
import { bookingKeys } from "@/features/Confirmation/presentation/utils/bookingkeys";

const repo = new BookingRepository();
const getBookings = new GetBookingsUseCase(repo);
const createBooking = new CreateBookingUseCase(repo);
const cancelBooking = new CancelBookingUseCase(repo);

// const CANCELLED_STATUSES: BookingStatus[] = [
//   "WORKER_CANCELLED",
//   "CUSTOMER_CANCELLED",
// ];

export const useBookings = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ================= FETCH BOOKINGS =================
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery<Booking[]>({
    queryKey: bookingKeys.all,
    queryFn: async () => {
      const res = await getBookings.execute();
      const list = res?.bookings ?? [];

      return Array.isArray(list)
        ? list.map((b) => ({
            ...b,
            service: b.serviceId,
            serviceTier: b.serviceTierId,
          }))
        : [];
    },

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  // ================= SOCKET =================
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (data: any) => {
      const booking = data?.booking;
      const bookingId = booking?._id || data?.bookingId;

      if (!bookingId) return;

      const updatedBooking: Booking = {
        ...booking,
        ...data,
        status: data.status || booking?.status,
      };

      queryClient.setQueryData<Booking[]>(
        bookingKeys.all,
        (old = []) =>
          old.map((b) =>
            String(b._id) === String(bookingId)
              ? { ...b, ...updatedBooking }
              : b
          )
      );

      queryClient.setQueryData(
        bookingKeys.detail(bookingId),
        (old: Booking | undefined) =>
          old ? { ...old, ...updatedBooking } : updatedBooking
      );
    };

    socket.on("bookingUpdated", handler);

    return () => {
      socket.off("bookingUpdated", handler);
    };
  }, [queryClient]);

  // ================= CREATE BOOKING =================
  const create = useMutation({
    mutationFn: (payload: BookingPayload) =>
      createBooking.execute(payload),

    onSuccess: (newBooking) => {
      queryClient.setQueryData<Booking[]>(
        bookingKeys.all,
        (old = []) => [newBooking, ...old]
      );

      queryClient.setQueryData(
        bookingKeys.detail(newBooking._id),
        newBooking
      );

      toast.success("Booking created");
      navigate(`/confirmation/${newBooking._id}`);
    },
  });

  // ================= CANCEL BOOKING =================
  const cancel = useMutation({
  mutationFn: (req: CancelBookingRequest) =>
    cancelBooking.execute(req),

  onMutate: async (req) => {
    await queryClient.cancelQueries({
      queryKey: bookingKeys.all,
    });

    const previous = queryClient.getQueryData<Booking[]>(
      bookingKeys.all
    );

    // Optimistic update
    queryClient.setQueryData<Booking[]>(
      bookingKeys.all,
      (old = []) =>
        old.map((b) =>
          b._id === req.bookingId
            ? {
                ...b,
                status: "CUSTOMER_CANCELLED" as BookingStatus,
                cancelReasonType: req.cancelReasonType,
                cancelReason: req.cancelReason,
              }
            : b
        )
    );

    queryClient.setQueryData(
      bookingKeys.detail(req.bookingId),
      (old: Booking | undefined) =>
        old
          ? {
              ...old,
              status: "CUSTOMER_CANCELLED" as BookingStatus,
              cancelReasonType: req.cancelReasonType,
              cancelReason: req.cancelReason,
            }
          : old
    );

    return { previous };
  },

  onError: (err: any, _req, context: any) => {
  if (context?.previous) {
    queryClient.setQueryData(
      bookingKeys.all,
      context.previous
    );
  }

  toast.error(
    err?.response?.data?.message ||
    err?.message ||
    "Failed to cancel booking ❌"
  );
},

  onSuccess: (updated, req) => {
    queryClient.setQueryData(
      bookingKeys.detail(req.bookingId),
      updated
    );

    queryClient.setQueryData<Booking[]>(
      bookingKeys.all,
      (old = []) =>
        old.map((b) =>
          b._id === req.bookingId ? updated : b
        )
    );

    toast.success("Booking cancelled");
  },
});

  return {
    bookings: data,
    loading: isLoading,
    error: isError,
    createBooking: create,
    cancelBooking: cancel,
  };
};
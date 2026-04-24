"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { BookingRepository } from "../../data/repositories/BookingRepository";
import { GetBookingsUseCase } from "../../domain/usecases/booking/GetBookingsUseCase";
import { CreateBookingUseCase } from "../../domain/usecases/booking/CreateBookingUseCase";
import { CancelBookingUseCase } from "../../domain/usecases/booking/CancelBookingUseCase";

import type { Booking } from "../../domain/entities/booking.types";
import type { CancelBookingRequest } from "../../domain/entities/cancelbookingrequest.types";
import type { BookingPayload } from "../../domain/entities/bookingpayload.types";
import type { CancelContext } from "../../domain/entities/cancelcontexts.types";

import { useAuthStore } from "../../../core/store/auth";
import { mapBookingToAuthBooking } from "../../../core/mappers/mapBooking";
import { getSocket } from "@/features/core/Websocket/socket";
import { bookingKeys } from "@/features/Confirmation/presentation/helpers/bookingkeys";

const bookingRepository = new BookingRepository();
const getBookingsUseCase = new GetBookingsUseCase(bookingRepository);
const createBookingUseCase = new CreateBookingUseCase(bookingRepository);
const cancelBookingUseCase = new CancelBookingUseCase(bookingRepository);

export const useBookings = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  // =========================
  // FETCH BOOKINGS
  // =========================
  const { data, isLoading, isError } = useQuery<Booking[], Error>({
    queryKey: bookingKeys.all,

    queryFn: async () => {
      const res = await getBookingsUseCase.execute();
      if (!res?.bookings) return [];

      return res.bookings.map((b) => ({
        ...b,
        service: b.serviceId,
        serviceTier: b.serviceTierId,
      }));
    },

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // =========================
  // SOCKET (CRITICAL FIX)
  // =========================
  useEffect(() => {
    const socket = getSocket?.();
    if (!socket) return;

    const handler = (booking: Booking) => {
      if (!booking?._id) return;

      // update LIST cache
      queryClient.setQueryData<Booking[]>(bookingKeys.all, (old = []) => {
        const exists = old.findIndex((b) => b._id === booking._id);

        if (exists !== -1) {
          return old.map((b) =>
            b._id === booking._id ? { ...b, ...booking } : b
          );
        }

        return [booking, ...old];
      });

      // 🔥 CRITICAL: update DETAIL cache (fixes your bug)
      queryClient.setQueryData(
        bookingKeys.detail(booking._id),
        booking
      );
    };

    socket.on("booking:update", handler);
    socket.on("booking.status.changed", handler);
    socket.on("booking.worker.assigned", handler);
    socket.on("booking.work.started", handler);
    socket.on("booking.work.completed-by-worker", handler);
    socket.on("booking.cancelled.worker", handler);

    return () => {
      socket.off("booking:update", handler);
      socket.off("booking.status.changed", handler);
      socket.off("booking.worker.assigned", handler);
      socket.off("booking.work.started", handler);
      socket.off("booking.work.completed-by-worker", handler);
      socket.off("booking.cancelled.worker", handler);
    };
  }, [queryClient]);

  // =========================
  // SYNC AUTH STORE (OPTIMIZED)
  // =========================
  useEffect(() => {
    if (!data || !user) return;

    const mapped = data.map((b) =>
      mapBookingToAuthBooking(
        b,
        b.service?.name,
        b.serviceTier?.displayName
      )
    );

    if (JSON.stringify(user.bookings) === JSON.stringify(mapped)) return;

    setUser({
      ...user,
      bookings: mapped,
    });
  }, [data]);

  // =========================
  // CREATE BOOKING
  // =========================
  const createBooking = useMutation<Booking, Error, BookingPayload>({
    mutationFn: (payload) => createBookingUseCase.execute(payload),

    onSuccess: (newBooking) => {
      queryClient.setQueryData(bookingKeys.all, (old: Booking[] = []) => [
        newBooking,
        ...old,
      ]);

      queryClient.setQueryData(
        bookingKeys.detail(newBooking._id),
        newBooking
      );

      toast.success("Booking created successfully ✅");
      navigate(`/confirmation/${newBooking._id}`);
    },
  });

  // =========================
  // CANCEL BOOKING
  // =========================
  const cancelBooking = useMutation<
    Booking,
    Error,
    CancelBookingRequest,
    CancelContext
  >({
    mutationFn: (req) => cancelBookingUseCase.execute(req),

    onMutate: async (req) => {
      await queryClient.cancelQueries({
        queryKey: bookingKeys.all,
      });

      const previous = queryClient.getQueryData<Booking[]>(bookingKeys.all);

      queryClient.setQueryData<Booking[]>(
        bookingKeys.all,
        (old = []) =>
          old.map((b) =>
            b._id === req.bookingId
              ? { ...b, status: "CUSTOMER_CANCELLED" }
              : b
          )
      );

      return { previousBookings: previous };
    },

    onError: (_err, _req, ctx) => {
      if (ctx?.previousBookings) {
        queryClient.setQueryData(bookingKeys.all, ctx.previousBookings);
      }
      toast.error("Cancel failed ❌");
    },

    onSuccess: (updated) => {
      queryClient.setQueryData(bookingKeys.all, (old: Booking[] = []) =>
        old.map((b) =>
          b._id === updated._id ? updated : b
        )
      );

      queryClient.setQueryData(
        bookingKeys.detail(updated._id),
        updated
      );
    },
  });

  // =========================
  // RETURN
  // =========================
  return {
    bookings: data ?? [],
    loading: isLoading,
    error: isError,

    createBooking,
    cancelBooking,
  };
};
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { BookingRepository } from "../../data/repositories/BookingRepository";
import { GetBookingsUseCase } from "../../domain/usecases/booking/GetBookingsUseCase";
import { CreateBookingUseCase } from "../../domain/usecases/booking/CreateBookingUseCase";
import { CancelBookingUseCase } from "../../domain/usecases/booking/CancelBookingUseCase";

import type { Booking } from "../../domain/entities/booking.types";
import type { BookingPayload } from "../../domain/entities/bookingpayload.types";
import type { CancelBookingRequest } from "../../domain/entities/cancelbookingrequest.types";


import { getSocket } from "@/features/core/Websocket/socket";
import { bookingKeys } from "@/features/Confirmation/presentation/helpers/bookingkeys";

const repo = new BookingRepository();
const getBookings = new GetBookingsUseCase(repo);
const createBooking = new CreateBookingUseCase(repo);
const cancelBooking = new CancelBookingUseCase(repo);

export const useBookings = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ================= FETCH =================
  const { data = [], isLoading, isError } = useQuery<Booking[]>({
    queryKey: bookingKeys.all,

    queryFn: async () => {
      const res = await getBookings.execute();
      const list = res?.bookings ?? [];

      if (!Array.isArray(list)) return [];

      return list.map((b) => ({
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

  // ================= SOCKET =================
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (booking: Booking) => {
      if (!booking?._id) return;

      // LIST UPDATE
      queryClient.setQueryData<Booking[]>(bookingKeys.all, (old = []) => {
        if (!Array.isArray(old)) return [];

        const exists = old.findIndex((b) => b._id === booking._id);

        if (exists !== -1) {
          return old.map((b) =>
            b._id === booking._id ? { ...b, ...booking } : b
          );
        }

        return [booking, ...old];
      });

      // DETAIL UPDATE
      queryClient.setQueryData(
        bookingKeys.detail(booking._id),
        booking
      );
    };

    const events = [
      "booking:update",
      "booking.status.changed",
      "booking.worker.assigned",
      "booking.work.started",
      "booking.work.completed-by-worker",
      "booking.cancelled.worker",
    ];

    events.forEach((e) => socket.on(e, handler));

    return () => {
      events.forEach((e) => socket.off(e, handler));
    };
  }, [queryClient]);

  // ================= CREATE =================
  const create = useMutation({
    mutationFn: (payload: BookingPayload) => createBooking.execute(payload),

    onSuccess: (newBooking) => {
      queryClient.setQueryData(bookingKeys.all, (old: Booking[] = []) => [
        newBooking,
        ...old,
      ]);

      queryClient.setQueryData(
        bookingKeys.detail(newBooking._id),
        newBooking
      );

      toast.success("Booking created");
      navigate(`/confirmation/${newBooking._id}`);
    },
  });

  // ================= CANCEL =================
  const cancel = useMutation({
    mutationFn: (req: CancelBookingRequest) =>
      cancelBooking.execute(req),

   onSuccess: (updated) => {
  // 1. Update list
  queryClient.setQueryData<Booking[]>(bookingKeys.all, (old = []) => {
    if (!Array.isArray(old)) return [];

    return old.map((b) =>
      b._id === updated._id ? { ...b, ...updated } : b
    );
  });

  // 2. Update detail cache (VERY IMPORTANT)
  queryClient.setQueryData(
    bookingKeys.detail(updated._id),
    (old: Booking | undefined) => ({
      ...old,
      ...updated,
    })
  );

  // 3. Safety net (forces UI consistency)
  queryClient.invalidateQueries({
    queryKey: bookingKeys.all,
  });
}
  });

  return {
    bookings: data,
    loading: isLoading,
    error: isError,
    createBooking: create,
    cancelBooking: cancel,
  };
};

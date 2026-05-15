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

  // ================= FETCH BOOKINGS =================
  const { data = [], isLoading, isError } = useQuery<Booking[]>({
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

      // 🔥 LIST CACHE (SOURCE OF TRUTH)
      queryClient.setQueryData<Booking[]>(bookingKeys.all, (old = []) =>
        old.map((b) =>
          String(b._id) === String(bookingId)
            ? { ...b, ...updatedBooking }
            : b
        )
      );

      // 🔥 DETAIL CACHE
      queryClient.setQueryData(
        bookingKeys.detail(bookingId),
        (old: Booking | undefined) =>
          old
            ? { ...old, ...updatedBooking }
            : updatedBooking
      );
    };

    socket.on("bookingUpdated", handler);

    return () => {
      socket.off("bookingUpdated", handler);
    };
  }, [queryClient]);

  // ================= CREATE =================
  const create = useMutation({
    mutationFn: (payload: BookingPayload) =>
      createBooking.execute(payload),

    onSuccess: (newBooking) => {
      queryClient.setQueryData<Booking[]>(bookingKeys.all, (old = []) => [
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
  queryClient.setQueryData<Booking[]>(bookingKeys.all, (old = []) =>
    old.map((b) =>
      String(b._id) === String(updated._id)
        ? { ...b, ...updated }
        : b
    )
  );

  queryClient.setQueryData(
    bookingKeys.detail(updated._id),
    updated
  );

  queryClient.invalidateQueries({
    queryKey: bookingKeys.all,
  });

  // toast.success("Booking cancelled");
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
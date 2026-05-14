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
      console.log("📡 FETCH BOOKINGS API CALLED");

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

  // ================= SOCKET UPDATES =================
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (payload: any) => {
      const bookingId =
        payload?.bookingId || payload?._id || payload?.booking?._id;

      if (!bookingId) return;

      // UPDATE LIST CACHE
      queryClient.setQueryData<Booking[]>(bookingKeys.all, (old = []) => {
        if (!Array.isArray(old)) return [];

        return old.map((b) => {
          if (b._id !== bookingId) return b;

          return {
            ...b,
            ...payload.booking,
            ...payload,
            status:
              payload.status ??
              payload.booking?.status ??
              b.status,
          };
        });
      });

      // UPDATE DETAIL CACHE
      queryClient.setQueryData(
        bookingKeys.detail(bookingId),
        (old: Booking | undefined) => {
          if (!old) return payload.booking ?? payload;

          return {
            ...old,
            ...payload.booking,
            ...payload,
            status:
              payload.status ??
              payload.booking?.status ??
              old.status,
          };
        }
      );
    };

    const events = [
      "booking:update",
      "booking.status.changed",
      "booking.worker.accepted",
      "booking.work.started",
      "booking.work.completed-by-worker",
      "booking.cancelled.worker",
    ];

    events.forEach((e) => socket.on(e, handler));

    return () => {
      events.forEach((e) => socket.off(e, handler));
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

    onSuccess: (updated) => {
      // UPDATE LIST
      queryClient.setQueryData<Booking[]>(
        bookingKeys.all,
        (old = []) => {
          if (!Array.isArray(old)) return [];

          return old.map((b) =>
            b._id === updated._id ? { ...b, ...updated } : b
          );
        }
      );

      // UPDATE DETAIL
      queryClient.setQueryData(
        bookingKeys.detail(updated._id),
        (old: Booking | undefined) => ({
          ...old,
          ...updated,
        })
      );

      toast.success("Booking cancelled");

      // ❌ IMPORTANT: DO NOT invalidate here
      // It causes extra API calls
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
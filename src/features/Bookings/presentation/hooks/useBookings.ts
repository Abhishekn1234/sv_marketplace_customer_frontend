"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect, useMemo } from "react";
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
import { getSocket } from "@/features/core/Websocket/socket";
import type { CancelContext } from "../../domain/entities/cancelcontexts.types";

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

  // =========================
  // FETCH BOOKINGS
  // =========================
  const { data, isLoading, isError, refetch } = useQuery<Booking[], Error>({
  queryKey: BOOKINGS_QUERY_KEY,

  queryFn: async () => {
    const res = await getBookingsUseCase.execute();
    if (!res?.bookings) return [];

    return res.bookings.map((b) => ({
      ...b,
      service: b.serviceId,
      serviceTier: b.serviceTierId,
    }));
  },
  

  // ✅ correct for v5
  staleTime: 1000 * 60 * 5,   // 5 minutes
  gcTime: 1000 * 60 * 10,     // replaces cacheTime

  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

  // =========================
  // SOCKET SYNC (🔥 FIX)
  // =========================
  useEffect(() => {
    const socket = getSocket?.();
    if (!socket) return;

    const handler = (booking: Booking) => {
  if (!booking?._id) return;

  queryClient.setQueryData<Booking[]>(BOOKINGS_QUERY_KEY, (old = []) => {
    const exists = old.some((b) => b._id === booking._id);

    if (exists) {
      return old.map((b) =>
        b._id === booking._id ? { ...b, ...booking } : b
      );
    }

    // 🔥 insert new booking if not present
    return [booking, ...old];
  });

  queryClient.setQueryData(["booking", booking._id], booking);
};

    socket.on("booking:update", handler);
    socket.on("booking.status.changed", handler);
    socket.on("booking.worker.assigned", handler);
    socket.on("booking.work.started", handler);
    socket.on("booking.work.completed-by-worker", handler);

    return () => {
      socket.off("booking:update", handler);
      socket.off("booking.status.changed", handler);
      socket.off("booking.worker.assigned", handler);
      socket.off("booking.work.started", handler);
      socket.off("booking.work.completed-by-worker", handler);
    };
  }, [queryClient]);

  // =========================
  // SYNC AUTH STORE
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
      queryClient.setQueryData<Booking[]>(BOOKINGS_QUERY_KEY, (old) =>
        old ? [newBooking, ...old] : [newBooking]
      );

      queryClient.setQueryData(["booking", newBooking._id], newBooking);

      toast.success("Booking created successfully ✅");
      navigate(`/confirmation/${newBooking._id}`);
    },

    onError: (err: any) => {
      toast.error(err?.message || "Something went wrong");
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

  // ✅ optimistic update
  onMutate: async (req): Promise<CancelContext> => {
    await queryClient.cancelQueries({
      queryKey: BOOKINGS_QUERY_KEY,
    });

    const previousBookings =
      queryClient.getQueryData<Booking[]>(BOOKINGS_QUERY_KEY);

    queryClient.setQueryData<Booking[]>(
      BOOKINGS_QUERY_KEY,
      (old) =>
        old?.map((b) =>
          b._id === req.bookingId
            ? {
                ...b,
                status: "CUSTOMER_CANCELLED",
                cancelReason: req.cancelReason,
              }
            : b
        ) ?? []
    );

    return { previousBookings };
  },

  // ❌ rollback
  onError: (_err, _req, context) => {
    if (context?.previousBookings) {
      queryClient.setQueryData(
        BOOKINGS_QUERY_KEY,
        context.previousBookings
      );
    }

    toast.error("Cancel failed ❌");
  },

  // ✅ sync server
  onSuccess: (updatedBooking) => {
    queryClient.setQueryData<Booking[]>(
      BOOKINGS_QUERY_KEY,
      (old) =>
        old?.map((b) =>
          b._id === updatedBooking._id
            ? updatedBooking
            : b
        ) ?? []
    );

    queryClient.setQueryData(
      ["booking", updatedBooking._id],
      updatedBooking
    );
  },

  onSettled: () => {
    queryClient.invalidateQueries({
      queryKey: BOOKINGS_QUERY_KEY,
    });
  },
});
  // =========================
  // UPDATE HELPER
  // =========================
  const updateBookingInCache = (updated: Booking) => {
    queryClient.setQueryData<Booking[]>(BOOKINGS_QUERY_KEY, (old) =>
      old?.map((b) =>
        b._id === updated._id ? { ...b, ...updated } : b
      ) ?? []
    );

    queryClient.setQueryData(["booking", updated._id], updated);
  };

  // =========================
  // RETURN
  // =========================
  return {
  bookings: useMemo(() => data ?? [], [data]),
  loading: isLoading,
  error: isError,
  refetch,

  createBooking,
  cancelBooking,
  updateBookingInCache,
};
};
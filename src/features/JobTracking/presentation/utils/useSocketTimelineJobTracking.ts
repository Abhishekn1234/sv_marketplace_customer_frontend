import { useEffect } from "react";
import { getSocket } from "@/features/core/Websocket/socket";
import { useQueryClient } from "@tanstack/react-query";
import { BookingEvents } from "@/components/common/BookingEvents";


interface Props {
  bookingId: string;
  setLocalBooking: (booking: any) => void;
  navigate: (path: string, options?: any) => void;
}

export function useSocketTimelineJobTracking({
  bookingId,
  setLocalBooking,
  navigate,
}: Props) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    if (!socket || !bookingId) return;

    const handler = (data: any) => {
      const booking = data?.booking;

      if (!booking?._id || String(booking._id) !== String(bookingId)) {
        return;
      }

      const eventName = data?.eventName;

      const EVENT_STATUS_MAP: Record<string, string> = {
        [BookingEvents.CREATED]: "CREATED",
        [BookingEvents.ACCEPTED]: "ACCEPTED",
        [BookingEvents.ASSIGNED]: "ASSIGNED",

        [BookingEvents.WORKER_ACCEPTED]: "WORKER_ACCEPTED",
        [BookingEvents.WORKER_REJECTED]: "WORKER_REJECTED",

        [BookingEvents.WORK_START_OTP_GENERATED]:
          "WORK_START_OTP_GENERATED",

        [BookingEvents.WORK_STARTED]: "IN_PROGRESS",
        [BookingEvents.WORKER_STARTED]: "IN_PROGRESS",

        [BookingEvents.WORKER_COMPLETED]:
          "WORK_COMPLETED_BY_WORKER",

        [BookingEvents.WORK_COMPLETED_BY_WORKER]:
          "WORK_COMPLETED_BY_WORKER",

        [BookingEvents.ALL_WORKERS_STARTED]:
          "ALL_WORKERS_STARTED",

        [BookingEvents.ALL_WORKERS_COMPLETED]:
          "ALL_WORKERS_COMPLETED",

        [BookingEvents.COMPLETION_OTP_GENERATED]:
          "WORK_COMPLETED_PENDING",

        [BookingEvents.COMPLETION_CONFIRMED]:
          "COMPLETED",

        [BookingEvents.COMPLETED]: "COMPLETED",

        [BookingEvents.FINALIZED]: "FINALIZED",

        [BookingEvents.PARTIALLY_PAID]:
          "PARTIALLY_PAID",

        [BookingEvents.PAID]: "PAID",

        [BookingEvents.PAYMENT_INITIATED]:
          "PAYMENT_PENDING",

        [BookingEvents.PAYMENT_COMPLETED]:
          "PAID",

        [BookingEvents.PAYMENT_FAILED]:
          "PAYMENT_FAILED",

        [BookingEvents.REFUNDED]:
          "REFUNDED",

        [BookingEvents.INVOICE_GENERATED]:
          "INVOICE_GENERATED",

        [BookingEvents.CANCELLED_BY_CUSTOMER]:
          "CUSTOMER_CANCELLED",

        [BookingEvents.CANCELLED_BY_WORKER]:
          "WORKER_CANCELLED",

        [BookingEvents.CANCELLEDLED_BY_PLATFORM]:
          "PLATFORM_CANCELLED",

        [BookingEvents.REVIEWED]:
          "REVIEWED",

        [BookingEvents.EXPIRED]:
          "EXPIRED",

        [BookingEvents.DISPUTE_CREATED]:
          "DISPUTED",

        [BookingEvents.DISPUTE_RESPONDED]:
          "DISPUTE_RESPONDED",

        [BookingEvents.DISPUTE_RESOLVED]:
          "DISPUTE_RESOLVED",

        [BookingEvents.COORDINATOR_ASSIGNED_WORKER]:
          "COORDINATOR_ASSIGNED_WORKER",

        [BookingEvents.COORDINATOR_REASSIGNED_WORKER]:
          "COORDINATOR_REASSIGNED_WORKER",

        [BookingEvents.CHAT_MESSAGE]:
          booking.status,
      };

      const mappedStatus =
        EVENT_STATUS_MAP[eventName] ??
        data?.status ??
        booking?.status;

      const updatedBooking = {
        ...booking,
        status: mappedStatus,
        activities: booking.activities || [],
      };

      queryClient.setQueryData(
        ["bookingDetail", bookingId],
        updatedBooking
      );

      queryClient.setQueryData(
        ["bookings"],
        (old: any[] = []) =>
          old.map((b) =>
            String(b._id) === String(bookingId)
              ? updatedBooking
              : b
          )
      );

      setLocalBooking(updatedBooking);

      if (
        mappedStatus === "CUSTOMER_CANCELLED" ||
        mappedStatus === "WORKER_CANCELLED" ||
        mappedStatus === "PLATFORM_CANCELLED"
      ) {
        navigate("/");
      }
    };

    socket.on("bookingUpdated", handler);

    return () => {
      socket.off("bookingUpdated", handler);
    };
  }, [
    bookingId,
    queryClient,
    navigate,
    setLocalBooking,
  ]);
}
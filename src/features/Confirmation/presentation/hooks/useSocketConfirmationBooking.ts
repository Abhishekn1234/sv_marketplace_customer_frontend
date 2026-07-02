import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/features/core/Websocket/socket";
import { BookingEvents } from "@/components/common/BookingEvents";

type Props = {
  bookingId?: string;
  setLocalBooking: React.Dispatch<React.SetStateAction<any>>;
  navigate: (path: string, options?: any) => void;
};

/**
 * Socket listener for Confirmation page.
 * Keeps react-query cache in sync and updates local booking state instantly.
 */
export function useSocketConfirmationBooking({
  bookingId,
  setLocalBooking,
  navigate,
}: Props) {
  const queryClient = useQueryClient();
  const lastEventKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !bookingId) return;

    const handler = (data: any) => {
      const booking = data?.booking;
      const eventBookingId = String(booking?._id ?? data?.bookingId ?? "");

      if (!eventBookingId || eventBookingId !== String(bookingId)) return;

      const eventName = data?.eventName;

      // Prevent duplicate processing when backend replays
      const eventKey =
        data?.payload?._id ||
        data?.activity?._id ||
        data?.occurredAt ||
        `${eventBookingId}:${eventName}`;

      if (lastEventKeyRef.current === String(eventKey)) return;
      lastEventKeyRef.current = String(eventKey);

      const EVENT_STATUS_MAP: Record<string, string> = {
        [BookingEvents.CREATED]: "CREATED",
        [BookingEvents.ACCEPTED]: "ACCEPTED",
        [BookingEvents.ASSIGNED]: "ASSIGNED",

        [BookingEvents.WORKER_ACCEPTED]: "WORKER_ACCEPTED",
        [BookingEvents.WORK_START_OTP_GENERATED]:
          "WORK_START_OTP_GENERATED",

        [BookingEvents.WORKER_REJECTED]: "WORKER_REJECTED",
        [BookingEvents.WORK_STARTED]: "IN_PROGRESS",
        [BookingEvents.WORKER_STARTED]: "IN_PROGRESS",

        [BookingEvents.WORKER_COMPLETED]:
          "WORK_COMPLETED_BY_WORKER",
        [BookingEvents.WORK_COMPLETED_BY_WORKER]:
          "WORK_COMPLETED_BY_WORKER",

        [BookingEvents.COMPLETION_OTP_GENERATED]:
          "WORK_COMPLETED_PENDING",
        [BookingEvents.COMPLETION_CONFIRMED]: "COMPLETED",
        [BookingEvents.COMPLETED]: "COMPLETED",

        [BookingEvents.INVOICE_GENERATED]: "INVOICE_GENERATED",

        [BookingEvents.CANCELLED_BY_CUSTOMER]: "CUSTOMER_CANCELLED",
        [BookingEvents.CANCELLED_BY_WORKER]: "WORKER_CANCELLED",
        [BookingEvents.CANCELLEDLED_BY_PLATFORM]: "PLATFORM_CANCELLED",

        [BookingEvents.PARTIALLY_PAID]: "PARTIALLY_PAID",
        [BookingEvents.PAID]: "PAID",

        [BookingEvents.PAYMENT_INITIATED]: "PAYMENT_PENDING",
        [BookingEvents.PAYMENT_COMPLETED]: "PAID",
        [BookingEvents.PAYMENT_FAILED]: "PAYMENT_FAILED",

        [BookingEvents.REFUNDED]: "REFUNDED",
      };

      const mappedStatus =
        EVENT_STATUS_MAP[eventName] ?? data?.status ?? booking?.status;

      const updatedBooking = {
        ...booking,
        status: mappedStatus,
        activities: booking?.activities || [],
      };

      // Update react-query caches so other consumers (if any) are consistent
      queryClient.setQueryData(["bookingDetail", bookingId], updatedBooking);
      queryClient.setQueryData(["bookings"], (old: any[] = []) =>
        old.map((b) =>
          String(b._id) === String(bookingId) ? updatedBooking : b
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
  }, [bookingId, navigate, queryClient, setLocalBooking]);
}


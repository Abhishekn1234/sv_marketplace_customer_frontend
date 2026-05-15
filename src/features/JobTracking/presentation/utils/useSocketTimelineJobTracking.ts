import { useEffect } from "react";
import { getSocket } from "@/features/core/Websocket/socket";
import { useQueryClient } from "@tanstack/react-query";

export function useSocketTimelineJobTracking({
  bookingId,
  setLocalBooking,
  navigate,
}: any) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !bookingId) return;

    const handler = (data: any) => {
      const booking = data.booking;
      if (!booking?._id || String(booking._id) !== String(bookingId)) return;

      const eventName = data.eventName;

      let mappedStatus = data.status || booking.status;

      switch (eventName) {
        case "booking.worker.accepted":
          mappedStatus = "WORKER_ACCEPTED";
          break;

        case "booking.work.started":
          mappedStatus = "IN_PROGRESS";
          break;

        case "booking.work.completed-by-worker":
          mappedStatus = "WORK_COMPLETED_BY_WORKER";
          break;

        case "booking.completion-otp.generated":
          mappedStatus = "WORK_COMPLETED_PENDING";
          break;

        case "booking.completion.confirmed":
          mappedStatus = "COMPLETED";
          break;

        case "booking.customer.cancelled":
          mappedStatus = "CUSTOMER_CANCELLED";
          break;

        case "booking.worker.cancelled":
          mappedStatus = "WORKER_CANCELLED";
          break;
      }

      // 🚨 NAVIGATION ON CANCEL
      if (
        mappedStatus === "CUSTOMER_CANCELLED" ||
        mappedStatus === "WORKER_CANCELLED"
      ) {
        navigate("/", { replace: true });
        return;
      }

      const updatedBooking = {
        ...booking,
        status: mappedStatus,
        activities: booking.activities || [],
      };

      // 1. React Query sync
      queryClient.setQueryData(
        ["bookingDetail", bookingId],
        updatedBooking
      );

      queryClient.setQueryData(["bookings"], (old: any = []) =>
        old.map((b: any) =>
          b._id === bookingId ? updatedBooking : b
        )
      );

      // 2. Local UI update
      setLocalBooking(updatedBooking);
    };

    socket.on("bookingUpdated", handler);

    return () => {
      socket.off("bookingUpdated", handler);
    };
  }, [bookingId, queryClient]);
}
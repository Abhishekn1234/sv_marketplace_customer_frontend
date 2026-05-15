import { useEffect } from "react";
import { getSocket } from "@/features/core/Websocket/socket";

export function useSocketBookings(
  setLocalBookings: React.Dispatch<React.SetStateAction<any[]>>
) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (data: any) => {
      const booking = data.booking;
      if (!booking?._id) return;

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

        case "booking.invoice.generated":
          mappedStatus = "INVOICE_GENERATED";
          break;

        case "booking.customer.cancelled":
          mappedStatus = "CUSTOMER_CANCELLED";
          break;

        case "booking.worker.cancelled":
          mappedStatus = "WORKER_CANCELLED";
          break;
      }

      const updatedBooking = {
        ...booking,
        status: mappedStatus,
        activities: booking.activities || [],
      };

      // 🔥 FULL REPLACE (NO MERGE BUGS)
      setLocalBookings((prev) =>
        prev.map((b) =>
          String(b._id) === String(booking._id)
            ? updatedBooking
            : b
        )
      );
    };

    socket.on("bookingUpdated", handler);

    return () => {
      socket.off("bookingUpdated", handler);
    };
  }, [setLocalBookings]);
}
import { useEffect } from "react";
import { getSocket } from "@/features/core/Websocket/socket";

export function useSocketBookings(
  setLocalBookings: React.Dispatch<React.SetStateAction<any[]>>
) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (data: any) => {
      const booking = data.booking ?? data;
      const bookingId = booking?._id;

      if (!bookingId) return;

      const eventName = data.eventName;
      const rawStatus = data.status || booking.status;

      let mappedStatus = rawStatus;

      switch (eventName) {
        case "booking.worker.accepted":
          mappedStatus = "WORKER_ACCEPTED";
          break;
        case "booking.work-start-otp.generated":
          mappedStatus = "WORK_STARTED";
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
        case "booking.invoice.generated":
          mappedStatus = "INVOICE_GENERATED";
          break;
      }

      // 🔥 Update matching booking in list
      setLocalBookings((prev) =>
        prev.map((b) => {
          if (String(b._id) !== String(bookingId)) return b;

          return {
            ...b,
            ...booking, // update full data if available
            status: mappedStatus,
          };
        })
      );
    };

    const events = [
      "booking.created",
      "booking:update",
      "booking.worker.accepted",
      "booking.work.started",
      "booking.work.completed-by-worker",
      "booking.completion-otp.generated",
      "booking.completion.confirmed",
      "booking.invoice.generated",
      "booking.cancelled.worker",
    ];

    events.forEach((e) => socket.on(e, handler));

    return () => {
      events.forEach((e) => socket.off(e, handler));
    };
  }, [setLocalBookings]);
}
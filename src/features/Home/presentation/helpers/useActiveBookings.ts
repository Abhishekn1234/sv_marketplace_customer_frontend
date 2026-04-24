import { useEffect } from "react";
import { getSocket } from "@/features/core/Websocket/socket";

interface Params {
  setBookings: React.Dispatch<React.SetStateAction<any[]>>;
}

export function useSocketActiveBookings({ setBookings }: Params) {
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

      // ✅ SAME mapping as timeline hook
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
          mappedStatus = "COMPLETED";
          break;

        case "booking.invoice.generated":
          mappedStatus = "INVOICE_GENERATED";
          break;

        case "booking.payment.pending":
          mappedStatus = "PAYMENT_PENDING";
          break;
      }

      setBookings((prev) => {
  const exists = prev.some(
    (b) => String(b._id) === String(bookingId)
  );

  if (exists) {
    return prev.map((b) => {
      if (String(b._id) !== String(bookingId)) return b;

      return {
        ...b,
        ...booking,
        status: mappedStatus,
        assignedWorkers:
          booking.assignedWorkers ?? b.assignedWorkers,
      };
    });
  }

  // ✅ New booking (immutable add)
  return [
    {
      ...booking,
      status: mappedStatus,
    },
    ...prev,
  ];
});
    };

    const events = [
      "booking.created",
      "booking:update",
      "booking.worker.accepted",
      "booking.work-start-otp.generated",
      "booking.work.started",
      "booking.work.completed-by-worker",
      "booking.completion-otp.generated",
      "booking.completion.confirmed",
      "booking.invoice.generated",
      "booking.payment.pending",
      "booking.cancelled.worker",
    ];

    events.forEach((e) => socket.on(e, handler));

    return () => {
      events.forEach((e) => socket.off(e, handler));
    };
  }, [setBookings]);
}
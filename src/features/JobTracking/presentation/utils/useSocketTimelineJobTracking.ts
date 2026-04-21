import { useEffect } from "react";
import { getSocket } from "@/features/core/Websocket/socket";

export function useSocketTimelineJobTracking({
  bookingId,
  setLocalBooking,
}: any) {
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !bookingId) return;

    const handler = (data: any) => {
      const booking = data.booking ?? data;

      if (!booking?._id || String(booking._id) !== String(bookingId)) return;

      const eventName = data.eventName;

      let mappedStatus = booking.status;

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
      }

      // const activity = {
      //   _id: `${eventName}-${Date.now()}`,
      //   type: mappedStatus,
      //   createdAt:
      //     data.occurredAt || new Date().toISOString(),
      // };

      setLocalBooking((prev: any) => {
  if (!prev) return prev;

  const activity = {
    _id: `${eventName}-${Date.now()}`,
    type: mappedStatus,
    createdAt: data.occurredAt || new Date().toISOString(),
  };

  const exists = prev.activities?.some(
    (a: any) =>
      a.type === activity.type &&
      Math.abs(
        new Date(a.createdAt).getTime() -
          new Date(activity.createdAt).getTime()
      ) < 1000
  );

  return {
    ...prev,

    // ❌ DO NOT spread booking here
    // ...booking,

    status: mappedStatus,

    assignedWorkers:
      booking.assignedWorkers ?? prev.assignedWorkers,

    activities: exists
      ? prev.activities
      : [...(prev.activities || []), activity],
  };
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
    ];

    events.forEach((e) => socket.on(e, handler));

    return () => {
      events.forEach((e) => socket.off(e, handler));
    };
  }, [bookingId, setLocalBooking]);
}
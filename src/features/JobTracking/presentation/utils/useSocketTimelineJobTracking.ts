import { useEffect } from "react";
import { getSocket } from "@/features/core/Websocket/socket";
import { useQueryClient } from "@tanstack/react-query";

export function useSocketTimelineJobTracking({
  bookingId,
  setLocalBooking,
}: any) {
  const queryClient = useQueryClient();

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
        case "booking.work.started":
          mappedStatus = "IN_PROGRESS";
          break;
        case "booking.work.completed-by-worker":
          mappedStatus = "WORK_COMPLETED_BY_WORKER";
          break;
        case "booking.completion.confirmed":
          mappedStatus = "COMPLETED";
          break;
      }

      const updatedBooking = {
        ...booking,
        status: mappedStatus,
        activities: [
          ...(booking.activities || []),
          {
            _id: `${eventName}-${Date.now()}`,
            type: mappedStatus,
            createdAt: data.occurredAt || new Date().toISOString(),
          },
        ],
      };

      // ✅ 1. React Query update
      queryClient.setQueryData(
        ["bookings"],
        (old: any = []) =>
          old.map((b: any) =>
            b._id === bookingId ? updatedBooking : b
          )
      );

      // ✅ 2. IMPORTANT: detail cache
      queryClient.setQueryData(
        ["bookingDetail", bookingId],
        updatedBooking
      );

      // ✅ 3. Instant UI update
      setLocalBooking(updatedBooking);
    };

    const events = [
      "booking.worker.accepted",
      "booking.work.started",
      "booking.work.completed-by-worker",
      "booking.completion.confirmed",
    ];

    events.forEach((e) => socket.on(e, handler));

    return () => {
      events.forEach((e) => socket.off(e, handler));
    };
  }, [bookingId, queryClient]);
}
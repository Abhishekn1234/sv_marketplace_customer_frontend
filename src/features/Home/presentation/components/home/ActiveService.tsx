import { useMemo } from "react";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";

export default function ActiveService() {
  const { bookings = [] } = useBookings();

  // Find today's booking
  const todayBooking = useMemo(() => {
    const today = new Date().toDateString();
    return bookings.find((b: any) => {
      const dateStr = b?.schedule?.startDateTime || b?.createdAt;
      if (!dateStr) return false;
      return new Date(dateStr).toDateString() === today;
    });
  }, [bookings]);

  // Find next upcoming booking if no today booking
  const nextBooking = useMemo(() => {
    if (todayBooking) return null;
    const sorted = bookings
      .filter((b: any) => b?.schedule?.startDateTime)
      .sort((a, b) => {
        const aDate = a.schedule?.startDateTime
          ? new Date(a.schedule.startDateTime).getTime()
          : Infinity;
        const bDate = b.schedule?.startDateTime
          ? new Date(b.schedule.startDateTime).getTime()
          : Infinity;
        return aDate - bDate;
      });
    return sorted[0] || null;
  }, [bookings, todayBooking]);

  const booking = todayBooking || nextBooking;
  if (!booking) return null;

  // Service name
  const serviceName =
    typeof booking.serviceId === "object"
      ? booking.serviceId?.name
      : "Service";

  // Get first assigned worker (if any)
  const firstWorker = booking.assignedWorkers?.[0]?.workerId;
  const workerName = firstWorker?.fullName || "No worker assigned";
  const workerImage =
    firstWorker?.profilePictureUrl ||
    "https://via.placeholder.com/100?text=No+Worker";

  // Booking status and progress
  const status = booking.status?.toLowerCase();
  const progressMap: Record<string, number> = {
    requested: 10,
    assigned: 30,
    started: 50,
    in_progress: 70,
    work_completed_pending: 90,
    completed: 100,
  };
  const progress = progressMap[status] || 20;

  const isStarted = status === "started" || status === "in_progress";

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 overflow-hidden relative transition-all duration-300 hover:shadow-lg hover:border-blue-500 hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="relative w-2.5 h-2.5 bg-green-500 rounded-full">
            <span className="absolute -inset-1 bg-green-500 rounded-full opacity-40 animate-pulse"></span>
          </span>
          <span className="text-gray-900 font-semibold text-lg">{serviceName}</span>
          {isStarted && (
            <span className="px-3 py-1 text-green-700 bg-green-100 border border-green-200 rounded-full text-xs font-semibold uppercase tracking-wider">
              {status?.replace("_", " ")}
            </span>
          )}
        </div>
        {isStarted && (
          <span className="text-blue-600 font-semibold text-base tabular-nums">
            {progress}%
          </span>
        )}
      </div>

      {/* Worker Info */}
      <div className="flex items-center gap-3.5 mb-4">
        <img
          src={workerImage}
          alt={workerName}
          className="w-13 h-13 rounded-lg border-2 border-gray-100 object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-gray-900 font-semibold text-base">
            {workerName}
          </div>
          <div className="text-gray-400 text-sm mt-0.5">
            {firstWorker ? "Assigned Professional" : "Worker Not accepted yet"}
          </div>
        </div>
      </div>

      {/* Progress bar if started */}
      {isStarted && (
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {isStarted ? (
          <>
            <button
              onClick={() => (window.location.href = `/jobtracking/${booking._id}`)}
              className="flex-1 h-12 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
            >
              Track
            </button>
            <button
              className="flex-1 h-12 rounded-xl bg-white border border-blue-100 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition"
            >
              Chat
            </button>
          </>
        ) : (
          <button
            onClick={() => (window.location.href = `/bookings`)}
            className="flex-1 h-12 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
          >
            View Booking
          </button>
        )}
      </div>
    </div>
  );
}
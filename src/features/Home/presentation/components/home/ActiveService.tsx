import { useMemo } from "react";
import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";
import { progressMap } from "../../helpers/progressmap";
import { getBookingFlags } from "../../helpers/getbookingflags";
import { useLanguage } from "@/features/context/LanguageContext";

export default function ActiveService() {
  const { data: bookings } = useBookingHistory();

   const {t}=useLanguage();
  const datas = useMemo(() => {
    return bookings?.pages?.flatMap((page) => page.data) || [];
  }, [bookings]);

 
 const ACTIVE_STATUSES = [
  "REQUESTED",
  "ASSIGNED",
  "WORKER_ACCEPTED",  
  "ACCEPTED",
  "IN_PROGRESS",
  "WORK_COMPLETED_PENDING",
  "COMPLETED", 
];

  const activeBookings = useMemo(() => {
    return datas.filter((b) => ACTIVE_STATUSES.includes(b.status));
  }, [datas]);

  const today = new Date().toDateString();

  const todayBooking = useMemo(() => {
    return activeBookings.find((b) => {
      const dateStr = b?.schedule?.startDateTime || b?.createdAt;
      if (!dateStr) return false;

      const date = new Date(dateStr);
      return !isNaN(date.getTime()) && date.toDateString() === today;
    });
  }, [activeBookings, today]);

  
  const nextBooking = useMemo(() => {
    if (todayBooking) return null;

    const upcoming = activeBookings
  .filter((b) => b?.schedule?.startDateTime) 
  .sort((a, b) => {
    const aTime = a?.schedule?.startDateTime
      ? new Date(a.schedule.startDateTime).getTime()
      : Infinity;

    const bTime = b?.schedule?.startDateTime
      ? new Date(b.schedule.startDateTime).getTime()
      : Infinity;

    return aTime - bTime;
  });
     return upcoming[0] || null;
  }, [activeBookings, todayBooking]);

  const booking = todayBooking || nextBooking;

  
  if (!booking) {
    return (
      <div className="rounded-2xl p-6 text-center text-gray-500">
       {t.home["No active bookings found"]}
      </div>
    );
  }


  const serviceName = booking?.service?.name || "Service";

  const firstWorker = booking?.assignedWorkers?.[0]?.worker;

  const workerName = firstWorker?.fullName || "No worker assigned";

  const workerImage =
    firstWorker?.profilePictureUrl ||
    "https://via.placeholder.com/100?text=No+Worker";

  const status = booking?.status || "REQUESTED";

  const { isAssigned, isStarted, showTracking, isPaid } =
    getBookingFlags(status, !!firstWorker);

  const progress =
    progressMap[status?.toLowerCase()] ||
    progressMap[status] ||
    20;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 overflow-hidden relative transition-all duration-300 hover:shadow-lg hover:border-blue-500 hover:-translate-y-0.5">
      
     
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="relative w-2.5 h-2.5 bg-green-500 rounded-full">
            <span className="absolute -inset-1 bg-green-500 rounded-full opacity-40 animate-pulse"></span>
          </span>

          <span className="text-gray-900 font-semibold text-lg">
            {serviceName}
          </span>

          {showTracking && (
            <span className="px-3 py-1 text-green-700 bg-green-100 border border-green-200 rounded-full text-xs font-semibold uppercase tracking-wider">
              {isAssigned && !isStarted
                ? "assigned"
                : status.replace(/_/g, " ").toLowerCase()}
            </span>
          )}
        </div>

        {isStarted && (
          <span className="text-blue-600 font-semibold text-base tabular-nums">
            {progress}%
          </span>
        )}
      </div>

      
      <div className="flex items-center gap-3.5 mb-4">
        <img
          src={workerImage}
          alt={workerName}
          className="w-13 h-13 rounded-lg border-2 border-gray-100 object-cover"
        />

        <div className="flex-1 min-w-0">
          <div className="text-gray-900 font-semibold text-base">
            {workerName}
          </div>

          <div className="text-gray-400 text-sm mt-0.5">
            {firstWorker
              ? "Assigned Professional"
              : "Worker not accepted yet"}
          </div>
        </div>
      </div>

      
      {showTracking ? (
        <>
          {isStarted && (
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-5">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() =>
                (window.location.href = `/jobtracking/${booking._id}`)
              }
              className="flex-1 h-12 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
            >
              {t.home.Track}
            </button>

            <button className="flex-1 h-12 rounded-xl bg-white border border-blue-100 text-blue-600 font-semibold text-sm hover:bg-blue-50 transition">
              {t.home.Chat}
            </button>
          </div>

          {status === "COMPLETED" && (
            <button
              onClick={() =>
                (window.location.href = `/bookings`)
              }
              className="mt-3 w-full h-12 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
            >
             {t.home["View Booking"]}
            </button>
          )}
        </>
      ) : isPaid ? (
        <button
          onClick={() =>
            (window.location.href = `/servicerating/${booking._id}`)
          }
          className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
        >
          {t.home["Rate Service"]}
        </button>
      ) : (
        <button
          onClick={() =>
            (window.location.href = `/bookings`)
          }
          className="w-full text-center p-5 rounded-2xl bg-blue-600 text-white shadow-md hover:bg-blue-700 transition"
        >
          View Booking
        </button>
      )}
    </div>
  );
}
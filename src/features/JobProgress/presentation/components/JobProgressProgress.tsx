"use client";

import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { progressMap } from "@/features/Home/presentation/helpers/progressmap";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";

export function JobProgressProgress() {
  const { data } = useBookingHistory();
  const { bookingId } = useParams();

  const booking = useMemo(() => {
    if (!data?.pages) return null;

    const allBookings = data.pages.flatMap((page: any) => page?.data || []);
    return allBookings.find((b: any) => b._id === bookingId);
  }, [data, bookingId]);

  const status = booking?.status || "REQUESTED";

  const worker = booking?.assignedWorkers?.[0];
  const startTime = worker?.startedAt
    ? formatDates(worker.startedAt)
    : "N/A";
  const endTime = worker?.completedAt
    ? formatDates(worker.completedAt)
    : "N/A";

  const progress =
    progressMap[status.toLowerCase()] || 20;

  // ✅ HANDLE CANCELLED STATES
  const isWorkerCancelled = status === "WORKER_CANCELLED";
  const isCustomerCancelled = status === "CUSTOMER_CANCELLED";

  if (isWorkerCancelled || isCustomerCancelled) {
    return (
      <div className="bg-white rounded-[20px] p-7 border border-red-200 shadow-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[18px] font-bold text-gray-900">
            Overall Progress
          </h2>

          <div className="px-4 py-2 bg-red-50 text-red-600 text-[13px] font-semibold rounded-full">
            Cancelled
          </div>
        </div>

        {/* ❌ Cancel Message */}
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            ❌
          </div>

          <p className="text-red-600 font-semibold text-lg">
            {isWorkerCancelled
              ? "Worker cancelled the booking"
              : "You cancelled the booking"}
          </p>

          <p className="text-gray-500 text-sm mt-2">
            This job will not proceed further.
          </p>
        </div>

        {/* Optional time */}
        <div className="text-sm text-gray-400 mt-4 text-center">
          {formatDates(booking?.updatedAt)}
        </div>
      </div>
    );
  }

  // ✅ NORMAL FLOW
  return (
    <div className="bg-white rounded-[20px] p-7 border border-gray-200 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-bold text-gray-900">
          Overall Progress
        </h2>

        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-[13px] font-semibold rounded-full">
          <svg
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="w-4 h-4 animate-spin"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          {status.replace("_", " ")}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-gray-500">Task Completion</span>
          <span className="text-blue-600 font-semibold">
            {progress}%
          </span>
        </div>

        <div className="h-3 bg-gray-100 rounded-md overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-md relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]" />
          </div>
        </div>
      </div>

      {/* Time */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
        <svg
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="w-4 h-4 text-blue-600"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Started at {startTime} • Est. completion: {endTime}
      </div>
    </div>
  );
}

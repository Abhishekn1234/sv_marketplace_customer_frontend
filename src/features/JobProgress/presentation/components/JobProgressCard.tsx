"use client";

import { useMemo } from "react";
import { getStepStatus } from "../helpers/getstatusprogress";
import { useParams } from "react-router-dom";
import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";

export function JobProgressCard() {
  const { data } = useBookingHistory();
  const { bookingId } = useParams();

  const booking = useMemo(() => {
    if (!data?.pages) return null;

    const allBookings = data.pages.flatMap((p: any) => p.data || []);
    return allBookings.find((b: any) => b._id === bookingId);
  }, [data, bookingId]);

  const status = booking?.status;

  // ✅ HANDLE TASKS (including cancelled cases)
  const tasks = useMemo(() => {
    if (!status) return [];

    // 🔴 WORKER CANCELLED
    if (status === "WORKER_CANCELLED") {
      return [
        {
          title: "Booking requested",
          status: "completed",
        },
        {
          title: "Worker has cancelled",
          status: "cancelled",
        },
      ];
    }

    // 🔴 CUSTOMER CANCELLED
    if (status === "CUSTOMER_CANCELLED") {
      return [
        {
          title: "Booking requested",
          status: "completed",
        },
        {
          title: "You cancelled the booking",
          status: "cancelled",
        },
      ];
    }

    // ✅ NORMAL FLOW
    return [
      "Booking requested",
      "Worker assigned",
      "Work in progress",
      "Work completed",
      "Invoice Generated",
      "Payment completed",
    ].map((title, index) => ({
      title,
      status: getStepStatus(index + 1, status),
    }));
  }, [status]);

  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm">
      <h2 className="text-[16px] font-bold text-gray-900 mb-5">
        Task Checklist
      </h2>

      <div className="flex flex-col gap-3">
        {tasks.map((task, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 p-4 rounded-xl border transition
              ${
                task.status === "completed"
                  ? "bg-emerald-50 border-emerald-200"
                  : task.status === "progress"
                  ? "bg-blue-50 border-blue-500"
                  : task.status === "cancelled"
                  ? "bg-red-50 border-red-300"
                  : "bg-gray-50 border-gray-200"
              }`}
          >
            {/* 🔹 Status Icon */}
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center
                ${
                  task.status === "completed"
                    ? "bg-emerald-500"
                    : task.status === "progress"
                    ? "bg-blue-600 animate-pulse"
                    : task.status === "cancelled"
                    ? "bg-red-500"
                    : "border-2 border-gray-300 bg-white"
                }`}
            />

            {/* 🔹 Content */}
            <div className="flex-1">
              <div
                className={`text-[15px] font-semibold ${
                  task.status === "completed"
                    ? "line-through text-gray-500"
                    : task.status === "cancelled"
                    ? "text-red-600"
                    : "text-gray-900"
                }`}
              >
                {task.title}
              </div>

              <div className="text-[13px] text-gray-500">
                {task.status === "completed"
                  ? "Completed"
                  : task.status === "progress"
                  ? "In Progress"
                  : task.status === "cancelled"
                  ? "Cancelled"
                  : "Pending"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

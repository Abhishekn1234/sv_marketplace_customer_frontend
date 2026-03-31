"use client";

import { useMemo } from "react";
import { getStepStatus } from "../helpers/getstatusprogress";
import { useParams } from "react-router-dom";
import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";
import { useLanguage } from "@/features/context/LanguageContext";

export function JobProgressCard() {
  const { data } = useBookingHistory();
  const { bookingId } = useParams();

  const booking = useMemo(() => {
    if (!data?.pages) return null;

    const allBookings = data.pages.flatMap((p: any) => p.data || []);
    return allBookings.find((b: any) => b._id === bookingId);
  }, [data, bookingId]);
 const {t}=useLanguage();
  const status = booking?.status;

  // ✅ HANDLE TASKS (including cancelled cases)
  const tasks = useMemo(() => {
    if (!status) return [];

    // 🔴 WORKER CANCELLED
    if (status === "WORKER_CANCELLED") {
      return [
        {
          title: t.jobprogresspage.bookingRequested,
          status: "completed",
        },
        {
          title: t.jobprogresspage.workerCancelled,
          status: "cancelled",
        },
      ];
    }

    // 🔴 CUSTOMER CANCELLED
    if (status === "CUSTOMER_CANCELLED") {
      return [
        {
          title: t.jobprogresspage.bookingRequested,
          status: "completed",
        },
        {
          title: t.jobprogresspage.customerCancelled,
          status: "cancelled",
        },
      ];
    }

    // ✅ NORMAL FLOW
    return [
     t.jobprogresspage.bookingRequested,
      t.jobprogresspage.workerAssigned,
      t.jobprogresspage.workInProgress,
      t.jobprogresspage.workCompleted,
      t.jobprogresspage.invoiceGenerated,
      t.jobprogresspage.paymentCompleted,
    ].map((title, index) => ({
      title,
      status: getStepStatus(index + 1, status),
    }));
  }, [status]);

  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm">
      <h2 className="text-[16px] font-bold text-gray-900 mb-5">
       {t.jobprogresspage.taskChecklist}
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

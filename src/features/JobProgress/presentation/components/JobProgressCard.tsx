"use client";

import { useMemo } from "react";
import { useLanguage } from "@/features/context/LanguageContext";

export function JobProgressCard({ booking }: any) {
  const { t } = useLanguage();

  const tasks = useMemo(() => {
    if (!booking?.activities?.length) return [];

    return booking.activities.map((a: any) => ({
      title:t.jobprogresspage[a.key as keyof typeof t.jobprogresspage] ?? a.key,
      status: a.status, // completed | progress | pending | cancelled
    }));
  }, [booking?.activities, t]);

  const isCancelled =
    booking?.status === "WORKER_CANCELLED" ||
    booking?.status === "CUSTOMER_CANCELLED";

  if (isCancelled) {
    return (
      <div className="bg-white rounded-[20px] p-6 border border-red-200 shadow-sm">
        <h2 className="text-[16px] font-bold mb-4">
          {t.jobprogresspage.taskChecklist}
        </h2>

        <div className="text-red-600 font-semibold text-center">
          {booking.status === "WORKER_CANCELLED"
            ? t.jobprogresspage.workerCancelled
            : t.jobprogresspage.customerCancelled}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm">
      <h2 className="text-[16px] font-bold text-gray-900 mb-5">
        {t.jobprogresspage.taskChecklist}
      </h2>

      <div className="flex flex-col gap-3">
        {tasks.map((task: any, i: number) => (
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
            {/* Icon */}
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

            {/* Text */}
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

              <div className="text-[13px] text-gray-500 capitalize">
                {task.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
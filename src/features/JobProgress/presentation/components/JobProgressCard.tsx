"use client";

import { useMemo } from "react";
import { useLanguage } from "@/features/context/LanguageContext";
import { normalizeStatus } from "../helpers/mapstatusactivities";
import CommonCard from "@/components/common/CommonCards";

export function JobProgressCard({ booking }: any) {
  const { t } = useLanguage();

  const tasks = useMemo(() => {
    const activities = booking?.activities ?? [];

    return [...activities]
      .filter((a: any) => a?.createdAt)
      .sort(
        (a: any, b: any) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      )
      .map((a: any) => ({
        title:
          t.jobprogresspage[a.type as keyof typeof t.jobprogresspage] ??
          a.type,
        status: normalizeStatus(a.type),
        time: a.createdAt,
      }));
  }, [booking?.activities, t]);

  const isCancelled =
    booking?.status === "WORKER_CANCELLED" ||
    booking?.status === "CUSTOMER_CANCELLED";

  // -----------------------------
  // CANCELLED UI
  // -----------------------------
  if (isCancelled) {
    return (
      <CommonCard className="border-red-200">
        <h2 className="text-[16px] font-bold mb-4">
          {t.jobprogresspage.taskChecklist}
        </h2>

        <div className="text-red-600 font-semibold text-center">
          {booking.status === "WORKER_CANCELLED"
            ? t.jobprogresspage.workerCancelled
            : t.jobprogresspage.customerCancelled}
        </div>
      </CommonCard>
    );
  }

  // -----------------------------
  // EMPTY STATE
  // -----------------------------
  if (!tasks.length) {
    return (
      <CommonCard>
        <h2 className="text-[16px] font-bold mb-4">
          {t.jobprogresspage.taskChecklist}
        </h2>

        <div className="text-gray-400 text-sm text-center">
          No activities yet...
        </div>
      </CommonCard>
    );
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <CommonCard>
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
            {/* ICON */}
            <div
              className={`w-6 h-6 rounded-md flex items-center justify-center border
                ${
                  task.status === "completed"
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-gray-300 bg-white"
                }`}
            >
              {task.status === "completed" && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>

            {/* CONTENT */}
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

              <div className="text-[11px] text-gray-400">
                {new Date(task.time).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CommonCard>
  );
}
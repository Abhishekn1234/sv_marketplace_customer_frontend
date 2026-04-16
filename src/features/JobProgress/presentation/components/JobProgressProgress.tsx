"use client";

import { progressMap } from "@/features/Home/presentation/helpers/progressmap";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";
import { useLanguage } from "@/features/context/LanguageContext";

export function JobProgressProgress({ booking, loading }: any) {
  const { t } = useLanguage();

  if (loading) return <div>Loading...</div>;
  if (!booking) return <div>No booking found</div>;

  const status = (booking?.status || "REQUESTED").toString();
  const normalizedStatus = status.toUpperCase();

  const worker = Array.isArray(booking?.assignedWorkers)
    ? booking.assignedWorkers[0]
    : undefined;

  const startTime = worker?.startedAt
    ? formatDates(worker.startedAt)
    : "N/A";

  const endTime = worker?.completedAt
    ? formatDates(worker.completedAt)
    : "N/A";

  const progress = progressMap[status.toLowerCase()] ?? 20;

  const isWorkerCancelled = normalizedStatus === "WORKER_CANCELLED";
  const isCustomerCancelled = normalizedStatus === "CUSTOMER_CANCELLED";

  if (isWorkerCancelled || isCustomerCancelled) {
    return (
      <div className="bg-white rounded-[20px] p-7 border border-red-200 shadow-sm">
        <h2 className="text-[18px] font-bold text-gray-900 mb-6">
          {t.jobprogresspage.overallProgress}
        </h2>

        <div className="text-center text-red-600 font-semibold">
          {isWorkerCancelled
            ? t.jobprogresspage.workerCancelled
            : t.jobprogresspage.customerCancelled}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[20px] p-7 border border-gray-200 shadow-sm">
      <h2 className="text-[18px] font-bold mb-4">
        {t.jobprogresspage.overallProgress}
      </h2>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span>{t.jobprogresspage.taskCompletion}</span>
          <span>{progress}%</span>
        </div>

        <div className="h-3 bg-gray-200 rounded">
          <div
            className="h-full bg-blue-600 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-sm text-gray-500">
        {startTime !== "N/A" && `${t.jobprogresspage.startedAt} ${startTime}`}
        {endTime !== "N/A" && ` • ${endTime}`}
      </div>
    </div>
  );
}
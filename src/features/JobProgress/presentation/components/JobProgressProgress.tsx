"use client";

import { progressMap } from "@/features/Home/presentation/utils/progressmap";
import { formatDates } from "@/features/Home/presentation/utils/formatdatestring";
import { useLanguage } from "@/features/context/LanguageContext";
import type { BookingStatus } from "@/features/Bookings/domain/entities/bookingstatus.types";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import CommonCard from "@/components/common/CommonCards";
import CommonProgress from "@/components/common/CommonProgress";

export function JobProgressProgress({ booking, loading }: any) {
  const { t } = useLanguage();

  if (loading) return <CommonSpinner />;
  if (!booking) return <div>{t.common["No data available"]}</div>;

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

  const progress = progressMap[status as BookingStatus] ?? 20;

  const isWorkerCancelled = normalizedStatus === "WORKER_CANCELLED";
  const isCustomerCancelled = normalizedStatus === "CUSTOMER_CANCELLED";

  if (isWorkerCancelled || isCustomerCancelled) {
    return (
      <CommonCard className="border-red-200">
        <h2 className="text-[18px] font-bold text-gray-900 mb-6">
          {t.jobprogresspage.overallProgress}
        </h2>

        <div className="text-center text-red-600 font-semibold">
          {isWorkerCancelled
            ? t.jobprogresspage.workerCancelled
            : t.jobprogresspage.customerCancelled}
        </div>
      </CommonCard>
    );
  }

  return (
    <CommonCard>
      <h2 className="text-[18px] font-bold mb-4">
        {t.jobprogresspage.overallProgress}
      </h2>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span>{t.jobprogresspage.taskCompletion}</span>
          <span>{progress}%</span>
        </div>

        <div>
                  <CommonProgress
            value={progress}
            showValue={false}
            className="mb-5"
            trackClassName="h-2 rounded-full bg-gray-200"
            indicatorClassName="bg-blue-600 rounded-full"
          />
        </div>
      </div>

      {/* Time Info */}
      <div className="text-sm text-gray-500">
        {startTime !== "N/A" &&
          `${t.jobprogresspage.startedAt} ${startTime}`}
        {endTime !== "N/A" && ` • ${endTime}`}
      </div>
    </CommonCard>
  );
}
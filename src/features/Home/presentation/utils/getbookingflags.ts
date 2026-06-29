export const getBookingFlags = (
  status?: string,
  hasWorker?: boolean
) => {
  const safeStatus = status || "REQUESTED";

  const CANCELLED = [
    "WORKER_CANCELLED",
    "CUSTOMER_CANCELLED",
  ];

  const isCancelled = CANCELLED.includes(safeStatus);

  const isAssigned = !!hasWorker;

  const isStarted = [
    "IN_PROGRESS",
    "WORK_COMPLETED_PENDING",
    "COMPLETED",
  ].includes(safeStatus);

  // ✅ FIX: allow all except cancelled
  const showTracking = !isCancelled;

  const isPaid = safeStatus === "PAID";

  return {
    isAssigned,
    isStarted,
    showTracking,
    isPaid,
  };
};
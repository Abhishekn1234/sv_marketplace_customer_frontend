export const getBookingFlags = (
  status?: string,
  hasWorker?: boolean
) => {
  const safeStatus = status || "REQUESTED";
  
  const isAssigned =
    safeStatus === "WORKER_ACCEPTED" && !!hasWorker;

  const isStarted = [
    "IN_PROGRESS",
    "WORK_COMPLETED_PENDING",
    "COMPLETED",
  ].includes(safeStatus);

  const showTracking = isAssigned || isStarted;

  const isPaid = safeStatus === "PAID";

  return {
    isAssigned,
    isStarted,
    showTracking,
    isPaid,
  };
};
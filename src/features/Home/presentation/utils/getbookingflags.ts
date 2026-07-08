export const getBookingFlags = (
  status?: string,
  hasWorker: boolean = false
) => {
  const safeStatus = status ?? "REQUESTED";

  const CANCELLED_STATUSES = [
    "WORKER_CANCELLED",
    "CUSTOMER_CANCELLED",
  ];

  const TRACKING_STATUSES = [
    "REQUESTED",
    "ASSIGNED",
    "WORKER_ACCEPTED",
    "ACCEPTED",
    "STARTED",
    "IN_PROGRESS",
    "WORK_COMPLETED_PENDING",
    "OTP_VERIFIED",
    "INVOICE_GENERATED",
    "PAYMENT_PENDING",
    "PAYMENT_COMPLETED",
    "COMPLETED",
  ];

  const STARTED_STATUSES = [
    "STARTED",
    "IN_PROGRESS",
    "WORK_COMPLETED_PENDING",
    "OTP_VERIFIED",
    "INVOICE_GENERATED",
    "PAYMENT_PENDING",
    "PAYMENT_COMPLETED",
    "COMPLETED",
  ];

  return {
    isCancelled: CANCELLED_STATUSES.includes(safeStatus),

    isAssigned:
      hasWorker &&
      ["ASSIGNED", "WORKER_ACCEPTED"].includes(safeStatus),

    isStarted: STARTED_STATUSES.includes(safeStatus),

    showTracking:
      TRACKING_STATUSES.includes(safeStatus) &&
      !CANCELLED_STATUSES.includes(safeStatus),

    isPaid: ["PAYMENT_COMPLETED", "PAID"].includes(safeStatus),
  };
};
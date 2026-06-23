export const getStepStatus = (step: number, status?: string) => {
  const order = [
    "REQUESTED",
    "WORKER_ACCEPTED",
    "IN_PROGRESS",
    "WORK_COMPLETED_PENDING",
    "INVOICE_GENERATED",
    "PAID",
  ];

  // ✅ Special handling for PAID
  if (status === "PAID") {
    return "completed"; // all steps done
  }

  const currentIndex = order.indexOf(status || "");

  // ❌ Cancel / Reject
  if (
    status?.includes("CANCELLED") ||
    status?.includes("REJECTED")
  ) {
    return "pending";
  }

  if (step - 1 < currentIndex) return "completed";
  if (step - 1 === currentIndex) return "progress";
  return "pending";
};
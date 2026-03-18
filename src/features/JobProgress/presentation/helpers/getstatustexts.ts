export const getStatusText = (status?: string) => {
  switch (status) {
    case "REQUESTED":
      return "Your service request has been received. Assigning professional...";

    case "WORKER_ACCEPTED":
      return "Professional assigned to your service";

    case "IN_PROGRESS":
      return "Currently working on your service";

    case "WORK_COMPLETED_PENDING":
      return "Work completed, awaiting confirmation";

    case "COMPLETED":
      return "Service completed successfully";
    case "INVOICE_GENERATED":
    return "Invoice generated";
    case "PAID":
      return "Payment completed";

    case "WORKER_CANCELLED":
    case "CUSTOMER_CANCELLED":
    case "WORKER_REJECTED":
    case "CUSTOMER_REJECTED":
      return "This booking was cancelled";

    default:
      return "Waiting for update";
  }
};
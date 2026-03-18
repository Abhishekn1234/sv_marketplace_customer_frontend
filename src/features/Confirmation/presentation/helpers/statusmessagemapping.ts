export  const statusMessageMap: Record<string, string> = {
    PENDING: "Your booking request is pending. Worker will confirm soon.",
    ASSIGNED: "A worker has been assigned to your booking.",
    STARTED: "Work has started.",
    IN_PROGRESS: "Work is currently in progress.",
    WORK_COMPLETED_PENDING:
      "Work completed. Waiting for OTP confirmation from worker.",
    COMPLETED: "Work is completed successfully.",
    CANCELLED: "This booking has been cancelled.",
    REQUESTED:
      "Booking has been requested and work will be accepted by the worker.",
  };
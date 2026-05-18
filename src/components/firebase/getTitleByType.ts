export function getTitleByType(type:any) {
  switch (type) {
    case "CHAT_MESSAGE":
      return "New Message";

    case "BOOKING_CREATED":
      return "New Booking Request";

    case "JOB_TRACKING":
      return "Job Update";
   case "BOOKING_CANCELLED":
      return "Booking Cancelled";
      case "BOOKING_COMPLETED":
      return "Booking Completed";
      case "BOOKING_REQUEST":
      return "Booking Requested";
    case "JOB_PROGRESS":
      return "Progress Update";

    case "VIDEO_CALL":
      return "Incoming Call";

    default:
      return "Notification";
  }
}
export default function buildRoute(data: any) {
  switch (data.type) {
    case "CHAT_MESSAGE":
      return `/message/${data.senderId}/${data.bookingId}`;

    case "BOOKING_CREATED":
      return `/bookingdetail/${data.serviceId}/${data.serviceTierId}`;

    case "JOB_TRACKING":
      return `/jobtracking/${data.bookingId}`;

    case "JOB_PROGRESS":
      return `/jobprogress/${data.bookingId}`;

    case "VIDEO_CALL":
      return `/video-call/${data.senderId}`;

    default:
      return "/notifications";
  }
}
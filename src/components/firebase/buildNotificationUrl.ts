const getId = (value: any) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

export default function buildRoute(data: any) {
  if (!data) return "/notifications";
  if (data.url) return data.url;

  const bookingId =
    getId(data.bookingId) || getId(data.booking) || getId(data.booking_id);

  const type = (data.type || "").toString().toUpperCase();

  switch (type) {
    case "CHAT_MESSAGE":
    case "NEW_MESSAGE":
      return bookingId ? `/message/${bookingId}` : "/notifications";

    case "ADMIN_MESSAGE":
      return "/notifications";

    case "BOOKING_CREATED":
    case "BOOKING_CREATE":
      return data.serviceId && data.serviceTierId
        ? `/bookingdetail/${data.serviceId}/${data.serviceTierId}`
        : "/notifications";

    case "BOOKING_REQUEST":
    case "BOOKING_REQUESTED":
      return bookingId ? `/jobtracking/${bookingId}` : "/notifications";

    case "JOB_TRACKING":
    case "BOOKING_UPDATE":
    case "BOOKING_UPDATED":
    case "WORK_ASSIGNED":
      return bookingId ? `/jobtracking/${bookingId}` : "/notifications";

    case "JOB_PROGRESS":
    case "PROGRESS_UPDATE":
      return bookingId ? `/jobprogress/${bookingId}` : "/notifications";

    case "VIDEO_CALL":
      return data.senderId ? `/video-call/${data.senderId}` : "/notifications";

    default:
      return "/notifications";
  }
}

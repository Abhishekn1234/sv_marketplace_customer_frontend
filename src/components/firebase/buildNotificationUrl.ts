const getId = (value: any) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value._id || value.id || "";
};

export default function buildRoute(data: any) {
  if (data.url) return data.url;

  const bookingId =
    getId(data.bookingId) ||
    getId(data.booking) ||
    getId(data.booking_id);

  switch (data.type) {
    case "CHAT_MESSAGE":
      return bookingId ? `/message/${bookingId}` : "/notifications";
    case "ADMIN_MESSAGE":
    return "/notifications";

    case "BOOKING_CREATED":
      return data.serviceId && data.serviceTierId
        ? `/bookingdetail/${data.serviceId}/${data.serviceTierId}`
        : "/notifications";

    case "JOB_TRACKING":
    case "BOOKING_UPDATE":
      return bookingId ? `/jobtracking/${bookingId}` : "/notifications";

    case "JOB_PROGRESS":
      return bookingId ? `/jobprogress/${bookingId}` : "/notifications";

    case "VIDEO_CALL":
      return data.senderId ? `/video-call/${data.senderId}` : "/notifications";

    default:
      return "/notifications";
  }
}

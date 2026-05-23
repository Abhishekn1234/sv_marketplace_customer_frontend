type NotificationLike = {
  id?: string;
  url?: string;
  link?: string;
  route?: string;
  data?: Record<string, any>;
  payload?: Record<string, any>;
  metadata?: Record<string, any>;
  bookingId?: string;
  workerId?: string;
  senderId?: string;
  message?: string;
  text?: string;
  body?: string;
  messageId?: string;
  createdAt?: string;
  timestamp?: string;
  type?: string;
};


const getFirstString = (...values: unknown[]) =>
  values.find((value): value is string => typeof value === "string" && value.trim().length > 0);

export function getNotificationTarget(
  notification: NotificationLike
): string {
  const data =
    notification.data ||
    notification.payload ||
    notification.metadata ||
    {};

  const type = (notification.type || "").toString().toUpperCase();

  const bookingId = getFirstString(
    notification.bookingId,
    data.bookingId,
    data.booking?._id
  );

  // const workerId = getFirstString(
  //   notification.workerId,
  //   data.workerId,
  //   data.worker?._id
  // );

  const senderId = getFirstString(
    notification.senderId,
    data.senderId
  );

  // =========================
  // 💬 CHAT ROUTE
  // =========================
  if (type === "CHAT_MESSAGE" || type === "NEW_MESSAGE") {
    if (bookingId) {
      return `/message/${bookingId}`;
    }

    // fallback safe route
    if (bookingId) return `/jobtracking/${bookingId}`;

    return "/messages";
  }

  // =========================
  // 📦 BOOKING UPDATE
  // =========================
  if (
    type === "BOOKING_REQUEST" ||
    type === "BOOKING_REQUESTED" ||
    type === "BOOKING_UPDATE" ||
    type === "BOOKING_UPDATED" ||
    type === "WORK_ASSIGNED"
  ) {
    if (bookingId) {
      return `/jobtracking/${bookingId}`;
    }

    return "/bookings";
  }

  // =========================
  // DEFAULT CHAT FALLBACK
  // (ONLY if clearly chat-related data exists)
  // =========================
  if (bookingId && senderId) {
    return `/message/${bookingId}`;
  }

  if (bookingId) {
    return `/jobtracking/${bookingId}`;
  }

  // =========================
  // FINAL FALLBACK (NEVER NULL)
  // =========================
  return "/notifications";
}
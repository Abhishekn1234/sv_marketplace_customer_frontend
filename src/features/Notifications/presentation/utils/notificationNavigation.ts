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

export function getNotificationTarget(notification: NotificationLike) {
  const data =
    notification.data ||
    notification.payload ||
    notification.metadata ||
    {};

  const type = notification.type;

  const directUrl = getFirstString(
    notification.url,
    notification.link,
    notification.route,
    data.url,
    data.link,
    data.route
  );

  if (directUrl) return withMessageParams(directUrl, notification, data);

  const bookingId = getFirstString(
    notification.bookingId,
    data.bookingId,
    data.booking?._id
  );

  const workerId = getFirstString(
    notification.workerId,
    data.workerId,
    data.worker?._id,
    notification.senderId,
    data.senderId
  );

  // 💬 1. CHAT MESSAGE (highest priority)
  if (
    type === "CHAT_MESSAGE" ||
    type === "NEW_MESSAGE" ||
    data?.chatId
  ) {
    if (workerId && bookingId) {
      return withMessageParams(
        `/message/${workerId}/${bookingId}`,
        notification,
        data
      );
    }
    return "/messages";
  }

  // 📦 2. BOOKING FLOW
  if (
    type === "BOOKING_REQUEST" ||
    type === "BOOKING_UPDATE"
  ) {
    if (bookingId) {
      return `/jobtracking/${bookingId}`;
    }
    return "/bookings";
  }

  // fallback: old logic
  if (bookingId && workerId) {
    return withMessageParams(
      `/message/${workerId}/${bookingId}`,
      notification,
      data
    );
  }

  if (bookingId) {
    return `/jobtracking/${bookingId}`;
  }

  return null;
}

function withMessageParams(
  url: string,
  notification: NotificationLike,
  data: Record<string, any>
) {
  const text = getFirstString(
    notification.text,
    notification.message,
    notification.body,
    data.text,
    data.message,
    data.body
  );

  if (!text) return url;

  const target = new URL(url, window.location.origin);
  const messageId = getFirstString(notification.messageId, data.messageId, notification.id, data.id);
  const senderId = getFirstString(notification.senderId, data.senderId);
  const timestamp = getFirstString(notification.timestamp, data.timestamp, notification.createdAt, data.createdAt);

  target.searchParams.set("text", text);
  if (messageId) target.searchParams.set("messageId", messageId);
  if (senderId) target.searchParams.set("senderId", senderId);
  if (timestamp) target.searchParams.set("timestamp", timestamp);

  return `${target.pathname}${target.search}`;
}

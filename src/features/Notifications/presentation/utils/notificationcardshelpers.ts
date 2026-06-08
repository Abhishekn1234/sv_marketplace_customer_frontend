const getFirstString = (...values: unknown[]) =>
  values.find(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0
  );

const isChatNotification = (notification: any) => {
  const data =
    notification.data ||
    notification.payload ||
    notification.metadata ||
    {};

  const senderType =
    notification.senderType ||
    notification.sender ||
    data.senderType ||
    data.sender;

  return (
    notification.type === "CHAT_MESSAGE" ||
    notification.type === "NEW_MESSAGE" ||
    senderType === "WORKER" ||
    senderType === "worker"
  );
};

const getWorkerName = (notification: any) => {
  const data =
    notification.data ||
    notification.payload ||
    notification.metadata ||
    {};

  return getFirstString(
    notification.workerName,
    notification.senderName,
    notification.senderFullName,
    notification.workerFullName,
    notification.fullName,
    data.workerName,
    data.senderName,
    data.senderFullName,
    data.workerFullName,
    data.fullName
  );
};

const getMessageText = (notification: any) => {
  const data =
    notification.data ||
    notification.payload ||
    notification.metadata ||
    {};

  return (
    getFirstString(
      notification.body,
      notification.message,
      notification.text,
      notification.content,
      data.body,
      data.message,
      data.text,
      data.content
    ) || "New message"
  );
};

export const formatNotificationForPanel = (notification: any) => {
  if (!isChatNotification(notification)) return notification;

  const workerName = getWorkerName(notification);

  return {
    ...notification,
    title: workerName
      ? `New chat message from ${workerName}`
      : "New chat message from worker",
    message: getMessageText(notification),
  };
};

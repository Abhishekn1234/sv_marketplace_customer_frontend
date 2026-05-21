export const showWebPushNotification = ({
  title,
  body,
  route = "/notifications",
  icon = "/logo.png",
}: any) => {
  console.log("Permission:", Notification.permission);

  if (Notification.permission !== "granted") {
    console.warn("Notifications not granted");
    return;
  }

  const n = new Notification(title, {
    body,
    icon,
    requireInteraction: true,
    data: { route },
  });

  n.onclick = () => {
    window.focus();
    window.location.href = route;
    n.close();
  };
};
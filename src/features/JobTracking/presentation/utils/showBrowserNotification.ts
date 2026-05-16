// utils/showBrowserNotification.ts

export function showBrowserNotification({
  title,
  body,
  data,
}: {
  title: string;
  body: string;
  data?: any;
}) {
  if (Notification.permission !== "granted") return;

  const notification = new Notification(title, {
    body,
    icon: "/logo.png",
    data,
  });

  notification.onclick = () => {
    window.focus();

    window.dispatchEvent(
      new CustomEvent("app:navigate", {
        detail: {
          url: data?.url,
          payload: data,
        },
      })
    );

    notification.close();
  };
}
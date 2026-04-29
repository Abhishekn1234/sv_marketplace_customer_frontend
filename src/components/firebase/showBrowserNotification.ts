export const showBrowserNotification = (payload: any) => {
  if (Notification.permission !== "granted") return;

  const title = payload.notification?.title || "New Notification";
  const options = {
    body: payload.notification?.body || "",
    icon: "/logo.png",
    data: payload.data || {},
  };

  const notification = new Notification(title, options);

  /* ✅ Handle click (VERY IMPORTANT UX) */
  notification.onclick = () => {
    window.focus();

    // optional navigation
    if (options.data?.url) {
      window.location.href = options.data.url;
    }
  };
};
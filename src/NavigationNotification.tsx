import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function NotificationNavigation() {
  const navigate = useNavigate();

  useEffect(() => {
    const channel =
      new BroadcastChannel(
        "fcm_channel"
      );

    // ✅ Broadcast channel
    const channelHandler = (
      event: MessageEvent
    ) => {
      const data = event.data;

      console.log(
        "📡 Broadcast:",
        data
      );

      if (
        data?.type ===
          "NAVIGATE" &&
        data.url
      ) {
        navigate(data.url);
      }
    };

    // ✅ SW direct message
    const swHandler = (
      event: MessageEvent
    ) => {
      const data = event.data;

      console.log(
        "📨 SW Message:",
        data
      );

      if (
        data?.type ===
          "NAVIGATE" &&
        data.url
      ) {
        navigate(data.url);
      }
    };

    channel.addEventListener(
      "message",
      channelHandler
    );

    navigator.serviceWorker?.addEventListener(
      "message",
      swHandler
    );

    return () => {
      channel.removeEventListener(
        "message",
        channelHandler
      );

      navigator.serviceWorker?.removeEventListener(
        "message",
        swHandler
      );

      channel.close();
    };
  }, [navigate]);

  return null;
}
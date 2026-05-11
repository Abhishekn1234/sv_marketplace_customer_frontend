// NotificationNavigation.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotificationNavigation() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (
      event: MessageEvent
    ) => {
      console.log(
        "SW MESSAGE:",
        event.data
      );

      if (
        event.data?.type ===
        "NAVIGATE"
      ) {
        navigate(
          event.data.url,
          {
            replace: false,
          }
        );
      }
    };

    navigator.serviceWorker.addEventListener(
      "message",
      handler
    );

    return () => {
      navigator.serviceWorker.removeEventListener(
        "message",
        handler
      );
    };
  }, [navigate]);

  return null;
}
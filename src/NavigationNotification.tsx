import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NotificationNavigation() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "NAVIGATE") {
        if (document.visibilityState === "visible") {
          navigate(event.data.url);
        }
      }
    };

    navigator.serviceWorker.addEventListener("message", handler);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handler);
    };
  }, [navigate]);

  return null;
}
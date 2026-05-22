import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { CHAT_MESSAGES_KEY } from "./features/WorkerChat/presentation/hooks/useGetChatMessages";

const normalizeNavigationPath = (url: unknown) => {
  if (typeof url !== "string" || !url.trim()) return "/notifications";

  try {
    const parsedUrl = new URL(url, window.location.origin);

    if (parsedUrl.origin !== window.location.origin) {
      return "/notifications";
    }

    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`;
  } catch {
    return "/notifications";
  }
};

export default function NotificationNavigation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const handler = (event: MessageEvent) => {
      if (event.data?.type !== "NAVIGATE") return;

      const path = normalizeNavigationPath(event.data.url);

      const chatMatch = path.match(/^\/message\/([^/?#]+)/);

      if (chatMatch?.[1]) {
        const bookingId = decodeURIComponent(chatMatch[1]);

        queueMicrotask(() => {
          queryClient.invalidateQueries({
            queryKey: [CHAT_MESSAGES_KEY, bookingId],
          });
        });
      }

      navigate(path);
    };

    navigator.serviceWorker.addEventListener("message", handler);

    return () => {
      navigator.serviceWorker.removeEventListener("message", handler);
    };
  }, [navigate, queryClient]);

  return null;
}
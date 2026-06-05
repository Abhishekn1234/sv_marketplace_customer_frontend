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
    const handler = (event: MessageEvent) => {
      const data = event.data;

      if (data?.type !== "NAVIGATE") return;

      const path = normalizeNavigationPath(data.url);

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

    // ✅ IMPORTANT: BOTH LISTENERS (FIX MOBILE ISSUE)
    navigator.serviceWorker?.addEventListener("message", handler);
    window.addEventListener("message", handler);

    return () => {
      navigator.serviceWorker?.removeEventListener("message", handler);
      window.removeEventListener("message", handler);
    };
  }, [navigate, queryClient]);

  return null;
}
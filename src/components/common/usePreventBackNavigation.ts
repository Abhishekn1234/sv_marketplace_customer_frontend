import { useEffect } from "react";

export default function useDisableBackButton(enabled: boolean = true): void {
  useEffect(() => {
    if (!enabled) return;

    window.history.pushState({}, "", window.location.pathname);

    const handlePopState = () => {
      // 1. Try to close the tab immediately when they click back
      window.close();

      // 2. If window.close() fails (due to browser security rules), 
      // redirect them to a blank page or a custom URL instead of leaving them stuck
      setTimeout(() => {
        window.location.href = "about:blank"; // or "https://google.com"
      }, 100);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled]);
}
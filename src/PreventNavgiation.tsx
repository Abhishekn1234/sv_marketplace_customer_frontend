import { useEffect } from "react";
import { Outlet } from "react-router-dom";

interface Props {
  enabled?: boolean;
}

export default function PreventBackNavigation({
  enabled = true,
}: Props) {
  useEffect(() => {
    if (!enabled) return;

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    // Add current page again
    window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [enabled]);

  return <Outlet />;
}
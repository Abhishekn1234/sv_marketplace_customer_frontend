import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const usePreventBackNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add a dummy history entry
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      const leave = window.confirm(
        "Are you sure you want to leave this page?"
      );

      if (leave) {
        navigate("/bookings", { replace: true });
      } else {
        // Re-add the current page to history
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
};
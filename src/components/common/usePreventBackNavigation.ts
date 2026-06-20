import { useEffect } from "react";

export const usePreventBackNavigation = () => {
  useEffect(() => {
    // Create a history entry for the current page
    window.history.pushState(
      { preventBack: true },
      "",
      window.location.href
    );

    const handlePopState = () => {
      // Immediately restore current page
      window.history.pushState(
        { preventBack: true },
        "",
        window.location.href
      );
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
};
import { useEffect } from "react";

export default function useDisableBackButton(enabled: boolean = true): void {
  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      // Modern browsers ignore the custom string and show a generic message,
      // but we still need to preventDefault and set returnValue for compatibility.
      event.preventDefault();
      event.returnValue = "Your work will be lost."; 
      return "Your work will be lost.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled]);
}
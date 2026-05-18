export const navigateTo = (url: string, payload?: any) => {
  window.dispatchEvent(
    new CustomEvent("app:navigate", {
      detail: {
        type: "PUSH_NAVIGATION",
        url,
        payload,
      },
    })
  );
};
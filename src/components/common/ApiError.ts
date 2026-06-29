// src/utils/handleApiError.ts

import { toast } from "react-toastify";

export function handleApiError(
  error: any,
  fallbackMessage = "Something went wrong"
): string {
  const response = error?.response?.data;

  let message = fallbackMessage;

  if (Array.isArray(response?.message)) {
    message = response.message.join("\n");
  } else if (typeof response?.message === "string") {
    message = response.message;
  } else if (typeof error?.message === "string") {
    message = error.message;
  }

  toast.error(message);

  return message;
}
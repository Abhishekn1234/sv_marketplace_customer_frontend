export const formatSmartDate = (isoDate?: string) => {
  if (!isoDate) return "N/A";

  const date = new Date(isoDate);
  const now = new Date();

  const isToday =
    date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);

  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return `Today ${timeString}`;
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${timeString}`;
  }

  if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow ${timeString}`;
  }

  return date.toLocaleString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

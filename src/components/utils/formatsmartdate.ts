type FormatSmartDateOptions = {
  showDate?: boolean;
  showTime?: boolean;
};



export function formatSmartDate(
  value?: string | Date,
  options: FormatSmartDateOptions = {}
): string {
  const { showDate = true, showTime = true } = options;

  if (!value) return "N/A";

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) return "N/A";

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const fullDate = date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  let dateLabel = fullDate;

  if (date.toDateString() === today.toDateString()) {
    dateLabel = "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    dateLabel = "Yesterday";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    dateLabel = "Tomorrow";
  }

  if (showDate && showTime) return `${dateLabel} ${time}`;
  if (showDate) return dateLabel;
  if (showTime) return time;

  return "";
}
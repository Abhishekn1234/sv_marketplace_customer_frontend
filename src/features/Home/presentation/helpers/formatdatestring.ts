export const formatDates = (dateString?: string) => {
  if (!dateString) return "Pending";

  const date = new Date(dateString);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (target.getTime() === today.getTime()) {
    return `Today • ${time}`;
  }

  if (target.getTime() === yesterday.getTime()) {
    return `Yesterday • ${time}`;
  }

  if (target.getTime() === tomorrow.getTime()) {
    return `Tomorrow • ${time}`;
  }

  return (
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + ` • ${time}`
  );
};
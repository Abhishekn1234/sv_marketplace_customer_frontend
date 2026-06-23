export const formatDates = (dateString?: string | Date) => {
  if (!dateString) return "Pending";

  const date = new Date(dateString);
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // ✅ include seconds ONLY when needed
  const time = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit", // 👈 ADD THIS
    hour12: true,
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
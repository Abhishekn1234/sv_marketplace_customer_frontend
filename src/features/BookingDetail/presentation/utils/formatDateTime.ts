export function formatDateTime(
  selectedDate: number | null,
  selectedTime: string
) {
  if (selectedDate === null || !selectedTime) return "";

  const date = new Date();
  date.setDate(date.getDate() + selectedDate);

  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return `${formattedDate} • ${selectedTime}`;
}
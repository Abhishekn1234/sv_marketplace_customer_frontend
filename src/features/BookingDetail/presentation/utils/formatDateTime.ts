// utils/formatDateTime.ts

export function formatDateTime(
  selectedDate: number | null,
  selectedTime: string
) {
  if (selectedDate === null || !selectedTime) {
    return "";
  }

  const date = new Date();
  date.setDate(date.getDate() + selectedDate);

  const [time, period] = selectedTime.trim().split(" ");
  const [hourString, minuteString] = time.split(":");

  let hours = Number(hourString);
  const minutes = Number(minuteString);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
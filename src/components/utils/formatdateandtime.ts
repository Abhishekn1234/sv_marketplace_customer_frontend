import { formatSmartDate } from "./formatsmartdate";

export function formatdateandtime(
  selectedDate: number | null,
  selectedTime: string
): string {
  if (selectedDate === null || !selectedTime) return "";

  const date = new Date();
  date.setDate(date.getDate() + selectedDate);

  const [time, period] = selectedTime.trim().split(" ");
  const [hour, minute] = time.split(":").map(Number);

  let hours = hour;
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  date.setHours(hours, minute, 0, 0);

  return formatSmartDate(date)
}
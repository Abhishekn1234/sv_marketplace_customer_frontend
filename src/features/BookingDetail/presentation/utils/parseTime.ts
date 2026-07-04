export function parseTime(timeString: string) {
  const [time, period] = timeString.trim().split(" ");
  const [hourString, minuteString] = time.split(":");

  let hours = Number(hourString);
  const minutes = Number(minuteString);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}
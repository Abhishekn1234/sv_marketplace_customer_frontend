export const toMinutes = (time: string) => {
  const [timePart, modifier = ""] = time.trim().split(/\s+/);
  let [hours, minutes] = timePart.split(":").map(Number);

  const period = modifier.toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};
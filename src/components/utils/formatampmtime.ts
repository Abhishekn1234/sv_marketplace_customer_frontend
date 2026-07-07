export function formatAMPMTime(date: Date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const paddedMinutes = minutes.toString().padStart(2, "0");

  return `${hours}:${paddedMinutes} ${ampm}`;
}
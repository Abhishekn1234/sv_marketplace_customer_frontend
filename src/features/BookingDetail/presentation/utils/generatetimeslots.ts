import { formatAMPMTime } from "./formatampmtime";

export function generateTimeSlots(
  startHour = 8,
  endHour = 20,
  step = 30
) {
  const slots: string[] = [];

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let min = 0; min < 60; min += step) {
      const date = new Date();
      date.setHours(hour);
      date.setMinutes(min);

      slots.push(formatAMPMTime(date));
    }
  }

  return slots;
}
import { formatAMPMTime } from "../../../../components/utils/formatampmtime";

export function generateTimeSlots(
  startHour = 8,
  endHour = 20,
  step = 30
) {
  const slots: string[] = [];
  const now = new Date();

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let min = 0; min < 60; min += step) {
      const slot = new Date();
      slot.setHours(hour, min, 0, 0);

      
      if (slot <= now) continue;

      slots.push(formatAMPMTime(slot));
    }
  }

  return slots;
}
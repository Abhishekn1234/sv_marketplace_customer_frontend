import { toMinutes } from "./istominutestimefunction";

export function getAvailableTimeSlots(
  slots: string[],
  selectedDate: number | null
) {
  // No date selected yet
  if (selectedDate === null) return slots;

  // If tomorrow or any future day, show all slots
  if (selectedDate > 0) return slots;

  // Today -> remove past slots
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return slots.filter((slot) => toMinutes(slot) >= currentMinutes);
}
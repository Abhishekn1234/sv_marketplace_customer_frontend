
import { toMinutes } from "./istominutestimefunction";

export const isDisabled = (slot: string,selectedTime:string,duration:number) => {
    if (!selectedTime) return false;
    if (slot === selectedTime) return false;

    const selectedStart = toMinutes(selectedTime);
    const selectedEnd = selectedStart + duration * 60;
    const slotStart = toMinutes(slot);

    return slotStart > selectedStart && slotStart < selectedEnd;
  };

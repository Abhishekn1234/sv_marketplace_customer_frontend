import { BookingStatus } from "../../domain/entities/bookingstatus.types";

export interface BookingCardDTO {
  id: string;
  serviceName: string;
  tierName?: string;
  professionalName?: string;
  date?: string;
  time?: string | number;
  price: string;
  status: BookingStatus;
}

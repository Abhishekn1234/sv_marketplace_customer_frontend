import type { BookingStatus } from "../../features/Bookings/domain/entities/bookingstatus.types";
import { formatText } from "@/components/utils/formattext";
export const formatStatus = (status: BookingStatus) => formatText(status);
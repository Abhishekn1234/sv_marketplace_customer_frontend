import type { BookingStatus } from "../../domain/entities/bookingstatus.types";

export const formatStatus = (status: BookingStatus) => status.replaceAll("_", " ");
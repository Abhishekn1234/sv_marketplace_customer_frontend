import type { AuthBooking } from "../../../Bookings/domain/entities/auth.booking.types";
import type { LastLocation } from "./lastlocation.types";
import type { Role } from "./role.types";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;

  address?: string;
  isVerified: boolean;
  kycStatus?: string;

  profilePictureUrl?: string;
  profilePicturePublicId?: string;

  role: Role;
  documents?: any[];
  last_location?:LastLocation;
  current_location?:LastLocation;
  bookings?:AuthBooking[];
  createdAt?: string;
  updatedAt?: string;
}


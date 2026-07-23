import { AssignedWorker } from "@/features/Bookings/domain/entities/assignedworkers.type";
import { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { Service } from "@/features/Bookings/domain/entities/service.types";

export interface Review {
  _id: string;
  bookingId: string;
  userId: string;
  workerIds: string[];
  serviceId: string;
  serviceRating: number;
  workerRating: number;
  feedback: string;
  reviewedAt: string;
  service: Service;
  booking: Booking;
  workers: AssignedWorker[];
}

export interface ReviewPagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ReviewListResponse {
  data: Review[];
  pagination: ReviewPagination;
}

export interface ReviewQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}
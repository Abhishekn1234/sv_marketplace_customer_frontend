import JobTrackingLayout from "./JobTrackingLayout";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";

interface Props {
  bookings: Booking[];
  loading: boolean;
}

export default function JobTrackingContent({ bookings, loading }: Props) {
  return <JobTrackingLayout bookings={bookings} loading={loading} />;
}
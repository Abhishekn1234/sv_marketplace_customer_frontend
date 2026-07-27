import JobTrackingLayout from "./JobTrackingLayout";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";

interface Props {
  bookings: Booking;
  loading: boolean;
  refetch: () => void;
}

export default function JobTrackingContent({
  bookings,
  loading,
  refetch,
}: Props) {
  return (
    <JobTrackingLayout
      bookings={bookings}
      loading={loading}
      refetch={refetch}
    />
  );
}
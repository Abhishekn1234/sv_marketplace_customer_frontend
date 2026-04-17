"use client";

import PageContainer from "@/components/common/PageContainer";
import JobProgressContents from "./components/JobProgressContents";
import JobProgressHeader from "./components/JobProgressHeader";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useParams } from "react-router-dom";

export default function JobProgressPage() {
  const { bookings, loading } = useBookings();
  const { bookingId } = useParams();

  console.log("Bookings:", bookings);
  console.log("BookingId:", bookingId);

  // ✅ use bookings directly
  const booking =
    bookings?.find(
      (b: any) => String(b._id) === String(bookingId)
    ) || null;

  return (
    <PageContainer>
      <JobProgressHeader />
      <JobProgressContents booking={booking} loading={loading} />
    </PageContainer>
  );
}
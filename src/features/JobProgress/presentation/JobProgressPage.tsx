"use client";

import PageContainer from "@/components/common/PageContainer";
import JobProgressContents from "./components/JobProgressContents";
import JobProgressHeader from "./components/JobProgressHeader";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useLiveBooking } from "@/features/JobTracking/presentation/hooks/useLiveBookings";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

export default function JobProgressPage() {
  const { bookings, loading } = useBookings();
  const { bookingId } = useParams();

  // 🔴 socket-enhanced bookings
  const liveBookings = useLiveBooking(bookings);

  // ✅ find booking from live state
  const booking = useMemo(() => {
    if (!liveBookings || !bookingId) return null;
    return liveBookings.find((b: any) => b._id === bookingId);
  }, [liveBookings, bookingId]);

  return (
    <PageContainer>
      <JobProgressHeader />
      <JobProgressContents booking={booking} loading={loading} />
    </PageContainer>
  );
}
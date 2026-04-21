"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/common/PageContainer";
import JobProgressContents from "./components/JobProgressContents";
import JobProgressHeader from "./components/JobProgressHeader";

import { useParams } from "react-router-dom";
import { useSocketJobProgressActivities } from "./hooks/useJobProgressSocket";
import { useBookingById } from "@/features/Bookings/presentation/hooks/useBookingById";

export default function JobProgressPage() {
  const { bookingId } = useParams();

  const {
    booking: baseBooking,
    loading:isLoading,
    
  } = useBookingById(bookingId);

  const [localBooking, setLocalBooking] = useState<any>(null);

  // sync API → local (socket merge)
  useEffect(() => {
    if (baseBooking) {
      setLocalBooking((prev: any) => {
        if (!prev) return baseBooking;

        return {
          ...baseBooking,
          activities:
            prev.activities?.length > 0
              ? prev.activities
              : baseBooking.activities,
        };
      });
    }
  }, [baseBooking]);

  // socket
  useSocketJobProgressActivities({
    bookingId,
    setLocalBooking,
  });

  const booking = localBooking ?? baseBooking;

  // loading state
  if (isLoading) {
    return (
      <PageContainer>
        <div className="text-center py-10 text-gray-500">
          Loading booking...
        </div>
      </PageContainer>
    );
  }

  // error state
  if (!booking) {
    return (
      <PageContainer>
        <div className="text-center py-10 text-red-500">
          Booking not found
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <JobProgressHeader />
      <JobProgressContents booking={booking} loading={isLoading} />
    </PageContainer>
  );
}
"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/common/PageContainer";
import JobProgressContents from "./components/JobProgressContents";
import JobProgressHeader from "./components/JobProgressHeader";

import { useParams, useNavigate } from "react-router-dom";
import { useSocketJobProgressActivities } from "./hooks/useJobProgressSocket";
import { useBookingById } from "@/features/Bookings/presentation/hooks/useBookingById";

export default function JobProgressPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const {
    booking: baseBooking,
    loading: isLoading,
  } = useBookingById(bookingId);

  const [localBooking, setLocalBooking] = useState<any>(null);

  const booking = localBooking ?? baseBooking;

  // ✅ Redirect if not found
  useEffect(() => {
    if (!isLoading && !booking) {
      navigate("/"); // change route
    }
  }, [isLoading, booking, navigate]);

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

  // ✅ Loader (better UX)
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PageContainer>
    );
  }

  // ✅ Prevent flicker before redirect
  if (!booking) return null;

  return (
    <PageContainer>
      <JobProgressHeader />
      <JobProgressContents booking={booking} loading={isLoading} />
    </PageContainer>
  );
}
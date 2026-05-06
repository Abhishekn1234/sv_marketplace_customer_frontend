"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/common/PageContainer";
import JobProgressContents from "./components/JobProgressContents";
import JobProgressHeader from "./components/JobProgressHeader";

import { useParams, useNavigate } from "react-router-dom";
import { useSocketJobProgressActivities } from "./hooks/useJobProgressSocket";
import { useBookingDetail } from "@/features/Bookings/presentation/hooks/useBookingDetail";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";

export default function JobProgressPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  // ✅ Use optimized hook for instant UI without refetching
  const {
    booking: baseBooking,
    loading: isLoading,
  } = useBookingDetail(bookingId);

  const [localBooking, setLocalBooking] = useState<any>(null);

  const booking = localBooking ?? baseBooking;

  // ✅ Redirect if not found
  useEffect(() => {
    if (!isLoading && !booking) {
      navigate("/"); // change route
    }
  }, [isLoading, booking, navigate]);

  // sync API → local (socket merge) - only merge activities
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

  // socket - for real-time activity updates
  useSocketJobProgressActivities({
    bookingId,
    setLocalBooking,
  });

  // ✅ Loader (better UX)
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center py-20">
          <CommonSpinner/>
        </div>
      </PageContainer>
    );
  }

  // ✅ Prevent flicker before redirect
  if (!booking) return null;

return (
    <PageContainer>
      <JobProgressHeader />
      {/* Pass false to prevent reloading of content after initial load */}
      <JobProgressContents booking={booking} loading={false} />
    </PageContainer>
  );
}

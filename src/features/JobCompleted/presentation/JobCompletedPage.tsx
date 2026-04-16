"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SuccessSection from "./components/Successsection";
import JobCompletedSummary from "./components/JobCompletedSummary";
import JobCompletedProvider from "./components/JobCompletedProvider";
import JobCompletedActions from "./components/JobCompletedActions";

import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";

export default function JobCompletedPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookings } = useBookings();

  const bookingId = state?.bookingId;
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    if (!bookingId) {
      navigate("/bookings");
      return;
    }

    const found = bookings?.find((b: any) => b._id === bookingId);
    if (found) setBooking(found);
  }, [bookingId, bookings]);

  if (!booking) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading completed job...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <SuccessSection />
        <JobCompletedSummary booking={booking} />
        <JobCompletedProvider booking={booking} />
        <JobCompletedActions />
      </div>
    </div>
  );
}
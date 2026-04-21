"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import SuccessSection from "./components/Successsection";
import JobCompletedSummary from "./components/JobCompletedSummary";
// import JobCompletedProvider from "./components/JobCompletedProvider";
import JobCompletedActions from "./components/JobCompletedActions";

import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { LoadingScreen } from "./components/Loadingscreen";

export default function JobCompletedPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { bookings } = useBookings();
  console.log("All bookings in JobCompletedPage:", bookings);
  const {services}=useServices();
  const bookingId = state?.bookingId;
  const [booking, setBooking] = useState<any>(null);

  useEffect(() => {
    if (!bookingId) {
      navigate("/bookings");
      return;
    }

    const found = bookings?.find((b: any) => b._id === bookingId);
    console.log("Found booking for Job Completed:", found);
    if (found) setBooking(found);

  }, [bookingId, bookings]);

  if (!booking) {
    return <LoadingScreen/>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <SuccessSection />
        <JobCompletedSummary booking={booking} />
        {/* <JobCompletedProvider booking={booking} /> */}
              <JobCompletedActions
          booking={booking}
          invoice={booking.invoice}
          services={services}
          categories={services}
        />
      </div>
    </div>
  );
}
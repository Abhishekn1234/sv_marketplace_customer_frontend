"use client";

import { useEffect, useState } from "react";
import PageContainer from "@/components/common/PageContainer";
import JobProgressContents from "./components/JobProgressContents";
import JobProgressHeader from "./components/JobProgressHeader";

import { useParams, useNavigate } from "react-router-dom";
import { useSocketJobProgressActivities } from "./hooks/useJobProgressSocket";
import { useBookingDetail } from "@/features/Bookings/presentation/hooks/useBookingDetail";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { useLanguage } from "@/features/context/LanguageContext";

export default function JobProgressPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const{isRTLOrder}=useLanguage();

  // ✅ API base data
  const { booking: baseBooking, loading: isLoading } =
    useBookingDetail(bookingId);

  // ✅ local state for socket merging
  const [localBooking, setLocalBooking] = useState<Booking | null>(null);

  const booking = localBooking ?? baseBooking;

  // =========================
  // SOCKET (REAL TIME)
  // =========================
  useSocketJobProgressActivities({
    bookingId,
    setLocalBooking,
  });

  // =========================
  // SYNC API → LOCAL (SAFE MERGE)
  // IMPORTANT: NEVER overwrite socket updates
  // =========================
  useEffect(() => {
    if (!baseBooking) return;

    setLocalBooking((prev: any) => {
      if (!prev) return baseBooking;

      return {
        ...prev, // 👈 keep socket updates
        ...baseBooking, // 👈 update API fields safely
        activities:
          prev.activities?.length > 0
            ? prev.activities
            : baseBooking.activities,
      };
    });
  }, [baseBooking]);

  // =========================
  // REDIRECT IF NOT FOUND
  // =========================
  useEffect(() => {
    if (!isLoading && baseBooking === null) {
      navigate("/bookings");
    }
  }, [isLoading, baseBooking, navigate]);

  // =========================
  // LOADING UI
  // =========================
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center py-20">
          <CommonSpinner />
        </div>
      </PageContainer>
    );
  }

  // prevent flicker before redirect
  if (!booking) return null;

  // =========================
  // UI
  // =========================
  return (
    <PageContainer>
      <div dir={`${isRTLOrder?"rtl":""}`}>
      <JobProgressHeader />

      <JobProgressContents
        booking={booking}
        loading={false}
      />
      </div>
    </PageContainer>
  );
}
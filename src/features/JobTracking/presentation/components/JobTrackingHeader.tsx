"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLanguage } from "@/features/context/LanguageContext";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";

interface Props {
  bookings: Booking[] | undefined;
}

export default function JobTrackingHeader({ bookings }: Props) {
  const { t } = useLanguage();
  const { bookingId } = useParams<{ bookingId: string }>();

  const [localBooking, setLocalBooking] = useState<Booking | undefined>();

  // -----------------------------
  // INIT FROM PROPS
  // -----------------------------
  useEffect(() => {
    if (!bookings || !bookingId) return;

    const found = bookings.find(
      (b) => String(b._id) === String(bookingId)
    );

    if (found) {
      setLocalBooking(found);
    }
  }, [bookings, bookingId]);

  if (!localBooking) return null;

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
          {t.jobtrackingpage.title}
        </h1>

        <p className="text-sm sm:text-lg text-gray-500">
          {t.jobtrackingpage.subtitle}
        </p>
      </div>
    </div>
  );
}
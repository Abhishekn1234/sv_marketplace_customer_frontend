"use client";

import { useLanguage } from "@/features/context/LanguageContext";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";

interface Props {
  booking: Booking | undefined;
}

export default function JobTrackingHeader({ booking }: Props) {
  const { t } = useLanguage();

  if (!booking) return null;

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
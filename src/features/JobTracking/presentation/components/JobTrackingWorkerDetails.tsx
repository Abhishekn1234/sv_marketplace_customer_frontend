"use client";

import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";

export default function JobTrackingWorkerDetails() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { data, isLoading } = useBookingHistory();

  const booking = useMemo(() => {
    if (!data?.pages || !bookingId) return null;

    return data.pages
      .flatMap((page) => page.data)
      .find((b) => b._id === bookingId);
  }, [data, bookingId]);

  const worker = booking?.assignedWorkers?.[0]?.worker;

  if (isLoading) return <div>Loading worker...</div>;

  if (!worker) {
    return (
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm">
        <h2 className="text-base font-bold text-gray-900">
          Your Professional
        </h2>
        <p className="text-sm text-gray-500 mt-3">
          Worker not assigned yet
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm w-full min-w-0">
      
      <h2 className="text-base font-bold text-gray-900 mb-5">
        Your Professional
      </h2>

      {/* Profile Section */}
      <div className="flex items-center gap-4 mb-5 min-w-0">
        
        {/* Image */}
        <img
          src={
            worker.profilePictureUrl ??
            "https://ui-avatars.com/api/?name=" + worker.fullName
          }
          alt={worker.fullName}
          className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 shrink-0"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">

      {/* Name + Verified */}
      <div className="flex flex-wrap items-start gap-2 font-bold text-gray-900 text-lg mb-1 min-w-0">
        
        <span className="break-words leading-tight w-full">
          {worker.fullName}
        </span>

        {worker.isVerified && (
          <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        )}
      </div>

      {/* Service Info */}
      <div className="text-sm text-gray-500 break-words leading-snug">
        {booking?.service?.name ?? "Service"} •{" "}
        {booking?.serviceTier?.displayName ?? "Tier"}
      </div>

    </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        
        <a
          href={`tel:${worker.phone}`}
          className="flex-1 h-12 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 flex items-center justify-center gap-2 min-w-0"
        >
          Call
        </a>

        <button className="flex-1 h-12 rounded-lg bg-white border border-gray-200 font-semibold text-gray-900 hover:bg-gray-50 flex items-center justify-center gap-2 min-w-0">
          Message
        </button>
      </div>
    </div>
  );
}
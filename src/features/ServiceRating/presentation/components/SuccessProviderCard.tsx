"use client";

import { useState } from "react";
import ServiceRatingSection from "./ServiceRatingsection";
import SuccessTagSection from "./SuccessTagSection";
import ServiceReviewSection from "./ServiceReviewSection";
import { useParams } from "react-router-dom";
import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";
import { useSubmitServiceReview } from "../hooks/useServiceRatingReview";

export default function SuccessProviderCard() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { data, isLoading } = useBookingHistory();

  // ✅ Hooks must always be called
  const [serviceRating, setServiceRating] = useState(4);
  const [workerRating, setWorkerRating] = useState(4);
  const [tags, setTags] = useState(
    [
      "Professional",
      "On Time",
      "Quality Work",
      "Friendly",
      "Good Communication",
      "Clean",
    ].map((label) => ({ label, selected: false }))
  );
  const [feedback, setFeedback] = useState("");

  const { mutate: submitReview } = useSubmitServiceReview();

  // Flatten bookings and find the current one
  const bookings = data?.pages?.flatMap((page) => page.data || []) || [];
  const booking = bookings.find((b) => b._id === bookingId);

  if (isLoading) return <div>Loading...</div>;
  if (!booking) return <div>Booking not found</div>;

  const handleSubmit = () => {
    submitReview({
      bookingId: bookingId || "",
      serviceRating,
      workerRating,
      feedback,
    });
  };

  return (
    <div className="bg-white rounded-4xl p-10 sm:p-8 xs:p-6 border border-gray-200 shadow-lg max-w-xl mx-auto">
      {/* Provider Section */}
      <div className="text-center mb-8 px-4 sm:px-6">
        <img
          src={booking.assignedWorkers?.[0]?.worker.profilePictureUrl || "https://via.placeholder.com/150"}
          alt={booking.assignedWorkers?.[0]?.worker.fullName || "Provider"}
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-2xl border-4 border-gray-100 object-cover mx-auto mb-4"
        />
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
          {booking.assignedWorkers?.[0]?.worker.fullName || "Provider Name"}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-500 truncate">
          {booking.service?.name || "Service Name"}
        </p>
      </div>

      {/* Rating Section */}
      <ServiceRatingSection
        serviceRating={serviceRating}
        setServiceRating={setServiceRating}
        workerRating={workerRating}
        setWorkerRating={setWorkerRating}
      />

      {/* Tag Section */}
      <SuccessTagSection tags={tags} setTags={setTags} />

      {/* Review Section */}
      <ServiceReviewSection
        feedback={feedback}
        setFeedback={setFeedback}
        onSubmit={handleSubmit}
      />
    </div>
  );
}







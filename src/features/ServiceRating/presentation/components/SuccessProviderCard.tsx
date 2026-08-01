"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ServiceRatingSection from "./ServiceRatingsection";
import SuccessTagSection from "./SuccessTagSection";
import ServiceReviewSection from "./ServiceReviewSection";

import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";
import { useSubmitServiceReview } from "../hooks/useServiceRatingReview";
import { useBookingReview } from "../hooks/useGetRating";

import { useLanguage } from "@/features/context/LanguageContext";
import { Image } from "@/components/input";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import CommonCard from "@/components/common/CommonCards";

export default function SuccessProviderCard() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { data, isLoading } = useBookingHistory();
  const { t,localize } = useLanguage();

  const { data: review, isLoading: reviewLoading } =
    useBookingReview(bookingId);

  const { mutate: submitReview } = useSubmitServiceReview();

  // ---------------- STATE
  const [serviceRating, setServiceRating] = useState(0);
  const [workerRating, setWorkerRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const [tags, setTags] = useState<{ label: string; selected: boolean }[]>(
    []
  );

  const [isEditMode, setIsEditMode] = useState(false);

  // ---------------- BOOKING
  const bookings = data?.pages?.flatMap((page) => page.data || []) || [];
  const booking = bookings.find((b) => b._id === bookingId);

  // ---------------- INIT TAGS
  useEffect(() => {
    const baseTags = [
      t.serviceratingpage.tags.professional,
      t.serviceratingpage.tags.onTime,
      t.serviceratingpage.tags.qualityWork,
      t.serviceratingpage.tags.friendly,
      t.serviceratingpage.tags.goodCommunication,
      t.serviceratingpage.tags.clean,
    ];

    setTags(baseTags.map((label) => ({ label, selected: false })));
  }, [t]);

  // ---------------- LOAD REVIEW (EDIT MODE)
  useEffect(() => {
    if (review) {
      setServiceRating(review.serviceRating ?? 0);
      setWorkerRating(review.workerRating ?? 0);
      setFeedback(review.feedback ?? "");
      setIsEditMode(true);

      // restore tags if backend provides them
      if (review.tags) {
        setTags((prev) =>
          prev.map((t) => ({
            ...t,
            selected: review.tags?.includes(t.label) || false,
          }))
        );
      }
    } else {
      setServiceRating(0);
      setWorkerRating(0);
      setFeedback("");
      setIsEditMode(false);
    }
  }, [review]);

  // ---------------- LOADING
  if (isLoading || reviewLoading) return <CommonSpinner  center/>;
  if (!booking)
    return <div>{t.serviceratingpage.bookingNotFound}</div>;

  // ---------------- SUBMIT
  const handleSubmit = () => {
    submitReview({
      bookingId: bookingId || "",
      serviceRating,
      workerRating,
      feedback,
      // tags: tags.filter((t) => t.selected).map((t) => t.label),
    });
  };

  return (
    <CommonCard className="max-w-xl mx-auto">
      {/* HEADER */}
     {/* HEADER */}
{/* HEADER */}
    <div className="text-center mb-6 sm:mb-8 px-2 sm:px-4">
      <Image
        src={
          booking.assignedWorkers?.[0]?.worker?.profilePictureUrl ||
          "https://via.placeholder.com/150"
        }
        alt={booking.assignedWorkers?.[0]?.worker?.fullName || "Provider"}
        className="rounded-2xl border-4 border-gray-100 object-cover mx-auto mb-4"
        style={{
          width: "clamp(80px, 20vw, 128px)",
          height: "clamp(80px, 20vw, 128px)",
        }}
      />
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
        {booking.assignedWorkers?.[0]?.worker?.fullName || "Provider Name"}
      </h2>
      <p className="text-sm sm:text-base text-gray-500 truncate">
        {localize(booking.service?.name) || "Service Name"}
      </p>
    </div>

      {/* MODE */}
      <div className="text-center mb-4 text-sm text-gray-500">
        {isEditMode ? t.serviceratingpage["Update your review"] : t.serviceratingpage["Rate your experience"]}
      </div>

      {/* RATINGS */}
      <ServiceRatingSection
        serviceRating={serviceRating}
        setServiceRating={setServiceRating}
        workerRating={workerRating}
        setWorkerRating={setWorkerRating}
      />

      {/* TAGS */}
      <SuccessTagSection tags={tags} setTags={setTags} />

      {/* REVIEW */}
      <ServiceReviewSection
        feedback={feedback}
        setFeedback={setFeedback}
        onSubmit={handleSubmit}
      />
    </CommonCard>
  );
}
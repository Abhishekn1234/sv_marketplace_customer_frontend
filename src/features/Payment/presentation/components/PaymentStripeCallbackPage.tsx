"use client";

import { useNavigate, useSearchParams } from "react-router-dom";

import Button from "@/components/input/Button";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";

import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useLanguage } from "@/features/context/LanguageContext";

import SuccessSection from "@/features/JobCompleted/presentation/components/Successsection";
import JobCompletedSummary from "@/features/JobCompleted/presentation/components/JobCompletedSummary";
import JobCompletedActions from "@/features/JobCompleted/presentation/components/JobCompletedActions";
import { useVerifyStripePayment } from "../hooks/useVerifyStripePayment";
 import { usePreventBackNavigation } from "@/components/common/usePreventBackNavigation";




export default function PaymentStripeCallbackPage() {
    usePreventBackNavigation();
  const navigate = useNavigate();
  const { services } = useServices();
  const { t } = useLanguage();

  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get("paymentId");
  const status = searchParams.get("status");
  const sessionId = searchParams.get("session_id");
  
  const {
    data,
    isLoading,
    error,
  } = useVerifyStripePayment(
    paymentId,
    status,
    sessionId
  );

  const booking = data?.bookingDetails;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CommonSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            {t.paymentpage.paymentFailed}
          </h2>

          <p className="text-gray-600 mb-6">
            {(error as Error).message}
          </p>

          <Button
            onClick={() => navigate("/bookings")}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white"
          >
            {t.paymentpage.goToBookings}
          </Button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CommonSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <SuccessSection />

        <JobCompletedSummary booking={booking} />

        <JobCompletedActions
          booking={booking}
          invoice={booking?.invoice}
          services={services}
          categories={services}
        />

        <div className="flex justify-center pt-4">
          <Button
            onClick={() => navigate("/bookings")}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg"
          >
            {t.paymentpage.goToBookings}
          </Button>
        </div>
      </div>
    </div>
  );
}
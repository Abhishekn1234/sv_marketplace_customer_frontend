"use client";

import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import apiClient from "@/features/api/interceptor";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";

import SuccessSection from "@/features/JobCompleted/presentation/components/Successsection";
import JobCompletedSummary from "@/features/JobCompleted/presentation/components/JobCompletedSummary";
import JobCompletedActions from "@/features/JobCompleted/presentation/components/JobCompletedActions";
import Button from "@/components/input/Button";

export default function PaymentStripeCallbackPage() {
  const navigate = useNavigate();
  const { services } = useServices();

  const [searchParams] = useSearchParams();

  const paymentId = searchParams.get("paymentId");
  const status = searchParams.get("status");
  const session_id = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState("");

  // ✅ prevents duplicate API calls (StrictMode / retry safe)
  const hasFetched = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      // 🔥 block duplicate execution
      if (hasFetched.current) return;
      hasFetched.current = true;

      try {
        setLoading(true);

        const response = await apiClient.get(
          "/booking/payment/stripe/callback",
          {
            params: {
              paymentId,
              status,
              session_id,
            },
          }
        );

        console.log("Stripe Callback Response:", response.data);

        const bookingData = response.data?.bookingDetails;

        if (!bookingData) {
          throw new Error("Booking details not found");
        }

        setBooking(bookingData);
      } catch (err: any) {
        console.error(err);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Payment verification failed"
        );
      } finally {
        setLoading(false);
      }
    };

    if (paymentId && status && session_id) {
      verifyPayment();
    } else {
      setLoading(false);
      setError("Invalid payment callback URL");
    }
  }, [paymentId, status, session_id]);

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CommonSpinner />
      </div>
    );
  }

  /* =========================
     ERROR STATE
  ========================= */
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Payment Failed
          </h2>

          <p className="text-gray-600 mb-6">{error}</p>

          <Button
            onClick={() => navigate("/bookings")}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white"
          >
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  /* =========================
     EMPTY STATE
  ========================= */
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CommonSpinner />
      </div>
    );
  }

  /* =========================
     SUCCESS UI
  ========================= */
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

        {/* optional navigation */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => navigate("/bookings")}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg"
          >
            Go to Bookings
          </Button>
        </div>
      </div>
    </div>
  );
}
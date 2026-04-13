"use client";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyPayment } from "../hooks/useVerifyPayment";
import { toast } from "react-toastify";
import { useLanguage } from "@/features/context/LanguageContext";

export default function PaymentCallbackPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const verifyPayment = useVerifyPayment();

  const { t } = useLanguage();


  const paymentId = state?.paymentId;
  const status = state?.status;
  const transactionId = state?.transactionId;
  const bookingId = state?.bookingId;

  useEffect(() => {
    if (!paymentId) {
      navigate("/bookings");
      return;
    }

    verifyPayment.mutate(
      { paymentId, status, transactionId },
      {
        onSuccess: (data) => {
          toast.success(data.message || t.paymentpage.verified);

          setTimeout(() => {
            if (bookingId) {
              navigate(`/jobtracking/${bookingId}`);
            } else {
              navigate("/bookings");
            }
          }, 1500);
        },

        onError: () => {
          toast.error(t.paymentpage.failed);

          setTimeout(() => {
            navigate("/bookings");
          }, 1500);
        },
      }
    );
  }, [paymentId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {t.paymentpage.verifying}
        </h2>

        <p className="text-gray-500 text-sm">
          {t.paymentpage.wait}
        </p>

        <div className="mt-6">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>

      </div>
    </div>
  );
}
"use client";

import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyPayment } from "../hooks/useVerifyPayment";
import { toast } from "react-toastify";
import { useLanguage } from "@/features/context/LanguageContext";

export default function PaymentCallbackPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const verifyPayment = useVerifyPayment();
  const { t } = useLanguage();

  const hasCalled = useRef(false);

  const paymentId = state?.paymentId;
  const status = state?.status;
  const transactionId = state?.transactionId;
  const bookingId = state?.bookingId; // ✅ IMPORTANT

  useEffect(() => {
    const verify = async () => {
      if (!paymentId || hasCalled.current) {
        if (!paymentId) navigate("/bookings");
        return;
      }

      hasCalled.current = true;

      try {
        await verifyPayment.mutateAsync({
          paymentId,
          status,
          transactionId,
        });

        toast.success(t.paymentpage.verified);

        setTimeout(() => {
          // 🔥 CHANGE HERE
          navigate("/jobcompleted", {
            state: { bookingId },
          });
        }, 1200);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            t.paymentpage.failed
        );

        setTimeout(() => {
          navigate("/bookings");
        }, 1200);
      }
    };

    verify();
  }, [paymentId]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-xl font-bold mb-3">
          {t.paymentpage.verifying}
        </h2>
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
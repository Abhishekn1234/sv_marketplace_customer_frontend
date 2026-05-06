"use client";

import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyPayment } from "../hooks/useVerifyPayment";
import { toast } from "react-toastify";
import { useLanguage } from "@/features/context/LanguageContext";
import { useQueryClient } from "@tanstack/react-query";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";

export default function PaymentCallbackPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const verifyPayment = useVerifyPayment();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const hasCalled = useRef(false);

  const paymentId = state?.paymentId;
  const status = state?.status;
  const transactionId = state?.transactionId;
  const bookingId = state?.bookingId;

  useEffect(() => {
    const verify = async () => {
      if (!paymentId || hasCalled.current) {
        if (!paymentId) navigate("/bookings");
        return;
      }

      hasCalled.current = true;

      try {
        // 1. VERIFY PAYMENT
        await verifyPayment.mutateAsync({
          paymentId,
          status,
          transactionId,
        });

        toast.success(t.paymentpage.verified);

        // 2. UPDATE CACHE FIRST
        queryClient.setQueryData(["bookings"], (old: any) => {
          if (!Array.isArray(old)) return old;

          return old.map((b: any) =>
            b._id === bookingId
              ? {
                  ...b,
                  paymentStatus: "PAID",
                  status: "COMPLETED",
                }
              : b
          );
        });

        // 3. FORCE REFRESH BOOKINGS (VERY IMPORTANT FIX)
        queryClient.invalidateQueries({ queryKey: ["bookings"] });

        // 4. NAVIGATE
        setTimeout(() => {
          navigate("/jobcompleted", {
            state: {
              bookingId,
              paymentDone: true,
            },
          });
        }, 800);
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
  }, [paymentId, status, transactionId, bookingId, navigate, verifyPayment, queryClient, t]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-xl font-bold mb-3">
          {t.paymentpage.verifying}
        </h2>
      <CommonSpinner size={30} />
      </div>
    </div>
  );
}
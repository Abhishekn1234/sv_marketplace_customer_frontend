"use client";

import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import CommonSpinner from "@/components/common/CommonLoadingSpinner";

import { useVerifyPayment } from "../hooks/useVerifyPayment";
import { useLanguage } from "@/features/context/LanguageContext";
import type { PaymentStatus } from "../../domain/entities/paymentstatus";

export default function PaymentCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const verifyPayment = useVerifyPayment();

  const { t } = useLanguage();

  const called = useRef(false);

useEffect(() => {
  const verify = async () => {
    if (called.current) return;
    called.current = true;

    const params = new URLSearchParams(location.search);

    const stateData = (location.state ?? {}) as {
      paymentId?: string;
      transactionId?: string;
      bookingId?: string;
      status?: PaymentStatus;
    };

    console.log("location.state =", stateData);
    console.log("location.search =", location.search);

    const paymentId =
      stateData.paymentId ||
      params.get("paymentId") ||
      "";

    const transactionId =
      stateData.transactionId ||
      params.get("session_id") ||
      paymentId;

    const bookingId =
      stateData.bookingId ||
      params.get("bookingId") ||
      "";

    const rawStatus =
      stateData.status ||
      params.get("status");

    const status: PaymentStatus =
      rawStatus === "SUCCESS" ||
      rawStatus === "PAID" ||
      rawStatus === "COMPLETED"
        ? "SUCCESS"
        : rawStatus === "FAILED"
        ? "FAILED"
        : "PENDING";

    if (!paymentId) {
      navigate("/bookings", { replace: true });
      return;
    }

    try {
      const response = await verifyPayment.mutateAsync({
        paymentId,
        transactionId,
        // bookingId,
        status,
      });

      console.log("VERIFY SUCCESS:", response);

      toast.success(t.paymentpage.verified);

      navigate("/jobcompleted", {
        replace: true,
        state: {
          bookingId,
          paymentDone: true,
        },
      });
    } catch (error: any) {
      console.error("VERIFY ERROR:", error);
      console.error("VERIFY ERROR RESPONSE:", error?.response?.data);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t.paymentpage.failed
      );

      navigate("/bookings", { replace: true });
    }
  };

  verify();
}, [
  location.search,
  location.state,
  navigate,
  verifyPayment,
  t,
]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-50">
      <div className="bg-white shadow-xl rounded-3xl p-10 text-center w-full max-w-md">
        <CommonSpinner size={40} />

        <h2 className="text-2xl font-bold mt-5">
         {t.common["Verifying Payment"]}
        </h2>

        <p className="text-gray-500 mt-2">
          {t.common["Please wait while we confirm your payment."]}
        </p>
      </div>
    </div>
  );
}
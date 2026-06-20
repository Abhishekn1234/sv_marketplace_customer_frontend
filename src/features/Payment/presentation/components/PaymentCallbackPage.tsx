"use client";

import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import CommonSpinner from "@/components/common/CommonLoadingSpinner";

import { useVerifyPayment } from "../hooks/useVerifyPayment";
import { useLanguage } from "@/features/context/LanguageContext";
import type { PaymentStatus } from "../../domain/entities/paymentstatus";

export default function PaymentCallbackPage() {
const navigate = useNavigate();
const location = useLocation();

const queryClient = useQueryClient();
const verifyPayment = useVerifyPayment();

const { t } = useLanguage();

const called = useRef(false);

useEffect(() => {
const verify = async () => {
if (called.current) return;


  called.current = true;

  const params = new URLSearchParams(location.search);

  const paymentId = params.get("paymentId");
  const sessionId = params.get("session_id");
const rawStatus = params.get("status");

const status: PaymentStatus =
  rawStatus === "SUCCESS"
    ? "SUCCESS"
    : rawStatus === "FAILED"
    ? "FAILED"
    : "PENDING";
  const bookingId = params.get("bookingId");

  if (!paymentId) {
    navigate("/bookings");
    return;
  }

  try {
    await verifyPayment.mutateAsync({
      paymentId,
      transactionId: sessionId || paymentId,
      status,
    });

    queryClient.invalidateQueries({
      queryKey: ["bookings"],
    });

    toast.success(t.paymentpage.verified);

    setTimeout(() => {
      navigate("/jobcompleted", {

        state: {
          bookingId,
          paymentDone: true,
        },
      });
    }, 1000);
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        t.paymentpage.failed
    );

    setTimeout(() => {
      navigate("/bookings");
    }, 1500);
  }
};

verify();


}, [
location.search,
navigate,
queryClient,
verifyPayment,
t,
]);

return ( <div className="min-h-screen flex justify-center items-center bg-slate-50"> <div className="bg-white shadow-xl rounded-3xl p-10 text-center w-full max-w-md">


    <CommonSpinner size={40} />

    <h2 className="text-2xl font-bold mt-5">
      Verifying Payment
    </h2>

    <p className="text-gray-500 mt-2">
      Please wait while we confirm your payment.
    </p>
  </div>
</div>


);
}

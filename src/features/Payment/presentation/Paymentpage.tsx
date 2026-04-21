"use client";


import { useState } from "react";
import { useBookingPayment } from "./hooks/useBookingPayment";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetPaymentGateway } from "./hooks/useGetPaymentGateway";
import type { PaymentMethod } from "../domain/entities/intiatepayment";
import { normalizeGateways } from "./utils/normalizedGateways";
import { getIcon } from "./utils/getpaymentgatewayicon";
import { getDisplayName } from "./utils/getDisplayNamepaymentgateways";
import { useLanguage } from "@/features/context/LanguageContext";

export default function PaymentPage() {
  const [method, setMethod] = useState<string>("");
 const {t}=useLanguage();
  const { mutate, isPending } = useBookingPayment();
  const { data: gateways, isLoading } = useGetPaymentGateway();

  const { state } = useLocation();
  const navigate = useNavigate();

  // ✅ Safe extraction
  const bookingId = state?.bookingId ?? "";
  const serviceName = state?.serviceName ?? "Service";
  const price = Number(state?.price ?? 0);
  const currency = state?.currency ?? "₹";

  // ✅ Prevent crash if accessed directly
  if (!bookingId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={() => navigate("/bookings")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
         {t.paymentpage.goToBookings}
        </button>
      </div>
    );
  }

  const handlePayment = () => {
    if (!method) {
      toast.error("Please select a payment method");
      return;
    }

    mutate(
      {
        bookingId,
        paymentMethod: method as PaymentMethod,
      },
      {
        onSuccess: (data) => {
         
         

          
          toast.success("Payment Initiated");

          navigate("/payment/callback", {
            state: {
              paymentId: data.paymentId,
              status: "SUCCESS",
              transactionId: data.paymentId,
              bookingId,
            },
          });
        },
        onError: () => {
          toast.error("Payment Failed");
        },
      }
    );
  };
  const normalized = normalizeGateways(gateways ?? []);
  return (
    <div className="min-h-screen flex items-center justify-center px-4 ">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
         {t.paymentpage.title}
        </h2>

        {/* Service Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {serviceName}
          </h3>
          <p className="text-gray-500">{t.paymentpage.bookingId}: {bookingId}</p>
          <p className="mt-2 text-xl font-bold text-gray-900">
            {currency} {price.toFixed(2)}
          </p>
        </div>

        {/* Payment Method */}
        <p className="text-sm text-gray-500 mb-3 text-center font-medium">
          {t.paymentpage.selectMethod}
        </p>

        {/* Dynamic Methods */}
    <div className="grid grid-cols-3 gap-4 mb-6">
  {isLoading ? (
    <p className="col-span-3 text-center text-sm text-gray-500">
     {t.paymentpage.loading}
    </p>
  ) : normalized.length ? (
    normalized.map((gateway) => {
      const isSelected = method === gateway.type;

      return (
        <button
          key={gateway.id}
          onClick={() => setMethod(gateway.type)}
          className={`border rounded-xl p-4 flex flex-col items-center gap-2 transition
            ${
              isSelected
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
        >
          {getIcon(gateway.type)}

          <span className="text-sm font-semibold">
            {getDisplayName(gateway.type)}
          </span>
        </button>
      );
    })
  ) : (
    <p className="col-span-3 text-center text-sm text-red-500">
      {t.paymentpage.noMethods}
    </p>
  )}
</div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={isPending}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-300"
        >
          {isPending
            ? t.paymentpage.processing
            : method === "CASH"
            ? `${t.paymentpage.confirmCash} (${currency} ${price.toFixed(2)})`
            : `${t.paymentpage.pay} ${currency} ${price.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "@/components/input/Button";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";

import { useBookingPayment } from "./hooks/useBookingPayment";
import { useGetPaymentGateway } from "./hooks/useGetPaymentGateway";

import { normalizeGateways } from "./utils/normalizedGateways";
import { getDisplayName } from "./utils/getDisplayNamepaymentgateways";
import { getIcon } from "./utils/getpaymentgatewayicon";

import { useLanguage } from "@/features/context/LanguageContext";

export default function PaymentPage() {
const [method, setMethod] = useState("");

const { t } = useLanguage();
const navigate = useNavigate();
const { state } = useLocation();

const { mutate, isPending } = useBookingPayment();
const { data: gateways, isLoading } = useGetPaymentGateway();

const bookingId = state?.bookingId ?? "";
const serviceName = state?.serviceName ?? "Service";
const price = Number(state?.price ?? 0);
const currency = state?.currency ?? "SAR";

const normalized = normalizeGateways(gateways ?? []);

if (!bookingId) {
return ( <div className="flex justify-center items-center h-screen">
<Button
onClick={() => navigate("/bookings")}
className="px-6 py-3"
>
{t.paymentpage.goToBookings} </Button> </div>
);
}

const handlePayment = () => {
if (!method) {
toast.error("Please select payment method");
return;
}


mutate(
  {
    bookingId,
    paymentMethod: method as any,
  },
  {
    onSuccess: (data) => {
      if (method === "CASH") {
        navigate("/payment/callback", {
          state: {
            paymentId: data.paymentId,
            transactionId: data.paymentId,
            bookingId,
            status: "SUCCESS",
          },
        });

        return;
      }

      if (data.paymentUrl) {
        toast.success("Redirecting to secure payment...");
        window.location.href = data.paymentUrl;
        return;
      }

      toast.error("Payment URL not found");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Payment failed"
      );
    },
  }
);


};

return ( <div className="min-h-screen bg-slate-50 flex justify-center items-center px-4 py-10"> <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden">


    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
      <h1 className="text-3xl font-bold">
        Complete Payment
      </h1>

      <p className="mt-2 opacity-90">
        Secure booking payment
      </p>
    </div>

    <div className="p-8">

      <div className="bg-gray-50 border rounded-2xl p-5 mb-8">
        <h2 className="font-semibold text-lg">
          {serviceName}
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Booking ID: {bookingId}
        </p>

        <div className="mt-4">
          <span className="text-3xl font-bold">
            {currency} {price.toFixed(2)}
          </span>
        </div>
      </div>

      <h3 className="font-semibold text-lg mb-4">
        Select Payment Method
      </h3>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <CommonSpinner size={40} />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {normalized.map((gateway) => {
            const selected = method === gateway.type;

            return (
              <button
                key={gateway.id}
                onClick={() => setMethod(gateway.type)}
                className={`
                border-2 rounded-2xl p-5
                transition-all duration-200
                flex flex-col items-center gap-3

                ${
                  selected
                    ? "border-blue-600 bg-blue-50 scale-105"
                    : "border-gray-200 hover:border-blue-300"
                }
              `}
              >
                <div className="text-4xl">
                  {getIcon(gateway.type)}
                </div>

                <span className="font-medium">
                  {getDisplayName(gateway.type)}
                </span>

                {selected && (
                  <span className="text-xs text-blue-600 font-semibold">
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <Button
        disabled={!method || isPending}
        onClick={handlePayment}
        className="
        w-full
        py-4
        text-lg
        font-semibold
        rounded-2xl
        bg-blue-600
        hover:bg-blue-700
        text-white
      "
      >
        {isPending ? (
          "Processing..."
        ) : (
          `Pay ${currency} ${price.toFixed(2)}`
        )}
      </Button>
    </div>
  </div>
</div>


);
}

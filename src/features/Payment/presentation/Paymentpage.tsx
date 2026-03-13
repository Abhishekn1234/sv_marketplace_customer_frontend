"use client";

import { X, CreditCard, Smartphone } from "lucide-react";
import { useState } from "react";
import { useBookingPayment } from "./hooks/useBookingPayment";
import { toast } from "react-toastify";

interface Props {
  bookingId: string;
  isOpen: boolean;
  onClose: () => void;
  serviceName: string;
  price: number;
  currency: string;
}

export default function PaymentModal({ bookingId, isOpen, onClose, serviceName, price, currency }: Props) {
  const [method, setMethod] = useState<"CARD" | "UPI">("CARD");
  const { mutate, isPending } = useBookingPayment();

  if (!isOpen) return null;

  const handlePayment = () => {
    mutate(
      {
        bookingId,
        paymentMethod: method,
      },
      {
        onSuccess: () => {
          toast.success("Payment Successful");
          onClose();
        },
        onError: () => {
          toast.error("Payment Failed");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 sm:p-8 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Complete Payment
        </h2>

        {/* Service & Price */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{serviceName}</h3>
          <p className="text-gray-500">Booking ID: {bookingId}</p>
          <p className="mt-2 text-xl font-bold text-gray-900">
            {currency} {price.toFixed(2)}
          </p>
        </div>

        {/* Payment Method Selection */}
        <p className="text-sm text-gray-500 mb-3 text-center font-medium">
          Select Payment Method
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Card */}
          <button
            onClick={() => setMethod("CARD")}
            className={`border rounded-xl p-4 flex flex-col items-center gap-2 transition
            ${method === "CARD"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
              }`}
          >
            <CreditCard size={28} />
            <span className="text-sm font-semibold">Card</span>
          </button>

          {/* UPI */}
          <button
            onClick={() => setMethod("UPI")}
            className={`border rounded-xl p-4 flex flex-col items-center gap-2 transition
            ${method === "UPI"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
              }`}
          >
            <Smartphone size={28} />
            <span className="text-sm font-semibold">UPI</span>
          </button>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={isPending}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-300"
        >
          {isPending ? "Processing..." : `Pay ${currency} ${price.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
}

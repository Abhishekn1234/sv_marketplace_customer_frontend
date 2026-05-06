"use client";

import  CommonCard  from "@/components/common/CommonCards";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";
import type { BookingHistory } from "../../domain/entities/bookinghistory.types";
import type { BookingStatus } from "../../domain/entities/bookingstatus.types";
import { getBookingButtonConfig } from "../helpers/bookingstatusbuttonmap";
import { formatStatus } from "../helpers/formatstatusmap";
import { statusStyles } from "../helpers/statusmap";
import { BookingActions } from "./BookingHistoryActions";
import { formatBookingDuration } from "../helpers/formatduration";
import type { PaymentCallback } from "@/features/Payment/domain/entities/paymentcallback";
import { useServices } from "../hooks/useServices";


interface BookingCardProps {
  booking: BookingHistory;
  onViewDetails: (booking: BookingHistory) => void;
  onPayNow: (bookingId: string) => void;
  onGenerateStartOtp: (bookingId: string) => void;
  onGenerateCompletedOtp: (bookingId: string) => void;
  onInvoiceClick: (booking: BookingHistory) => void;
  onVerifyPayment: (data:PaymentCallback) => void;

}

export default function BookingCard({
  booking,
  onViewDetails,
  // onPayNow,
  onGenerateStartOtp,
  onGenerateCompletedOtp,
  onInvoiceClick,
  onVerifyPayment,

}: BookingCardProps) {
  const navigate = useNavigate();
  const { label, clickable } = getBookingButtonConfig(booking);
  const {services}=useServices();
  console.log(booking);
  const handleActionButtonClick = () => {
    if (!clickable) return;
    
    switch (booking.status) {
      case "IN_PROGRESS":
      case "REQUESTED":
        navigate(`/jobtracking/${booking._id}`);
        break;
      case "INVOICE_GENERATED":
        onInvoiceClick(booking);
        break;
      case "WORKER_ACCEPTED":
        onGenerateStartOtp(booking._id);
        break;
      case "WORK_COMPLETED_PENDING":
        onGenerateCompletedOtp(booking._id);
        break;
          case "PAYMENT_PENDING":
        if (booking?.paymentId) {
          onVerifyPayment({
            paymentId: booking.paymentId,
            status: "SUCCESS", 
            transactionId: booking.paymentId, 
          });
        }
        break;
      case "PAID":
        navigate(`/servicerating/${booking._id}`);
        break;
      default:
        break;
    }
  };

  return (
    <CommonCard className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-xl flex items-center justify-center">
            <Home className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
          </div>
          <div className="min-w-0">
            <h3 className="text-[15px] sm:text-[16px] font-semibold text-gray-900 truncate">
              {booking.service?.name ?? "Service Name"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 break-words leading-tight">
              {booking.serviceTier?.displayName ?? "Tier"} •{" "}
              {booking.assignedWorkers?.[0]?.worker?.fullName ?? "Not assigned"}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${
            statusStyles[booking.status as BookingStatus]
          }`}
        >
          {formatStatus(booking.status as BookingStatus)}
        </span>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl mb-5">
        <div>
          <span className="text-xs text-gray-500">Date</span>
          <p className="text-sm sm:text-base font-semibold">
            {formatDates(booking.schedule?.startDateTime)}
          </p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Duration</span>
           <p className="text-sm sm:text-base font-semibold">
            {formatBookingDuration(booking)}
           </p>
        </div>
        <div>
          <span className="text-xs text-gray-500">Booking ID</span>
          {/* <p className="text-sm sm:text-base font-semibold truncate">{booking._id}</p> */}
          <p className="text-sm sm:text-base font-semibold truncate">{booking.bookingCode}</p>
        </div>
      </div>

      {/* Buttons */}
      <BookingActions
        booking={booking}
        label={label}
        clickable={clickable}
        onActionClick={handleActionButtonClick}
        onViewDetails={() => onViewDetails(booking)}
     onPayNow={() => {
  const finalPrice = booking?.totalCost;
 const serviceName =
  services.find(s => s._id === booking.serviceId)?.name || "Service";
  navigate("/payment", {
    state: {
      bookingId: booking._id,
      serviceName: serviceName,
      price: Number(finalPrice).toFixed(2),
      currency: booking.currency ?? "₹",
    },
  });
}}
        onCheckProgress={() => navigate(`/jobprogress/${booking._id}`)}
        onInvoiceClick={() => onInvoiceClick(booking)}
         navigatetodispute={(booking) => navigate(`/dispute/${booking._id}`)}
      />
    </CommonCard>
  );
}


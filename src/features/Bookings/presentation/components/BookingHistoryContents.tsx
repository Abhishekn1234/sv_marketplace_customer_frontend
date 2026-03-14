"use client";

import { CommandCard } from "@/components/common/CommonCards";
import { Home } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";
import type { BookingHistory } from "../../domain/entities/bookinghistory.types";
import type { BookingStatus } from "../../domain/entities/bookingstatus.types";

import { useBookingHistory } from "../hooks/useBookingHistory";
import { getBookingButtonConfig } from "../helpers/bookingstatusbuttonmap";
import { formatStatus } from "../helpers/formatstatusmap";
import { tabStatusMap } from "../helpers/tabstatusmap";
import { statusStyles } from "../helpers/statusmap";

import BookingHistoryViewDetailsModal from "./BookingHistoryViewDetailsModal";
import PaymentModal from "@/features/Payment/presentation/Paymentpage";
import { useGenerateOtp } from "@/features/Generateotp/presentation/hooks/useGenerateOtp";
import { useGenerateOtpComplete } from "@/features/Generateotp/presentation/hooks/useGenerateOtpComplete";
import { useVerifyPayment } from "@/features/Payment/presentation/hooks/useVerifyPayment";

interface Props {
  activeTab: string;
}

export default function BookingHistoryContents({ activeTab }: Props) {
  const navigate = useNavigate();

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useBookingHistory({ limit: 10 });
  const allBookings = data?.pages.flatMap(page => page.data) ?? [];

  const filteredBookings = allBookings.filter(
    b => activeTab === "All" || tabStatusMap[activeTab]?.includes(b.status as BookingStatus)
  );

  const [selectedBooking, setSelectedBooking] = useState<BookingHistory | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [paymentBookingId, setPaymentBookingId] = useState<string>("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpData, setOtpData] = useState<string | number>();
  const [otpPurpose, setOtpPurpose] = useState<string>("");

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const generateOtpMutation = useGenerateOtp();
  const generateCompletedOtpMutation = useGenerateOtpComplete();
  const verifyPaymentMutation = useVerifyPayment();

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) fetchNextPage();
    }, { rootMargin: "200px" });

    observer.observe(loadMoreRef.current);
    return () => { if (loadMoreRef.current) observer.unobserve(loadMoreRef.current); };
  }, [fetchNextPage, hasNextPage]);

  const handleGenerateStartOtp = (bookingId: string) => {
    generateOtpMutation.mutate({ bookingId, purpose: "WORK_START" }, {
      onSuccess: (data) => {
        setOtpData(data?.otp ?? "");
        setOtpPurpose("Work Start OTP");
        setOtpModalOpen(true);
      },
      onError: () => toast.error("Failed to generate Work Start OTP"),
    });
  };

  const handleGenerateCompletedOtp = (bookingId: string) => {
    generateCompletedOtpMutation.mutate({ bookingId, purpose: "WORK_COMPLETE" }, {
      onSuccess: (data) => {
        setOtpData(data?.otp ?? "");
        setOtpPurpose("Work Completed OTP");
        setOtpModalOpen(true);
      },
      onError: () => toast.error("Failed to generate Completed Work OTP"),
    });
  };

  if (isLoading) return <div className="text-center py-16 text-gray-400 text-sm sm:text-base">Loading bookings...</div>;
  if (isError) return <div className="text-center py-16 text-red-500 text-sm sm:text-base">Failed to load bookings.</div>;
  if (!filteredBookings.length) return <div className="text-center py-16 text-gray-400 text-sm sm:text-base">No bookings found.</div>;

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {filteredBookings.map(booking => {
        const { label, clickable } = getBookingButtonConfig(booking);

        return (
          <CommandCard key={booking._id} className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[15px] sm:text-[16px] font-semibold text-gray-900 truncate">{booking.service?.name ?? "Service Name"}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 break-words leading-tight">
                    {booking.serviceTier?.displayName ?? "Tier"} • {booking.assignedWorkers?.[0]?.worker?.fullName ?? "Not assigned"}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${statusStyles[booking.status as BookingStatus]}`}>
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
                  {booking.schedule
                    ? booking.pricingMode === "HOURLY"
                      ? `${booking.schedule.estimatedHours ?? "-"} hrs`
                      : `${booking.schedule.estimatedDays ?? "-"} days`
                    : "-"}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Booking ID</span>
                <p className="text-sm sm:text-base font-semibold truncate">{booking._id}</p>
              </div>
            </div>

            {/* Footer Buttons: Only 2 buttons */}
          {/* Footer Buttons: Only 2 buttons, aligned right */}
<div className="flex flex-col sm:flex-row justify-end items-center gap-2 w-full sm:w-auto">
  {/* Main Button */}
  <button
    onClick={() => {
      if (!clickable) return;

      switch (booking.status) {
        case "IN_PROGRESS":
        case "REQUESTED":
          navigate(`/jobtracking/${booking._id}`);
          break;
        case "INVOICE_GENERATED":
          navigate(`/invoice/${booking._id}`);
          break;
        case "WORKER_ACCEPTED":
          handleGenerateStartOtp(booking._id);
          break;
        case "WORK_COMPLETED_PENDING":
          handleGenerateCompletedOtp(booking._id);
          break;
        case "PAYMENT_PENDING":
          if (booking.paymentId) {
            verifyPaymentMutation.mutate(booking.paymentId, {
              onSuccess: () => {
                toast.success("Payment verified!");
              },
            });
          }
          break;
        case "PAID":
          navigate(`/servicerating/${booking._id}`);
          break;
        default:
          break;
      }
    }}
    className={`px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 transition ${!clickable ? "cursor-not-allowed opacity-60" : ""}`}
    disabled={!clickable}
  >
    {label}
  </button>

  {/* Secondary Button */}
  <button
    onClick={() => {
      if (booking.status === "COMPLETED" && !booking.invoiceId) {
        setPaymentBookingId(booking._id);
        setPaymentModalOpen(true);
      } else {
        setSelectedBooking(booking);
        setModalOpen(true);
      }
    }}
    className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
  >
    {booking.status === "COMPLETED" && !booking.invoiceId ? "Pay Now" : "View Details"}
  </button>
</div>
          </CommandCard>
        );
      })}

      <div ref={loadMoreRef} className="h-1"></div>
      {isFetchingNextPage && <div className="text-center py-4 text-gray-500 text-sm">Loading more...</div>}

      {/* Modals */}
      <BookingHistoryViewDetailsModal
        booking={selectedBooking}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {paymentBookingId && (() => {
        const booking = allBookings.find(b => b._id === paymentBookingId);
        if (!booking) return null;
        return (
          <PaymentModal
            bookingId={booking._id}
            serviceName={booking.service?.name ?? "Service Name"}
            price={booking.amount}
            currency={booking.currency}
            isOpen={paymentModalOpen}
            onClose={() => setPaymentModalOpen(false)}
          />
        );
      })()}

      {otpModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">{otpPurpose}</h2>
            <p className="text-xl sm:text-2xl font-mono text-center mb-6 tracking-widest">{otpData ?? "No OTP returned"}</p>
            <button
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setOtpModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
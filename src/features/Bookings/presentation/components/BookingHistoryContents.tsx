"use client";

import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

import { useBookingHistory } from "../hooks/useBookingHistory";
import { useServiceCategory } from "../hooks/useServiceCategory";
import { useGenerateOtp } from "@/features/Generateotp/presentation/hooks/useGenerateOtp";
import { useGenerateOtpComplete } from "@/features/Generateotp/presentation/hooks/useGenerateOtpComplete";
import { useVerifyPayment } from "@/features/Payment/presentation/hooks/useVerifyPayment";
import { useGenerateInvoice } from "@/features/Generateotp/presentation/hooks/useGenerateInvoice";

import BookingCard from "./BookingHistoryCards";
import BookingModals from "./BookingHistoryModals";

import { tabStatusMap } from "../helpers/tabstatusmap";
import type { BookingHistory } from "../../domain/entities/bookinghistory.types";
import type { BookingStatus } from "../../domain/entities/bookingstatus.types";
import type { PaymentCallback } from "@/features/Payment/domain/entities/paymentcallback";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  activeTab: string;
}

export default function BookingHistoryContents({ activeTab }: Props) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const queryClient = useQueryClient();

  // ----------------------------
  // BOOKINGS
  // ----------------------------
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBookingHistory({ limit: 10 });

  const allBookings =
    data?.pages.flatMap((page) => page.data) ?? [];

  const filteredBookings = allBookings.filter(
    (b) =>
      activeTab === "All" ||
      tabStatusMap[activeTab]?.includes(b.status as BookingStatus)
  );

  // ----------------------------
  // MODAL STATES
  // ----------------------------
  const [selectedBooking, setSelectedBooking] = useState<BookingHistory | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [paymentBookingId, setPaymentBookingId] = useState<string>("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpData, setOtpData] = useState<string | number>();
  const [otpPurpose, setOtpPurpose] = useState<string>("");

  // ----------------------------
  // HOOKS
  // ----------------------------
  const generateOtpMutation = useGenerateOtp();
  const generateCompletedOtpMutation = useGenerateOtpComplete();
  const verifyPaymentMutation = useVerifyPayment();

  const { data: categoriesData } = useServiceCategory();

  // 🔥 FIX: invoice is fetched using selected booking id
  const { data: selectedInvoice } = useGenerateInvoice(
    selectedBooking?._id
  );

  // ----------------------------
  // DERIVED DATA
  // ----------------------------
  const categories = categoriesData ?? [];
  const allServices = categories.flatMap((cat: any) => cat.services ?? []);
  const allServiceTiers = allServices.flatMap(
    (s: any) =>
      s.pricingTiers?.map((tier: any) => tier.tier) ?? []
  );

  // ----------------------------
  // INFINITE SCROLL
  // ----------------------------
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPage();
    });

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage]);

  // ----------------------------
  // HANDLERS
  // ----------------------------
  const handleGenerateStartOtp = (bookingId: string) => {
    generateOtpMutation.mutate(
      { bookingId, purpose: "WORK_START" },
      {
        onSuccess: (data) => {
          setOtpData(data?.otp ?? "");
          setOtpPurpose("Work Start OTP");
          setOtpModalOpen(true);
        },
        onError: () => toast.error("Failed to generate Work Start OTP"),
      }
    );
  };

  const handleGenerateCompletedOtp = (bookingId: string) => {
    generateCompletedOtpMutation.mutate(
      { bookingId, purpose: "WORK_COMPLETE" },
      {
        onSuccess: (data) => {
          setOtpData(data?.otp ?? "");
          setOtpPurpose("Work Completed OTP");
          setOtpModalOpen(true);
        },
        onError: () => toast.error("Failed to generate Completed Work OTP"),
      }
    );
  };

const handleVerifyPayment = (data: PaymentCallback) => {
  verifyPaymentMutation.mutate(data, {
    onSuccess: () => {
      toast.success("Payment verified!");

      // 🔥 UPDATE UI instantly
     queryClient.setQueryData(["bookings"], (old: any) => {
  return {
    ...old,
    pages: old.pages.map((page: any) => ({
      ...page,
      data: page.data.map((b: BookingHistory) =>
        b.paymentId === data.paymentId
          ? { ...b, status: "PAID" }
          : b
      ),
    })),
  };
});
    },
    onError: () => toast.error("Payment verification failed"),
  });
};

  // ----------------------------
  // INVOICE CLICK (FIXED)
  // ----------------------------
  const handleInvoiceClick = (booking: BookingHistory) => {
    if (!booking?._id) {
      toast.error("Booking ID missing");
      return;
    }

    setSelectedBooking(booking);
    setInvoiceModalOpen(true);
  };

  // ----------------------------
  // LOADING STATES
  // ----------------------------
  if (isLoading) {
    return (
      <div className="text-center py-16 text-gray-400">
        Loading bookings...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-red-500">
        Failed to load bookings.
      </div>
    );
  }

  if (!filteredBookings.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        No bookings found.
      </div>
    );
  }

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {filteredBookings.map((booking) => (
        <BookingCard
          key={booking._id}
          booking={booking}
          onViewDetails={(b) => {
            setSelectedBooking(b);
            setModalOpen(true);
          }}
          onPayNow={(bookingId) => {
            setPaymentBookingId(bookingId);
            setPaymentModalOpen(true);
          }}
          onGenerateStartOtp={handleGenerateStartOtp}
          onGenerateCompletedOtp={handleGenerateCompletedOtp}
          onInvoiceClick={handleInvoiceClick}
          onVerifyPayment={handleVerifyPayment}
        />
      ))}

      {/* infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-1" />

      {isFetchingNextPage && (
        <div className="text-center py-4 text-gray-500">
          Loading more...
        </div>
      )}

      {/* MODALS */}
      <BookingModals
        selectedBooking={selectedBooking}
        modalOpen={modalOpen}
        onCloseModal={() => setModalOpen(false)}
        paymentBookingId={paymentBookingId}
        paymentModalOpen={paymentModalOpen}
        onClosePaymentModal={() => setPaymentModalOpen(false)}
        invoiceModalOpen={invoiceModalOpen}
        onCloseInvoiceModal={() => setInvoiceModalOpen(false)}
        selectedInvoice={selectedInvoice}
        selectedBookingForInvoice={selectedBooking}
        otpModalOpen={otpModalOpen}
        onCloseOtpModal={() => setOtpModalOpen(false)}
        otpData={otpData}
        otpPurpose={otpPurpose}
        allBookings={allBookings}
        services={allServices}
        categories={categories}
        serviceTiers={allServiceTiers}
      />
    </div>
  );
}
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

interface Props {
  activeTab: string;
}

export default function BookingHistoryContents({ activeTab }: Props) {
 
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Booking data
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = 
    useBookingHistory({ limit: 10 });
  const allBookings = data?.pages.flatMap(page => page.data) ?? [];
  
  const filteredBookings = allBookings.filter(
    b => activeTab === "All" || tabStatusMap[activeTab]?.includes(b.status as BookingStatus)
  );

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<BookingHistory | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  
  const [paymentBookingId, setPaymentBookingId] = useState<string>("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpData, setOtpData] = useState<string | number>();
  const [otpPurpose, setOtpPurpose] = useState<string>("");

  // Hooks
  const generateOtpMutation = useGenerateOtp();
  const generateCompletedOtpMutation = useGenerateOtpComplete();
  const verifyPaymentMutation = useVerifyPayment();
  const { data: categoriesData } = useServiceCategory();


  // Derived data
  const categories = categoriesData ?? [];
  const allServices = categories.flatMap((cat: any) => cat.services ?? []);
  const allServiceTiers = allServices.flatMap(
    (s: any) => s.pricingTiers?.map((tier: any) => tier.tier) ?? []
  );

  // Infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [fetchNextPage, hasNextPage]);

  // Handlers
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

  const handleVerifyPayment = (paymentId: string) => {
    verifyPaymentMutation.mutate(paymentId, {
      onSuccess: () => toast.success("Payment verified!"),
    });
  };

  const generateInvoice = useGenerateInvoice();
  const handleInvoiceClick = (booking: BookingHistory) => {
  if (!booking._id) return toast.error("Booking ID missing");

  setSelectedBooking(booking);

  generateInvoice.mutate(booking._id, {
    onSuccess: (data) => {
      console.log("✅ Invoice:", data);

      setSelectedInvoice(data);
      setInvoiceModalOpen(true);
    },
    onError: (err) => {
      console.error(err);
      toast.error("Failed to fetch invoice ❌");
    },
  });
};

  // Render states
  if (isLoading) {
    return <div className="text-center py-16 text-gray-400 text-sm sm:text-base">Loading bookings...</div>;
  }

  if (isError) {
    return <div className="text-center py-16 text-red-500 text-sm sm:text-base">Failed to load bookings.</div>;
  }

  if (!filteredBookings.length) {
    return <div className="text-center py-16 text-gray-400 text-sm sm:text-base">No bookings found.</div>;
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {filteredBookings.map(booking => (
        <BookingCard
          key={booking._id}
          booking={booking}
          onViewDetails={(booking) => {
            setSelectedBooking(booking);
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

      <div ref={loadMoreRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="text-center py-4 text-gray-500 text-sm">Loading more...</div>
      )}

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
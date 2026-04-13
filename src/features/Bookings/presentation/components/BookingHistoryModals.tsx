"use client";

import BookingHistoryViewDetailsModal from "./BookingHistoryViewDetailsModal";

import InvoiceModal from "@/features/JobTracking/presentation/components/InvoiceModal";
import OtpModal from "@/components/common/CommonOtpModal";
import type { BookingHistory } from "../../domain/entities/bookinghistory.types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface BookingModalsProps {
  selectedBooking: BookingHistory | null;
  modalOpen: boolean;
  onCloseModal: () => void;
  
  paymentBookingId: string;
  paymentModalOpen: boolean;
  onClosePaymentModal: () => void;
  
  invoiceModalOpen: boolean;
  onCloseInvoiceModal: () => void;
  selectedInvoice: any;
  selectedBookingForInvoice: BookingHistory | null;
  
  otpModalOpen: boolean;
  onCloseOtpModal: () => void;
  otpData?: string | number;
  otpPurpose: string;
  
  allBookings: BookingHistory[];
  services: any[];
  categories: any[];
  serviceTiers: any[];
}

export default function BookingModals({
  selectedBooking,
  modalOpen,
  onCloseModal,
  
  paymentBookingId,
  paymentModalOpen,
  onClosePaymentModal,
  
  invoiceModalOpen,
  onCloseInvoiceModal,
  selectedInvoice,
  selectedBookingForInvoice,
  
  otpModalOpen,
  onCloseOtpModal,
  otpData,
  otpPurpose,
  
  allBookings,
  services,
  categories,
  serviceTiers,
}: BookingModalsProps) {
  const paymentBooking = allBookings.find(b => b._id === paymentBookingId);
const navigate = useNavigate();
  return (
    <>
      <BookingHistoryViewDetailsModal
        booking={selectedBooking}
        isOpen={modalOpen}
        onClose={onCloseModal}
      />

      {paymentModalOpen && paymentBooking && (
        useEffect(() => {
          navigate("/payment", {
            state: {
              bookingId: paymentBooking._id,
              serviceName: paymentBooking.service?.name ?? "Service Name",
              price: paymentBooking.amount,
              currency: paymentBooking.currency,
            },
          });

          onClosePaymentModal();
        }, [paymentModalOpen, paymentBooking])
      )}

      {invoiceModalOpen && selectedInvoice && selectedBookingForInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          booking={selectedBookingForInvoice}
          services={services}
          categories={categories}
          serviceTiers={serviceTiers}
          open={invoiceModalOpen}
          onClose={onCloseInvoiceModal}
        />
      )}

      <OtpModal
        isOpen={otpModalOpen}
        otpData={otpData}
        purpose={otpPurpose}
        onClose={onCloseOtpModal}
      />
    </>
  );
}
"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { useLanguage } from "@/features/context/LanguageContext";

import InvoiceModal from "./InvoiceModal";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";


import CommonCard from "@/components/common/CommonCards";
import CommonModal from "@/components/common/CommonModal";
import { CancelConfirmationDialog } from "./CancelModal";
import { handleApiError } from "@/components/common/ApiError";

export default function JobTrackingNeedHelp({
  booking,
}: {
  booking: Booking | null;
}) {
  const navigate = useNavigate();
  const { cancelBooking } = useBookings();
  const { data: categories } = useServiceCategory();
  const { t } = useLanguage();

  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // ✅ MODAL STATE (IMPORTANT FIX)
  const [showCancelModal, setShowCancelModal] = useState(false);

  const categoriesList = categories ?? [];

  // -----------------------
  // FLATTEN SERVICES
  // -----------------------
  const services = useMemo(() => {
    return categoriesList.flatMap((cat: any) => cat.services ?? []);
  }, [categoriesList]);

  const serviceTiers = useMemo(() => {
    return services.flatMap(
      (service: any) =>
        service.pricingTiers?.map((tier: any) => tier.tier) ?? []
    );
  }, [services]);

  // -----------------------
  // NAV
  // -----------------------
  const helpNavigate = () => navigate("/help");

  // -----------------------
  // CANCEL OPEN
  // -----------------------
  const handleCancel = () => {
    if (!booking?._id) return;
    setShowCancelModal(true);
  };

  // -----------------------
  // CANCEL CONFIRM API
  // -----------------------
 const handleConfirmCancel = async (
  cancelReasonType: string,
  reason: string
) => {
  if (!booking?._id) return;

  const payload: any = {
    bookingId: booking._id,
    cancelReasonType,
  };

  if (cancelReasonType === "OTHER") {
    payload.cancelReason = reason.trim();
  }

  try {
    await cancelBooking.mutateAsync(payload);

    setShowCancelModal(false);
    navigate("/");
  } catch (err: any) {
    handleApiError(err);

    setShowCancelModal(false);
  }
};

  // -----------------------
  // OPTIONS
  // -----------------------
  const options = [
    {
      text: t.jobtrackingpage.sections.contactSupport,
      icon: <span>❓</span>,
      action: helpNavigate,
    },
 {
  text: t.jobtrackingpage.sections.chatWithUs,
  icon: <span>💬</span>,
  action: () => toast.info("Chat Feature will come soon"),
},
    {
      text: t.jobtrackingpage.sections.cancelBooking,
      icon: <span>🗑️</span>,
      action: handleCancel,
    },
    {
      text: t.jobtrackingpage.sections.generateInvoice,
      icon: <span>📄</span>,
      action: () => {
        if (!booking) {
          return toast.error("Booking not found ❌");
        }

        const isCompleted = booking.status === "COMPLETED" || booking.status==="INVOICE_GENERATED";


            if (!isCompleted) {
              return toast.info(
                "Invoice can be viewed after completing the work"
              );
            }

      setSelectedBooking(booking);
      setShowInvoice(true);
    },
    },
  ];

  if (!booking) return null;

  return (
   <CommonCard title={t.jobtrackingpage.sections.needHelp}>
      <div className="flex flex-col gap-3">
        {options.map((opt, idx) => (
          <div
            key={idx}
            onClick={opt.action}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-white"
          >
            <div className="w-10 h-10 bg-white border rounded-lg flex items-center justify-center">
              {opt.icon}
            </div>
            <span className="text-sm font-semibold">{opt.text}</span>
          </div>
        ))}
      </div>

      {/* Invoice Modal */}
      {showInvoice && selectedBooking && (
        <InvoiceModal
          booking={selectedBooking}
          services={services}
          categories={categoriesList}
          serviceTiers={serviceTiers}
          open={showInvoice}
          onClose={() => setShowInvoice(false)}
        />
      )}

      {/* Cancel Modal */}
      <CommonModal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title={t.jobtrackingpage.sections.cancelBooking}
      >
        <CancelConfirmationDialog
          onConfirm={handleConfirmCancel}
          onCancel={() => setShowCancelModal(false)}
        />
      </CommonModal>
    </CommonCard>
  );
}
"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { useLanguage } from "@/features/context/LanguageContext";

import InvoiceModal from "./InvoiceModal";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";

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

  const categoriesList = categories ?? [];

  // -----------------------
  // SERVICES FLATTEN
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
  // NAVIGATION
  // -----------------------
  const helpNavigate = () => navigate("/help");

  // -----------------------
  // CANCEL BOOKING
  // -----------------------
  const handleCancel = () => {
    if (!booking?._id) return;

    toast(
      ({ closeToast }) => (
        <div>
          <p className="font-semibold mb-3">
            Are you sure you want to cancel this booking?
          </p>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => closeToast?.()}
              className="px-3 py-1 text-sm rounded bg-gray-200"
            >
              No
            </button>

            <button
              onClick={async () => {
                try {
                  await cancelBooking({ bookingId: booking._id });

                  closeToast?.();
                  toast.success("Booking cancelled ✅");

                  setTimeout(() => navigate("/"), 1500);
                } catch {
                  toast.error("Failed to cancel booking ❌");
                }
              }}
              className="px-3 py-1 text-sm rounded bg-red-600 text-white"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
      }
    );
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
      action: () => toast.info("Chat feature coming soon!"),
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
        if (!booking) return toast.error("Booking not found ❌");

        setSelectedBooking(booking);
        setShowInvoice(true);
      },
    },
  ];

  // -----------------------
  // EMPTY STATE
  // -----------------------
  if (!booking) return null;

  // -----------------------
  // UI
  // -----------------------
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-4">
        {t.jobtrackingpage.sections.needHelp}
      </h3>

      <div className="flex flex-col gap-3">
        {options.map((opt, idx) => (
          <div
            key={idx}
            onClick={opt.action}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-white hover:shadow-sm"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
              {opt.icon}
            </div>

            <span className="text-sm font-semibold text-gray-900">
              {opt.text}
            </span>
          </div>
        ))}

        {/* INVOICE MODAL */}
        {showInvoice && selectedBooking && (
          <InvoiceModal
            booking={selectedBooking}
            services={services}
            categories={categoriesList}
            serviceTiers={serviceTiers}
            open={showInvoice}
            onClose={() => {
              setShowInvoice(false);
              setSelectedBooking(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
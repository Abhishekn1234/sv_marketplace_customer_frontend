"use client";

import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useGenerateInvoice } from "@/features/Generateotp/presentation/hooks/useGenerateInvoice";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useMemo } from "react";
import InvoiceModal from "./InvoiceModal";
import { useLanguage } from "@/features/context/LanguageContext";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";

export default function JobTrackingNeedHelp({bookings}:{bookings:Booking[]}) {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const {  cancelBooking } = useBookings();
  const { data: categories } = useServiceCategory();
  const generateInvoice = useGenerateInvoice();
  const { t } = useLanguage();

  const [invoice, setInvoice] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const categoriesList = categories ?? [];

  // ✅ Find booking directly (NO pagination)
  const booking = useMemo(() => {
    if (!bookings || !bookingId) return null;
    return bookings.find((b) => b._id === bookingId);
  }, [bookings, bookingId]);

  // ✅ Flatten services
  const services = categoriesList.flatMap((cat: any) => cat.services ?? []);
  const serviceTiers = services.flatMap(
    (service: any) =>
      service.pricingTiers?.map((tier: any) => tier.tier) ?? []
  );

  const helpNavigate = () => navigate("/help");

  // ✅ Cancel Booking
  const handleCancel = () => {
    if (!bookingId) return;

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
                  await cancelBooking({ bookingId });
                  closeToast?.();
                  toast.success("Your booking is cancelled ✅");

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
      { autoClose: false, closeOnClick: false, closeButton: false }
    );
  };

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
        if (!bookingId) return toast.error("Booking not found ❌");

        const loadingToast = toast.loading("Generating invoice...");

        generateInvoice.mutate(bookingId, {
          onSuccess: (data) => {
            toast.dismiss(loadingToast);
            setInvoice(data);
            setShowInvoice(true);
            toast.success("Invoice generated ✅");
          },
          onError: () => {
            toast.dismiss(loadingToast);
            toast.error("Failed to generate invoice ❌");
          },
        });
      },
    },
  ];

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

        {/* Invoice Modal */}
        {showInvoice && invoice && booking && (
          <InvoiceModal
            invoice={invoice}
            booking={booking}
            services={services}
            categories={categoriesList}
            serviceTiers={serviceTiers}
            open={showInvoice}
            onClose={() => setShowInvoice(false)}
          />
        )}
      </div>
    </div>
  );
}
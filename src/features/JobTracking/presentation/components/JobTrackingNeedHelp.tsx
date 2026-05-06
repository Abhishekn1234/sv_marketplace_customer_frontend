"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useServiceCategory } from "@/features/Bookings/presentation/hooks/useServiceCategory";
import { useLanguage } from "@/features/context/LanguageContext";

import InvoiceModal from "./InvoiceModal";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { Label, Textarea } from "@/components/input";
import Button from "@/components/input/Button";
import Select, { type SelectOption } from "@/components/input/Select";
import { useQueryClient } from "@tanstack/react-query";

// -----------------------
// CANCEL TYPES
// -----------------------
const cancelTypes = [
  { value: "BOOKED_WRONG_SERVICE", label: "Booked Wrong Service" },
  { value: "BOOKED_BY_MISTAKE", label: "Booked by Mistake" },
  { value: "SCHEDULE_CHANGED", label: "Schedule Changed" },
  { value: "PRICE_TOO_HIGH", label: "Price Too High" },
  { value: "SERVICE_NO_LONGER_NEEDED", label: "Service No Longer Needed" },
  { value: "OTHER", label: "Other" },
];
const options: SelectOption[] = [
  { label: "Select cancellation reason...", value: "" },
  ...cancelTypes.map((type) => ({
    label: type.label,
    value: type.value,
  })),
];


// -----------------------
// CANCEL FORM
// -----------------------
function CancelConfirmationDialog({
  onConfirm,
  onCancel,
}: {
  onConfirm: (type: string, reason: string) => void;
  onCancel: () => void;
}) {
  const [selectedType, setSelectedType] = useState("");
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    if (!selectedType) {
      toast.error("Please select a cancellation reason");
      return;
    }

    // ✅ reason required only if NOT OTHER
    if (selectedType !== "OTHER" && !reason.trim()) {
      toast.error("Please enter a cancel reason");
      return;
    }

    onConfirm(selectedType, reason.trim());
  };

  return (
    <div>
      <Label className="font-semibold mb-3">
        Are you sure you want to cancel this booking?
      </Label>

      {/* TYPE */}
            <Select
        options={options}
        value={selectedType}
        onChange={(val) => setSelectedType(val)}
        className="w-full mb-3"
      />

      {/* REASON */}
      <Textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder={
          selectedType === "OTHER"
            ? "Optional reason..."
            : "Enter cancellation reason..."
        }
        className="w-full mb-3 p-2 border rounded text-sm dark:bg-gray-900 dark:border-gray-700"
      />

      {/* ACTIONS */}
      <div className="flex gap-2 justify-end">
        <Button
          onClick={onCancel}
          className="px-3 py-1 text-sm rounded bg-gray-200"
        >
          No
        </Button>

        <Button
          onClick={handleConfirm}
          className="px-3 py-1 text-sm rounded bg-red-600 text-white"
        >
          Yes, Cancel
        </Button>
      </div>
    </div>
  );
}

// -----------------------
// MAIN COMPONENT
// -----------------------
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
const queryClient = useQueryClient();
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

  try {
    // ✅ 1. Call API
    const updated = await cancelBooking.mutateAsync({
      bookingId: booking._id,
      cancelReason: reason,
      cancelReasonType,
    });

    // ✅ 2. Update cache instantly
    queryClient.setQueryData(["bookings"], (old: any[] = []) =>
      old.map((b) =>
        b._id === booking._id ? { ...b, ...updated } : b
      )
    );

    queryClient.setQueryData(
      ["booking", booking._id],
      (old: any) => ({
        ...old,
        ...updated,
      })
    );

    toast.success("Booking cancelled ✅");

    // ✅ 3. Close modal
    setShowCancelModal(false);

    // ✅ 4. Navigate immediately (NO setTimeout)
    navigate("/");

  } catch (err) {
    toast.error("Failed to cancel booking ❌");
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

        {/* INVOICE */}
        {showInvoice  && selectedBooking && (
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

      {/* -----------------------
          CANCEL MODAL
      ----------------------- */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl w-[90%] max-w-md">
            <CancelConfirmationDialog
              onConfirm={handleConfirmCancel}
              onCancel={() => setShowCancelModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
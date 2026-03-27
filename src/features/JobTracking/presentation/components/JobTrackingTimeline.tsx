"use client";

import { useBookingHistory } from "@/features/Bookings/presentation/hooks/useBookingHistory";
import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";
import PaymentModal from "@/features/Payment/presentation/Paymentpage";

import { useVerifyPayment } from "@/features/Payment/presentation/hooks/useVerifyPayment";
import { useLanguage } from "@/features/context/LanguageContext";

export default function JobTrackingTimeline() {
  const { data } = useBookingHistory();
//   const allBookings = data?.pages.flatMap((page) => page.data) ?? [];

// // console.log(allBookings);
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [openPayment, setOpenPayment] = useState(false);
  const [localBooking, setLocalBooking] = useState<any>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [hasRated, setHasRated] = useState(false);
  const verifyPaymentMutation = useVerifyPayment();
 const {t}=useLanguage();

  useEffect(() => {
    if (!data?.pages || !bookingId) return;
    const found = data.pages.flatMap((page) => page.data).find((b) => b._id === bookingId);
    setLocalBooking(found);
  }, [data, bookingId]);

 
        const steps = useMemo(() => {
          if (!localBooking) return [];

          const worker = localBooking.assignedWorkers?.[0];

          return [
            {
              title: "Booking Confirmed",
              time: formatDates(localBooking.createdAt),
              status: "completed",
            },
            {
              title: "Professional Assigned",
              time: formatDates(worker?.assignedAt),
              status: worker?.assignedAt ? "completed" : "pending",
            },
            {
              title: "Service Started",
              time:
                worker?.startedAt || localBooking.status === "IN_PROGRESS" || localBooking.status === "WORK_COMPLETED_PENDING"
                  ? formatDates(worker?.startedAt || new Date())
                  : "Pending",
              status:
                worker?.startedAt || localBooking.status === "IN_PROGRESS" || localBooking.status === "WORK_COMPLETED_PENDING"
                  ? "active"
                  : "pending",
            },
            {
              title: "Service Completed",
              time: worker?.completedAt ? formatDates(worker.completedAt) : "Pending",
              status: worker?.completedAt || localBooking.status === "COMPLETED" ? "active" : "pending",
            },
            {
              title: "Invoice Generated",
              time: localBooking.invoiceId ? formatDates(localBooking.updatedAt) : "Pending",
              status: localBooking.invoiceId ? "completed" : "pending",
              // showPaymentButton: localBooking.invoiceId && localBooking.status === "INVOICE_GENERATED",
            },
            {
              title: "Payment",
              time:
                localBooking.status === "PAID"
                  ? formatDates(localBooking.paymentDate ?? new Date())
                  : "Pending",
              status:
                localBooking.status === "PAID"
                  ? "completed"
                  : localBooking.status === "PAYMENT_PENDING"
                  ? "active"
                  : "pending",
              showPaymentButton: localBooking.status === "INVOICE_GENERATED",
              showVerifyButton: localBooking.status === "PAYMENT_PENDING" && !!localBooking.invoiceId,
            },
            
            {
              title: "Payment Done",
              time: localBooking.status === "PAID" ? formatDates(localBooking.paymentDate ?? new Date()) : "Pending",
              status: localBooking.status === "PAID" ? "active" : "pending",
              showServiceRatingButton: localBooking.status === "PAID",
            },
          ];
        }, [localBooking]);

        const pricingTier = localBooking?.service?.pricingTiers?.find(
          (tier: any) => tier.tierId === localBooking.serviceTierId
        );
        const calculatedAmount = useMemo(() => {
          if (!localBooking || !pricingTier) return 0;

          if (localBooking.pricingMode === "HOURLY") {
            const rate = pricingTier?.HOURLY?.ratePerHour ?? 0;
            const hours = localBooking.actualWorkHours ?? 0;
            return rate * hours;
          }

          if (localBooking.pricingMode === "PER_DAY") {
            const rate = pricingTier?.PER_DAY?.ratePerDay ?? 0;
            const days = localBooking.actualWorkDays ?? 0;
            return rate * days;
          }

          return 0;
        }, [localBooking, pricingTier]);
          // console.log(calculatedAmount);
  useEffect(() => {
    if (!timelineRef.current) return;
    const firstActive = timelineRef.current.querySelector(".active");
    if (firstActive) {
      (firstActive as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [steps]);

  if (!localBooking) return null;

  return (
    <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm">
   
      <div className="flex justify-between items-center mb-7">
        <h2 className="text-lg font-bold text-gray-900">{t.jobtrackingpage.sections.serviceProgress}</h2>
        <div className="px-4 py-1 bg-emerald-100 text-emerald-600 text-xs font-semibold rounded-full">
          {localBooking.status}
        </div>
      </div>

      <div className="relative pl-10 overflow-hidden" ref={timelineRef}>
       <div className="absolute left-2 top-2 bottom-10 w-0.5 bg-gray-200"></div>

        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;

          const dotClasses =
            step.status === "completed"
              ? "bg-emerald-500"
              : step.status === "active"
              ? "bg-blue-600 animate-pulse active"
              : "bg-gray-200";

          return (
            <div key={idx} className={`relative pb-7 ${isLast ? "pb-0" : ""}`}>
              <div
                className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-2 border-white shadow-sm ${dotClasses}`}
              />

              <div
                className={`bg-gray-50 border rounded-xl p-4 ${
                  step.status === "active" ? "bg-blue-50 border-blue-600" : "border-gray-200"
                }`}
              >
                <div
                  className={`text-sm font-semibold mb-1 ${
                    step.status === "active" ? "text-blue-600" : "text-gray-900"
                  }`}
                >
                  {step.title}
                </div>

                <div className="text-xs text-gray-500 font-medium mb-2">{step.time}</div>

               
                {step.showPaymentButton && (
                  <button
                    onClick={() => setOpenPayment(true)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Pay Now
                  </button>
                )}

               
                {step.showVerifyButton && (
                  <button
                    onClick={() => {
                      if (!localBooking.paymentId) return;

                      verifyPaymentMutation.mutate(localBooking.paymentId, {
                        onSuccess: () => {
                          // ✅ Only update local state here
                          setLocalBooking((prev: any) => ({
                            ...prev,
                            status: "PAID",
                            paymentDate: new Date().toLocaleString(),
                          }));
                        },
                      });
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition mt-2"
                  >
                    Verify Payment
                  </button>
                )}

                
              {step.showServiceRatingButton && (
                  <button
                    onClick={() => {
                      if (!localBooking) return;

                      if (!hasRated) {
                        // First click → go to service rating
                        setHasRated(true);
                        navigate(`/servicerating/${localBooking._id}`);
                      } else {
                      
                        navigate("/bookings");
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600 transition mt-2"
                  >
                    Rate Service
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Modal */}
      {localBooking._id && (
        <PaymentModal
          bookingId={localBooking._id}
          serviceName={localBooking.service?.name ?? "Service Name"}
          price={calculatedAmount}
          currency={localBooking.currency}
          isOpen={openPayment}
          onClose={() => setOpenPayment(false)}
        />
      )}
    </div>
  );
}
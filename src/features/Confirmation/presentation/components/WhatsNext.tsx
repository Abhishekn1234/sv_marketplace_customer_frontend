"use client";

import { useLanguage } from "@/features/context/LanguageContext";
import NextStep from "./Nextstep";
import { BookingStatus } from "@/features/Bookings/domain/entities/bookingstatus.types";

interface Props {
  status: BookingStatus;
}

export default function WhatsNext({ status }: Props) {
  const { t, isRTLOrder } = useLanguage();

  const paymentStatuses: BookingStatus[] = [
    BookingStatus.INVOICE_GENERATED,
    BookingStatus.PAYMENT_PENDING,
  ];

  const completedStatuses: BookingStatus[] = [
    BookingStatus.COMPLETED,
    BookingStatus.PAID,
    BookingStatus.REFUND_REQUESTED,
    BookingStatus.REFUNDED,
    BookingStatus.WORKER_CANCELLED,
    BookingStatus.CUSTOMER_CANCELLED,
    BookingStatus.WORKER_REJECTED,
    BookingStatus.CUSTOMER_REJECTED,
    BookingStatus.EXPIRED,
  ];

  const steps = [
    {
      number: "1",
      title:
        status === BookingStatus.REQUESTED
          ? t.confirmationpage.steps.step1.title
          : t.confirmationpage.bookingSummary.providerAssigned,

      description:
        status === BookingStatus.REQUESTED
          ? t.confirmationpage.steps.step1.description
          : t.confirmationpage.bookingSummary.providerAssignedDesc,
    },

    {
      number: "2",
      title:
        status === BookingStatus.WORK_START_OTP_GENERATED
          ? t.confirmationpage.bookingSummary.shareStartOtp
          : status === BookingStatus.WORK_STARTED ||
            status === BookingStatus.IN_PROGRESS
          ? t.confirmationpage.bookingSummary.workInProgress
          : status === BookingStatus.WORK_COMPLETE_OTP_GENERATED ||
            status === BookingStatus.WORK_COMPLETED_BY_WORKER ||
            status === BookingStatus.WORK_COMPLETED_PENDING
          ? t.confirmationpage.bookingSummary.verifyCompletionOtp
          : t.confirmationpage.steps.step2.title,

      description:
        status === BookingStatus.WORK_START_OTP_GENERATED
          ? t.confirmationpage.bookingSummary.shareStartOtpDesc
          : status === BookingStatus.WORK_STARTED ||
            status === BookingStatus.IN_PROGRESS
          ? t.confirmationpage.bookingSummary.workInProgressDesc
          : status === BookingStatus.WORK_COMPLETE_OTP_GENERATED ||
            status === BookingStatus.WORK_COMPLETED_BY_WORKER ||
            status === BookingStatus.WORK_COMPLETED_PENDING
          ? t.confirmationpage.bookingSummary.verifyCompletionOtpDesc
          : t.confirmationpage.steps.step2.description,
    },

    {
      number: "3",
      title: paymentStatuses.includes(status)
        ? t.confirmationpage.bookingSummary.completePayment
        : completedStatuses.includes(status)
        ? t.confirmationpage.bookingSummary.paymentCompleted
        : t.confirmationpage.steps.step3.title,

      description: paymentStatuses.includes(status)
        ? t.confirmationpage.bookingSummary.completePaymentDesc
        : completedStatuses.includes(status)
        ? t.confirmationpage.bookingSummary.paymentCompletedDesc
        : t.confirmationpage.steps.step3.description,
    },
  ];

  return (
    <div
      className={`bg-white border-2 border-gray-200 rounded-xl p-6 ${
        isRTLOrder ? "text-right" : "text-left"
      }`}
    >
      <h3 className="text-xs font-bold uppercase text-gray-400 mb-5">
        {t.confirmationpage.whatsNext}
      </h3>

      <div className="flex flex-col gap-4">
        {steps.map((step) => (
          <NextStep
            key={step.number}
            {...step}
            isRTLOrder={isRTLOrder}
          />
        ))}
      </div>
    </div>
  );
}
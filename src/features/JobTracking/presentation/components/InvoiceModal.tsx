"use client";

import Button from "@/components/input/Button";
import { formatWorkHours } from "@/features/Bookings/presentation/utils/formathours";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useLanguage } from "@/features/context/LanguageContext";
import { useGenerateInvoice } from "@/features/Generateotp/presentation/hooks/useGenerateInvoice";
import { useNavigate } from "react-router-dom";
import CommonModal from "@/components/common/CommonModal";
import type { Booking } from "@/features/Bookings/domain/entities/booking.types";
import { Service } from "@/features/Bookings/domain/entities/service.types";
import { Category } from "@/features/Bookings/domain/entities/category.types";
import { PricingTier } from "@/features/Bookings/domain/entities/pricingtier.types";
import { ServiceTierRef } from "@/features/Bookings/domain/entities/servicetier.types";

interface Props {
  services: Service[];
  categories: Category[];
  serviceTiers?: PricingTier[];
  open: boolean;
  booking?: Booking;
  onClose: () => void;
}

export default function InvoiceModal({
  booking,
  open,
  onClose,
}: Props) {
  const navigate = useNavigate();
  const { data: invoice } = useGenerateInvoice(booking?._id,open);
  const { serviceTiers, services } = useServices();
  const { t, isRTLOrder,localize } = useLanguage();

  if (!open || !booking) return null;

  
  const serviceId =
    typeof booking.serviceId === "string"
      ? booking.serviceId
      : booking.serviceId?._id;

  const service = localize(
  booking.service?.name ??
    (typeof booking.serviceId === "object"
      ? booking.serviceId?.name
      : services.find((s) => s._id === serviceId)?.name) ??
    "-"
   );

 
  const serviceTierId =
    typeof booking.serviceTierId === "string"
      ? booking.serviceTierId
      : booking.serviceTierId?._id;

  const serviceTier =
    booking.serviceTier ??
    serviceTiers?.find(
      (tier:ServiceTierRef) =>
        tier._id === serviceTierId ||
        tier.tierId === serviceTierId
    );

 const serviceTierName = localize(
  serviceTier?.displayName ?? "-"
);

  const invoiceData = invoice ?? null;

  const workedDuration =
    booking.pricingMode === "HOURLY"
      ? formatWorkHours(
          invoiceData?.actualWorkHours ??
            booking.actualWorkHours ??
            0
        )
      : `${
          invoiceData?.actualWorkDays ??
          booking.actualWorkDays ??
          0
        } ${t.common.days}`;

     const rate = Number(booking.actualValues?.taxableAmount?? booking.estimatedValues?.taxableAmount);
     const vatAmount = Number(booking.actualValues?.vatAmount ?? booking.estimatedValues?.vatAmount);

     const finalAmount = Number(
       booking.actualValues?.finalAmount ?? booking.estimatedValues?.finalAmount
      );

     const currency =
    invoiceData?.currency ??
    booking.currency ??
    "SAR";

  const handleExport = () => {
    navigate(`/invoice/${booking._id}`, {
      state: {
        booking,
        invoice,
        service,
        serviceTierName,
        workedDuration,
        rate,
        vatAmount,
        finalAmount,
        currency,
      },
    });
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={t.common.invoiceDetails}
      width="max-w-lg"
      footer={
        <div
          className={`flex w-full items-center ${
            isRTLOrder
              ? "flex-row-reverse justify-between"
              : "justify-between"
          }`}
        >
          {invoice?.status === "PAID" && (
            <Button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              {t.common.exportPdf}
            </Button>
          )}

          <Button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            {t.common.close}
          </Button>
        </div>
      }
    >
      <div
        dir={isRTLOrder ? "rtl" : "ltr"}
        className={isRTLOrder ? "text-right" : "text-left"}
      >
        <div className="space-y-2 text-sm">
          <p>
            <b>{t.common.invoiceNo}:</b>{" "}
            <span dir="ltr">
              {invoice?.invoiceNumber ?? "-"}
            </span>
          </p>

          <p>
            <b>{t.common.status}:</b>{" "}
            {invoice?.status ?? "-"}
          </p>

          <p>
            <b>{t.common.service}:</b> {service}
          </p>

          <p>
            <b>{t.common.serviceTier}:</b>{" "}
            {serviceTierName}
          </p>
        </div>

        <div className="border rounded-lg p-4 mt-4">
          <h4 className="font-semibold mb-3">
            {t.invoice.workDetails}
          </h4>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t.common.workers}</span>
              <span dir="ltr">
                {booking.numberOfWorkers}
              </span>
            </div>

            <div className="flex justify-between">
              <span>{t.common.pricingMode}</span>
              <span>{booking.pricingMode}</span>
            </div>

            <div className="flex justify-between">
              <span>{t.common.rate}</span>

              <span dir="ltr">
                {rate.toFixed(2)} {currency}
                {booking.pricingMode === "HOURLY"
                  ? t.common["/hr"]
                  : t.common["/day"]}
              </span>
            </div>

            <div className="flex justify-between">
              <span>{t.common.workedDuration}</span>

              <span dir="ltr">
                {workedDuration}
              </span>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 mt-4 bg-gray-50">
          <h4 className="font-semibold mb-3">
            {t.common.payment}
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>{t.bookingdetailpage.basePrice}</span>

              <span dir="ltr">
                {rate.toFixed(2)} {currency}
              </span>
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              <span>
                + {t.bookingdetailpage.vatRate}
              </span>

              <span dir="ltr">
                {vatAmount.toFixed(2)} {currency}
              </span>
            </div>

            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>{t.bookingdetailpage.total}</span>

              <span
                dir="ltr"
                className="text-primary"
              >
                {finalAmount.toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}
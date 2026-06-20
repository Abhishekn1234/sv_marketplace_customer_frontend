import Button from "@/components/input/Button";
import { formatWorkHours } from "@/features/Bookings/presentation/helpers/formathours";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useLanguage } from "@/features/context/LanguageContext";
import { useGenerateInvoice } from "@/features/Generateotp/presentation/hooks/useGenerateInvoice";
import { useNavigate } from "react-router-dom";
import CommonModal from "@/components/common/CommonModal";

interface Props {
  services: any[];
  categories: any[];
  serviceTiers?: any[];
  open: boolean;
  booking?: any;
  onClose: () => void;
}

export default function InvoiceModal({
  booking,
  open,
  onClose,
}: Props) {
  const navigate = useNavigate();
  const { data: invoice } = useGenerateInvoice(booking?._id);
  const { serviceTiers, services } = useServices();
  const { t } = useLanguage();

  if (!open || !booking) return null;

  const serviceName =
    booking.serviceId?.name ?? booking.service?.name;

  const service =
    serviceName ??
    services.find((s) => s._id === booking.serviceId)?.name;

  const serviceTier = serviceTiers?.find(
    (tier: any) => tier._id === booking?.serviceTierId
  );

  const serviceTierName = serviceTier?.displayName ?? "-";

  const invoiceData = invoice ?? null;

  const workedDuration =
    booking?.pricingMode === "HOURLY"
      ? formatWorkHours(
          invoiceData?.actualWorkHours ??
            booking?.actualWorkHours ??
            0
        )
      : `${
          invoiceData?.actualWorkDays ??
          booking?.actualWorkDays ??
          0
        } days`;

  const rate = Number(booking?.amount || 0);
  const vatAmount = Number(booking?.vatAmount || 0);
  const finalAmount = Number(booking?.totalCost || 0);

  const currency =
    invoiceData?.currency ?? booking?.currency ?? "SAR";

  const handleExport = () => {
    navigate(`/invoice/${booking?._id}`, {
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
        <div className="flex justify-between w-full">
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
      {/* INVOICE INFO */}
      <div className="space-y-2 text-sm">
        <p>
          <b>{t.common.invoiceNo}:</b>{" "}
          {invoice?.invoiceNumber || "-"}
        </p>

        <p>
          <b>{t.common.status}:</b>{" "}
          {invoice?.status || "-"}
        </p>

        <p>
          <b>{t.common.service}:</b> {service}
        </p>

        <p>
          <b>{t.common.serviceTier}:</b>{" "}
          {serviceTierName}
        </p>
      </div>

      {/* WORK DETAILS */}
      <div className="border rounded-lg p-4 mt-4">
        <h4 className="font-semibold mb-3">
         {t.invoice.workDetails}
        </h4>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t.common.workers}</span>
            <span>{booking?.numberOfWorkers}</span>
          </div>

          <div className="flex justify-between">
            <span>{t.common.pricingMode}</span>
            <span>{booking?.pricingMode}</span>
          </div>

          <div className="flex justify-between">
            <span>{t.common.rate}</span>
            <span>
              {rate.toFixed(2)} {currency}
              {booking?.pricingMode === "HOURLY"
                ? "/hour"
                : "/day"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>{t.common.workedDuration}</span>
            <span>{workedDuration}</span>
          </div>
        </div>
      </div>

      {/* PAYMENT SUMMARY */}
      <div className="border rounded-lg p-4 mt-4 bg-gray-50">
        <h4 className="font-semibold mb-3">
         {t.common.payment}
        </h4>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>{t.bookingdetailpage.basePrice}</span>
            <span>
              {rate.toFixed(2)} {currency}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>+ {t.bookingdetailpage.vatRate}</span>
            <span>
              {vatAmount.toFixed(2)} {currency}
            </span>
          </div>

          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>{t.bookingdetailpage.total}</span>
            <span className="text-primary">
              {finalAmount.toFixed(2)} {currency}
            </span>
          </div>
        </div>
      </div>
    </CommonModal>
  );
}
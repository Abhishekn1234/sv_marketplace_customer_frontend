import Button from "@/components/input/Button";
import { formatWorkHours } from "@/features/Bookings/presentation/helpers/formathours";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useLanguage } from "@/features/context/LanguageContext";
import { useGenerateInvoice } from "@/features/Generateotp/presentation/hooks/useGenerateInvoice";
import { useNavigate } from "react-router-dom";

interface Props {
  // invoice: any;
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
  if (!open) return null;

  const navigate = useNavigate();
  const { data: invoice } = useGenerateInvoice(booking?._id);
  const { serviceTiers, services } = useServices();
  const { t } = useLanguage();

  const serviceName =
    booking.serviceId?.name ??
    booking.service?.name;

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
      : `${invoiceData?.actualWorkDays ?? booking?.actualWorkDays ?? 0} days`;

  const rate = booking.amount;

  const finalAmount = booking?.totalCost;

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
        finalAmount,
        currency,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl p-6 space-y-5">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">
            {t.common.invoiceDetails}
          </h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        {/* BOOKING INFO */}
        <div className="space-y-2 text-sm">
          <p>
            <b>{t.common.invoiceNo}:</b> {invoice?.invoiceNumber}
          </p>

          <p>
            <b>{t.common.status}:</b> {invoice?.status}
          </p>

          <p>
            <b>{t.common.service}:</b> {service}
          </p>

          <p>
            <b>{t.common.serviceTier}:</b> {serviceTierName}
          </p>
        </div>

        {/* WORK DETAILS */}
        <div className="border rounded-lg p-3 space-y-1 text-sm">
          <p>
            <b>{t.common.workers}:</b> {booking?.numberOfWorkers}
          </p>

          <p>
            <b>{t.common.pricingMode}:</b> {booking?.pricingMode}
          </p>

          <p>
            <b>{t.common.rate}:</b> {rate} {currency}{" "}
            {booking?.pricingMode === "HOURLY" ? "/hour" : "/day"}
          </p>

          <p>
            <b>{t.common.workedDuration}:</b> {workedDuration}
          </p>
        </div>

        {/* PAYMENT */}
        <div className="border rounded-lg p-3 space-y-1 text-sm">
          <p className="font-semibold text-base">
            {t.common.finalAmount}:{" "}
            {Number(finalAmount).toFixed(2)} {currency}
          </p>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between">
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
      </div>
    </div>
  );
}
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
      <div className="border rounded-lg p-3 space-y-1 text-sm mt-4">
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
      <div className="border rounded-lg p-3 space-y-1 text-sm mt-4">
        <p className="font-semibold text-base">
          {t.common.finalAmount}:{" "}
          {Number(finalAmount).toFixed(2)} {currency}
        </p>
      </div>
    </CommonModal>
  );
}
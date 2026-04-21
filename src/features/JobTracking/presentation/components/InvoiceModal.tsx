import { formatWorkHours } from "@/features/Bookings/presentation/helpers/formathours";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useGenerateInvoice } from "@/features/Generateotp/presentation/hooks/useGenerateInvoice";

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
  services,
  // categories,
  open,
  onClose,
}: Props) {
  if (!open) return null;

  // 🔥 Fetch invoice (assuming hook supports invoiceId)
  const { data: invoice } = useGenerateInvoice(booking?.invoiceId);
 const {serviceTiers}=useServices();
  // ---------------------------
  // SERVICE / CATEGORY LOOKUP
  // ---------------------------
  const service = services?.find((s) => s._id === booking?.serviceId);
  const serviceTier = serviceTiers?.find(
  (tier: any) => tier._id === booking?.serviceTierId
);

const serviceTierName = serviceTier?.displayName ?? "-";
 
  


  // ---------------------------
  // WORKED DURATION
  // ---------------------------
  const workedDuration =
    booking?.pricingMode === "HOURLY"
      ? formatWorkHours(booking?.actualWorkHours ?? 0)
      : `${booking?.actualWorkDays ?? invoice?.actualWorkDays ?? 0} days`;

  // ---------------------------
  // RATE
  // ---------------------------
  const rate =booking.amount
  
  // ---------------------------
  // INVOICE DATA (FIXED)
  // ---------------------------
  const invoiceData =
    invoice && booking?.invoiceId === invoice?._id ? invoice : invoice;

  console.log("Booking:", booking);
  console.log("Fetched Invoice:", invoice);

  const finalAmount =booking?.totalCost;

  const currency =
    invoiceData?.currency ?? booking?.currency ?? "₹";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl p-6 space-y-5">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Invoice Details</h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        {/* BOOKING INFO */}
        <div className="space-y-2 text-sm">
          <p>
            <b>Invoice No:</b> {booking?.invoiceId}
          </p>
          <p>
            <b>Status:</b> {booking?.status}
          </p>
         
          <p>
            <b>Service:</b> {service?.name}
          </p>
          <p>
            <b>Service Tier:</b> {serviceTierName}
          </p>
        </div>

        {/* WORK DETAILS */}
        <div className="border rounded-lg p-3 space-y-1 text-sm">
          <p>
            <b>Workers:</b> {booking?.numberOfWorkers}
          </p>

          <p>
            <b>Pricing Mode:</b> {booking?.pricingMode}
          </p>

          <p>
            <b>Rate:</b> {rate} {currency}{" "}
            {booking?.pricingMode === "HOURLY" ? "/hour" : "/day"}
          </p>

          <p>
            <b>Worked Duration:</b> {workedDuration}
          </p>
        </div>

        {/* PAYMENT */}
        <div className="border rounded-lg p-3 space-y-1 text-sm">
          <p className="font-semibold text-base">
            Final Amount:{" "}
            {Number(finalAmount).toFixed(2)} {currency}
          </p>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
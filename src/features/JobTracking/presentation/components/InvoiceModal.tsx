


interface Props {
  invoice: any;
  services: any[];
  categories: any[];
  serviceTiers?: any[];
  open: boolean;
  booking?:any;
  onClose: () => void;
}

export default function InvoiceModal({ invoice, booking, services, categories,  open, onClose }: Props) {
  if (!open) return null;

  // Get the service object
  const service = services?.find((s) => s._id === booking.serviceId);

  const categoryId = service?.category?.[0]?._id;
  const category = categories?.find((c) => c._id === categoryId);

  const pricingTier = service?.pricingTiers?.find(
    (tier: any) => tier.tierId === booking.serviceTierId
  );

  const tier = pricingTier?.tier;

  const workHours = invoice.actualWorkHours || 0;
  const hours = Math.floor(workHours);
  const minutes = Math.round((workHours - hours) * 60);

  const workedDuration =
    booking.pricingMode === "HOURLY"
      ? `${hours} hr ${minutes} min`
      : `${invoice.actualWorkDays} days`;
   console.log(workedDuration);
  const rate =
    booking.pricingMode === "HOURLY"
      ? pricingTier?.HOURLY?.ratePerHour
      : pricingTier?.PER_DAY?.ratePerDay;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl p-6 space-y-5">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Invoice Details</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        {/* BOOKING INFO */}
        <div className="space-y-2 text-sm">
          <p><b>Invoice No:</b> {invoice.invoiceNumber}</p>
          <p><b>Status:</b> {booking.status}</p>
          <p><b>Category:</b> {category?.name}</p>
          <p><b>Service:</b> {service?.name}</p>
          <p><b>Service Tier:</b> {tier?.displayName}</p>
        </div>

        {/* WORK DETAILS */}
       <div className="border rounded-lg p-3 space-y-1 text-sm">
  <p><b>Workers:</b> {booking.numberOfWorkers}</p>
  <p><b>Pricing Mode:</b> {booking.pricingMode}</p>
  <p><b>Rate:</b> {rate} {invoice.currency} {booking.pricingMode === "HOURLY" ? "/hour" : "/day"}</p>
  <p><b>Worked Duration:</b> {workedDuration}</p>
</div>

        {/* PAYMENT */}
        <div className="border rounded-lg p-3 space-y-1 text-sm">
          {/* <p><b>Original Amount:</b> {invoice.originalAmount} {invoice.currency}</p>
          <p><b>Worker Pool Amount:</b> {invoice.workerPoolAmount} {invoice.currency}</p>
          <p><b>Commission:</b> {invoice.commissionAmount} {invoice.currency}</p> */}
          <p className="font-semibold text-base">
            Final Amount: {invoice.finalAmount?.toFixed(2)} {invoice.currency}
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
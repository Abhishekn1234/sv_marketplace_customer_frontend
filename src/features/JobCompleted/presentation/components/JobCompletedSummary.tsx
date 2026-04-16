import { formatDates } from "@/features/Home/presentation/helpers/formatdatestring";

export default function JobCompletedSummary({ booking }: any) {
 
  const duration = booking?.schedule?.estimatedHours
    ? `${booking.schedule.estimatedHours}h`
    : "N/A";


  const price = booking?.totalCost || 0;
  const currency = booking?.currency || "₹";

  return (
    <div className="bg-white rounded-[20px] p-6 border border-gray-200 shadow-sm">

      <div className="flex justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Service Summary
        </h2>

        <span className="text-emerald-600 font-semibold">
          Completed
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-xs text-gray-500">Service</div>
          <div className="font-semibold">
            {booking?.serviceId?.name}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-xs text-gray-500">Tier</div>
          <div className="font-semibold">
            {booking?.serviceTierId?.displayName}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-xs text-gray-500">Start Date</div>
          <div className="font-semibold">
          {formatDates(booking?.schedule?.startDateTime) || "N/A"}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="text-xs text-gray-500">Duration</div>
          <div className="font-semibold">
            {duration}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl sm:col-span-2">
          <div className="text-xs text-gray-500">Work Description</div>
          <div className="font-semibold">
            {booking?.workDescription}
          </div>
        </div>

      </div>

      <div className="h-px bg-gray-200 my-6" />

      <div className="flex justify-between">
        <span className="font-semibold">Total Paid</span>
        <span className="text-emerald-600 font-bold">
          {currency} {price}
        </span>
      </div>
    </div>
  );
}
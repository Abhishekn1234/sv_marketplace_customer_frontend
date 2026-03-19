import { statusMessageMap } from "../helpers/statusmessagemapping";

export default function ConfirmationHeader({ data }: any) {
  const formattedStatus = data?.status
    ? data.status.charAt(0).toUpperCase() +
      data.status.slice(1).toLowerCase()
    : "";

  return (
    <div className="text-center">

      {/* Icon */}
      <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-emerald-100 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-12 h-12 text-emerald-500">
          <polyline
            points="20 6 9 17 4 12"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-2">
        Booking {formattedStatus}
      </h1>

      <p className="text-gray-500 mb-4">
        {statusMessageMap[data.status] || "Booking updated"}
      </p>

      {/* Reference */}
      <div className="inline-flex gap-3 px-4 py-2 border rounded-full bg-white">
        <span className="text-xs text-gray-400">Reference ID</span>
        <span className="font-bold">{data._id}</span>
      </div>
    </div>
    
  );
}
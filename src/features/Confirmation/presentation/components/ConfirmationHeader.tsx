export default function ConfirmationHeader({ status, id }: any) {
  const formattedStatus = status
    ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    : "";

  return (
    <>
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
        ✔
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Booking {formattedStatus}
      </h1>

      <div className="mt-4">
        <span className="text-sm font-bold">{id}</span>
      </div>
    </>
  );
}
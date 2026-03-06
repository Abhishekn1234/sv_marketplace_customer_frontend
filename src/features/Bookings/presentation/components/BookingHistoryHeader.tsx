export default function BookingHistoryHeader() {
  return (
    <div className="mb-8 sm:mb-10 lg:mb-12">
      <h1
        className="
        text-2xl
        sm:text-3xl
        lg:text-4xl
        font-bold
        text-gray-900
        leading-tight
        tracking-tight
      "
      >
        Booking History
      </h1>

      <p
        className="
        mt-2
        text-sm
        sm:text-base
        text-gray-500
        font-medium
        max-w-xl
      "
      >
        View and manage all your service bookings
      </p>
    </div>
  );
}
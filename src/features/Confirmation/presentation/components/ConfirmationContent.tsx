import ConfirmationHeader from "./ConfirmationHeader";
import BookingSummaryCard from "./BookingSummary";
import NextStepsSection from "./Nextstepsection";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useEffect } from "react";

export default function ConfirmationContent() {
  const { bookings, loading: isLoading ,refetch} = useBookings();

  const data = bookings?.[0];

  useEffect(() => {
 refetch()
}, []);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  const tierName =
    data?.serviceTier?.displayName ??
    data?.serviceTierId?.displayName ??
    "N/A";

  const duration =
    data?.pricingMode === "HOURLY"
      ? `${data?.schedule?.estimatedHours ?? 0} Hours`
      : `${data?.schedule?.estimatedDays ?? 0} Days`;

  return (
    <main className="p-6">

      <ConfirmationHeader status={data.status} id={data._id} />

      <BookingSummaryCard
        data={data}
        placeName="Loading..."
        tierName={tierName}
        duration={duration}
      />

      <NextStepsSection />

    </main>
  );
}
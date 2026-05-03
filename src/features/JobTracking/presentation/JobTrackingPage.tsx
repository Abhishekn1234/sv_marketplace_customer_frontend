import PageContainer from "@/components/common/PageContainer";
import JobTrackingContent from "./components/JobTrackingContent";
import JobTrackingHeader from "./components/JobTrackingHeader";
import { useParams } from "react-router-dom";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";

export default function JobTrackingPage() {
  const { bookingId } = useParams();

  const { bookings, loading } = useBookings();
  console.log(bookings);
  const booking = bookings?.find(
    (b) => String(b._id) === String(bookingId)
  );

  // loading state
  if (loading) {
    return (
      <PageContainer>
        <div className="text-center py-10 text-gray-500">
          Loading booking...
        </div>
      </PageContainer>
    );
  }

  // not found state (ONLY after loading finished)
  if (!booking) {
    return (
      <PageContainer>
        <div className="text-center py-10 text-red-500">
          Booking not found
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <JobTrackingHeader booking={booking} />
      <JobTrackingContent bookings={booking} loading={false} />
    </PageContainer>
  );
}
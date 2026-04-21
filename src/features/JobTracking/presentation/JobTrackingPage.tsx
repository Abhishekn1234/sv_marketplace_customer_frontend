import PageContainer from "@/components/common/PageContainer";
import JobTrackingContent from "./components/JobTrackingContent";
import JobTrackingHeader from "./components/JobTrackingHeader";
import { useParams } from "react-router-dom";
import { useBookingById } from "@/features/Bookings/presentation/hooks/useBookingById";

export default function JobTrackingPage() {
  const { bookingId } = useParams();

  const {
    booking: booking,
    loading:isLoading,
    
  } = useBookingById(bookingId);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="text-center py-10 text-gray-500">
          Loading booking...
        </div>
      </PageContainer>
    );
  }

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
      <JobTrackingContent bookings={booking} loading={isLoading} />
    </PageContainer>
  );
}
import PageContainer from "@/components/common/PageContainer";
import JobTrackingContent from "./components/JobTrackingContent";
import JobTrackingHeader from "./components/JobTrackingHeader";
import { useParams } from "react-router-dom";
import { useBookingDetail } from "@/features/Bookings/presentation/hooks/useBookingDetail";

export default function JobTrackingPage() {
  const { bookingId } = useParams();

  // ✅ Use optimized hook for instant UI without refetching
  const {
    booking,
    loading: isLoading,
  } = useBookingDetail(bookingId);
  console.log(booking);
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
      {/* Pass false to prevent reloading of timeline after initial load */}
      <JobTrackingContent bookings={booking} loading={false} />
    </PageContainer>
  );
}

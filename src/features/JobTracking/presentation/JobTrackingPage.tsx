import PageContainer from "@/components/common/PageContainer";
import JobTrackingContent from "./components/JobTrackingContent";
import JobTrackingHeader from "./components/JobTrackingHeader";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";

export default function JobTrackingPage() {
  const { bookings, loading } = useBookings();

  return (
    <PageContainer>
      <JobTrackingHeader bookings={bookings} />
      <JobTrackingContent bookings={bookings} loading={loading} />
    </PageContainer>
  );
}
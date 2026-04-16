import PageContainer from "@/components/common/PageContainer";
import JobTrackingContent from "./components/JobTrackingContent";
import JobTrackingHeader from "./components/JobTrackingHeader";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import { useLiveBooking } from "./hooks/useLiveBookings";


export default function JobTrackingPage() {
  const { bookings, loading } = useBookings();

  const liveBookings = useLiveBooking(bookings);

  return (
    <PageContainer>
      <JobTrackingHeader bookings={liveBookings} />
      <JobTrackingContent bookings={liveBookings} loading={loading} />
    </PageContainer>
  );
}
import PageContainer from "@/components/common/PageContainer";
import JobTrackingContent from "./components/JobTrackingContent";
import JobTrackingHeader from "./components/JobTrackingHeader";
import { useNavigate, useParams } from "react-router-dom";
import { useBookings } from "@/features/Bookings/presentation/hooks/useBookings";
import CommonSpinner from "@/components/common/CommonLoadingSpinner";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useLanguage } from "@/features/context/LanguageContext";

export default function JobTrackingPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
 const {isRTLOrder}=useLanguage();
  const { bookings, loading } = useBookings();

  const booking = bookings?.find(
    (b) => String(b._id) === String(bookingId)
  );

  // =========================
  // REDIRECT HANDLING
  // =========================
  useEffect(() => {
  if (!loading && !booking) {
    toast.error("Booking not found or already finished");

    const timer = setTimeout(() => {
      navigate("/bookings", { replace: true });
    }, 800);

    return () => clearTimeout(timer);
  }
}, [loading, booking, navigate]);

if (!loading && !booking) {
  return (
    <PageContainer>
      <CommonSpinner center size={20}/>
    </PageContainer>
  );
}

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center py-10">
          <CommonSpinner size={20} />
        </div>
      </PageContainer>
    );
  }

  // =========================
  // SAFE RENDER (important guard)
  // =========================
  if (!booking) {
    return (
      <PageContainer>
        <div className="flex justify-center items-center py-10">
          <CommonSpinner size={18} />
        </div>
      </PageContainer>
    );
  }

  return (
    <div dir={isRTLOrder?"rtl":""}>
    <PageContainer>
      <JobTrackingHeader booking={booking} />
      <JobTrackingContent bookings={booking} loading={false} />
    </PageContainer>
    </div>
  );
}
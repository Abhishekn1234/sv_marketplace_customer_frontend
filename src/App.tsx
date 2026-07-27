import { Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./features/context/LanguageContext";
import { ToastContainer } from "react-toastify";
import { lazy, Suspense, useEffect, useState } from "react";
import { useAuthStore } from "./features/core/store/auth";
import { initializeSocket } from "./features/core/Websocket/socket";
import { useRegisterDeviceToken } from "./features/Notifications/presentation/hooks/useRegisterDeviceToken";

import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Layouts
import DashboardLayout from "./features/Layout/DashboardLayout";
import { ProtectedRoute } from "./ProtectedLayout";
import ScrollToTop from "./ScrollToTop";
import NotificationNavigation from "./NavigationNotification";
import PreventBackNavigation from "./PreventNavgiation";
import CommonSpinner from "./components/common/CommonLoadingSpinner";



// Lazy loaded components
const WebsiteHome = lazy(() => import("./features/Home/presentation/Homepage"));
const MyBookings = lazy(() => import("./features/Bookings/presentation/MyBookings"));
const Profile = lazy(() => import("./features/Profile/presentation/ProfilePage"));
const LoginLayout = lazy(() => import("./features/Auth/presentation/components/auth/Login/LoginLayout"));
const RegisterLayout = lazy(() => import("./features/Auth/presentation/components/auth/Register/RegisterLayout"));
const LanguagePage = lazy(() => import("./features/Auth/presentation/components/Language/presentation/LanguagePage"));
const LocationPage = lazy(() => import("./features/Auth/presentation/components/Location/presentation/LocationPage"));
const VerificationPage = lazy(() => import("./features/Auth/presentation/components/Verification/presentation/VerificationPage"));
const PrivacyPolicyPage = lazy(() => import("./features/Privacy/presentation/privacy.page"));
const AboutPage = lazy(() => import("./features/AboutUs/presentation/AboutPage"));
const ServiceDetailPage = lazy(() => import("./features/ServiceDetails/presentation/ServiceDetail.page"));
const ServiceTierSelectionPage = lazy(() => import("./features/ServiceTierSelection/presentation/ServiceTierSelectionPage"));
const BookingDetailPage = lazy(() => import("./features/BookingDetail/presentation/BookingDetailPage"));
const JobTrackingPage = lazy(() => import("./features/JobTracking/presentation/JobTrackingPage"));
const JobProgressPage = lazy(() => import("./features/JobProgress/presentation/JobProgressPage"));
const ConfirmationPage = lazy(() => import("./features/Confirmation/presentation/ConfirmationPage"));
const ChangePasswordPage = lazy(() => import("./features/ChangePassword/presentation/ChangePasswordPage"));
const HelpPage = lazy(() => import("./features/Help/presentation/HelpPage"));
const SecurityPage = lazy(() => import("./features/Security/presentation/SecurityPage"));
const ServiceRating = lazy(() => import("./features/ServiceRating/presentation/ServiceRating"));
const JobCompletedPage = lazy(() => import("./features/JobCompleted/presentation/JobCompletedPage"));
const ForgotPasswordLayout = lazy(() => import("./features/Auth/presentation/components/ForgotPassword/presentation/components/ForgotPasswordLayout"));
const NotificationsPage = lazy(() => import("./features/Notifications/presentation/NotificationsPage"));
const CookiePolicyPage = lazy(() => import("./features/CookiePolicy/presentation/CookiePolicyPage"));
const Disputepage = lazy(() => import("./features/Disputes/presentation/Disputepage"));
const ListDisputes = lazy(() => import("./features/Disputes/presentation/components/ListDisputes"));
const PaymentPage = lazy(() => import("./features/Payment/presentation/Paymentpage"));
const PaymentCallbackPage = lazy(() => import("./features/Payment/presentation/components/PaymentCallbackPage"));
const InvoicePrintPage = lazy(() => import("./features/JobTracking/presentation/components/InvoicePrintPage"));
const WorkerChatPage = lazy(() => import("./features/WorkerChat/presentation/WorkerChatPage"));
const VideoCallPage = lazy(() => import("./features/WorkerChat/presentation/components/VideoCall"));
const AIChatPage = lazy(() => import("./features/JobTracking/presentation/components/AIChatWindow"));
const PaymentStripeCallbackPage = lazy(() => import("./features/Payment/presentation/components/PaymentStripeCallbackPage"));
const PaymentStripeCallbackFailurePage = lazy(() => import("./features/Payment/presentation/components/PaymentStripeCallbackFailurePage"));
const FavoritesPage = lazy(() => import("./features/Favorites/presentation/FavoritesPage"));
const ReviewsPage = lazy(() => import("./features/Reviews/presentation/ReviewsPage"));

function App() {
  const { accessToken, isLoggedIn } = useAuthStore();
  useRegisterDeviceToken(Boolean(isLoggedIn && accessToken));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    navigator.serviceWorker.getRegistrations().then(regs =>
      console.log(
        regs.map(r => ({
          scope: r.scope,
          script: r.active?.scriptURL
        }))
      )
    );
  }, []);

  useEffect(() => {
    if (isLoggedIn && accessToken) {
      initializeSocket(accessToken);
    }
  }, [isLoggedIn, accessToken]);

  return (
    <LanguageProvider>
      <ScrollToTop />
      <NotificationNavigation />

      <ToastContainer
        position={isMobile ? "top-right" : "top-right"}
        autoClose={3000}
        theme="light"
        toastStyle={{
          width: isMobile ? "calc(100vw - 24px)" : "380px",
          maxWidth: "100%",
        }}
      />

      <Suspense fallback={
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
   
  }}>
    <CommonSpinner />
  </div>
}>
        <Routes>
          {/* Invoice Page (No Dashboard Layout) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<PreventBackNavigation />}>
              <Route path="/invoice/:id" element={<InvoicePrintPage />} />
            </Route>
          </Route>

          {/* Dashboard Layout */}
          <Route element={<DashboardLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<WebsiteHome />} />
            <Route path="/login" element={<LoginLayout />} />
            <Route path="/register" element={<RegisterLayout />} />
            <Route path="/language" element={<LanguagePage />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordLayout />} />
            <Route path="/verification" element={<VerificationPage />} />
            <Route path="/cookiepolicy" element={<CookiePolicyPage />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/servicetierselection/:id" element={<ServiceTierSelectionPage />} />
            <Route path="/bookingdetail/:serviceId/:serviceTierId" element={<BookingDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/disputes" element={<ListDisputes />} />
              <Route path="/dispute/:bookingId" element={<Disputepage />} />
              <Route path="/jobtracking/:bookingId" element={<JobTrackingPage />} />
              <Route path="/jobprogress/:bookingId" element={<JobProgressPage />} />
              <Route path="/video-call/:workerId" element={<VideoCallPage />} />
              <Route path="/message/:bookingId" element={<WorkerChatPage />} />
              <Route path="/chat" element={<AIChatPage />} />
              <Route path="/confirmation/:bookingId" element={<ConfirmationPage />} />
              <Route path="/servicerating/:bookingId" element={<ServiceRating />} />
              <Route path="/changepassword" element={<ChangePasswordPage />} />

              <Route element={<PreventBackNavigation />}>
                <Route path="/payment/callback" element={<PaymentCallbackPage />} />
                <Route path="/payment/success" element={<PaymentStripeCallbackPage />} />
                <Route path="/payment/failure" element={<PaymentStripeCallbackFailurePage />} />
                <Route path="/jobcompleted" element={<JobCompletedPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </LanguageProvider>
  );
}

export default App;
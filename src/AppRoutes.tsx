import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./features/Layout/DashboardLayout";
import { ProtectedRoute } from "./ProtectedLayout";
import PreventBackNavigation from "./PreventNavgiation";

import WebsiteHome from "./features/Home/presentation/Homepage";
import MyBookings from "./features/Bookings/presentation/MyBookings";
import Profile from "./features/Profile/presentation/ProfilePage";
import LoginLayout from "./features/Auth/presentation/components/auth/Login/LoginLayout";
import RegisterLayout from "./features/Auth/presentation/components/auth/Register/RegisterLayout";
import LanguagePage from "./features/Auth/presentation/components/Language/presentation/LanguagePage";
import LocationPage from "./features/Auth/presentation/components/Location/presentation/LocationPage";
import VerificationPage from "./features/Auth/presentation/components/Verification/presentation/VerificationPage";
import PrivacyPolicyPage from "./features/Privacy/presentation/privacy.page";
import AboutPage from "./features/AboutUs/presentation/AboutPage";
import ServiceDetailPage from "./features/ServiceDetails/presentation/ServiceDetail.page";
import ServiceTierSelectionPage from "./features/ServiceTierSelection/presentation/ServiceTierSelectionPage";
import BookingDetailPage from "./features/BookingDetail/presentation/BookingDetailPage";
import JobTrackingPage from "./features/JobTracking/presentation/JobTrackingPage";
import JobProgressPage from "./features/JobProgress/presentation/JobProgressPage";
import ConfirmationPage from "./features/Confirmation/presentation/ConfirmationPage";
import ChangePasswordPage from "./features/ChangePassword/presentation/ChangePasswordPage";
import HelpPage from "./features/Help/presentation/HelpPage";
import SecurityPage from "./features/Security/presentation/SecurityPage";
import ServiceRating from "./features/ServiceRating/presentation/ServiceRating";
import JobCompletedPage from "./features/JobCompleted/presentation/JobCompletedPage";
import ForgotPasswordLayout from "./features/Auth/presentation/components/ForgotPassword/presentation/components/ForgotPasswordLayout";
import NotificationsPage from "./features/Notifications/presentation/NotificationsPage";
import CookiePolicyPage from "./features/CookiePolicy/presentation/CookiePolicyPage";
import Disputepage from "./features/Disputes/presentation/Disputepage";
import ListDisputes from "./features/Disputes/presentation/components/ListDisputes";
import PaymentPage from "./features/Payment/presentation/Paymentpage";
import PaymentCallbackPage from "./features/Payment/presentation/components/PaymentCallbackPage";
import InvoicePrintPage from "./features/JobTracking/presentation/components/InvoicePrintPage";
import WorkerChatPage from "./features/WorkerChat/presentation/WorkerChatPage";
import VideoCallPage from "./features/WorkerChat/presentation/components/VideoCall";
import AIChatPage from "./features/JobTracking/presentation/components/AIChatWindow";
import PaymentStripeCallbackPage from "./features/Payment/presentation/components/PaymentStripeCallbackPage";
import PaymentStripeCallbackFailurePage from "./features/Payment/presentation/components/PaymentStripeCallbackFailurePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<PreventBackNavigation />}>
          <Route path="/invoice/:id" element={<InvoicePrintPage />} />
        </Route>
      </Route>

      <Route element={<DashboardLayout />}>
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

        <Route element={<ProtectedRoute />}>
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<Profile />} />
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
  );
}

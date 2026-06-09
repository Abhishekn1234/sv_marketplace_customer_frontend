import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./features/context/themeContext";
import { LanguageProvider } from "./features/context/LanguageContext";
import { ToastContainer } from "react-toastify";

import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { useEffect } from "react";
import { useAuthStore } from "./features/core/store/auth";
import { initializeSocket } from "./features/core/Websocket/socket";
import { useRegisterDeviceToken } from "./features/Notifications/presentation/hooks/useRegisterDeviceToken";

import DashboardLayout from "./features/Layout/DashboardLayout";
import { ProtectedRoute } from "./ProtectedLayout";

import WebsiteHome from "./features/Home/presentation/DashboardHome";
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
import ScrollToTop from "./ScrollToTop";
import NotificationNavigation from "./NavigationNotification";
import { listenMessages } from "./features/Auth/presentation/components/Location/presentation/hooks/handleLocationchange";
// import { useBrowserNotifications } from "./features/Notifications/presentation/hooks/useBrowserNotifications";

function App() {
  const { accessToken, isLoggedIn } = useAuthStore();
  useRegisterDeviceToken(Boolean(isLoggedIn && accessToken));
  listenMessages();

//  useBrowserNotifications();
  // =========================
  // SOCKET INIT
  // =========================
  navigator.serviceWorker.getRegistrations().then((regs) => {
  regs.forEach((r) => {
    console.log(r.scope);
  });
});
  useEffect(() => {
    if (isLoggedIn && accessToken) {
      initializeSocket(accessToken);
    }
  }, [isLoggedIn, accessToken]);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <ScrollToTop />
        <NotificationNavigation />

        <ToastContainer
          position="top-right"
          autoClose={3000}
          theme="light"
        />

        <Routes>
          <Route
            path="/invoice/:id"
            element={<InvoicePrintPage />}
          />

          <Route element={<DashboardLayout />}>
            <Route path="/login" element={<LoginLayout />} />
            <Route path="/register" element={<RegisterLayout />} />
            <Route
              path="/language"
              element={<LanguagePage />}
            />
            <Route
              path="/location"
              element={<LocationPage />}
            />
            <Route
              path="/forgot-password"
              element={<ForgotPasswordLayout />}
            />
            <Route
              path="/verification"
              element={<VerificationPage />}
            />
            <Route
              path="/cookiepolicy"
              element={<CookiePolicyPage />}
            />

            <Route element={<ProtectedRoute />}>
              <Route index element={<WebsiteHome />} />
              <Route
                path="notifications"
                element={<NotificationsPage />}
              />
              <Route
                path="bookings"
                element={<MyBookings />}
              />
              <Route path="profile" element={<Profile />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="help" element={<HelpPage />} />
              <Route path="security" element={<SecurityPage />} />
              <Route path="payment" element={<PaymentPage />} />
              <Route
                path="payment/callback"
                element={<PaymentCallbackPage />}
              />
              <Route
                path="disputes"
                element={<ListDisputes />}
              />
              <Route
                path="dispute/:bookingId"
                element={<Disputepage />}
              />
              <Route
                path="jobtracking/:bookingId"
                element={<JobTrackingPage />}
              />
              <Route
                path="jobprogress/:bookingId"
                element={<JobProgressPage />}
              />
              <Route
                path="video-call/:workerId"
                element={<VideoCallPage />}
              />
              <Route
                path="message/:bookingId"
                element={<WorkerChatPage />}
              />
              <Route path="chat" element={<AIChatPage />} />
              <Route
                path="privacy"
                element={<PrivacyPolicyPage />}
              />
              <Route
                path="confirmation/:bookingId"
                element={<ConfirmationPage />}
              />
              <Route
                path="servicetierselection/:id"
                element={<ServiceTierSelectionPage />}
              />
              <Route
                path="bookingdetail/:serviceId/:serviceTierId"
                element={<BookingDetailPage />}
              />
              <Route
                path="services/:id"
                element={<ServiceDetailPage />}
              />
              <Route
                path="servicerating/:bookingId"
                element={<ServiceRating />}
              />
              <Route
                path="jobcompleted"
                element={<JobCompletedPage />}
              />
              <Route
                path="changepassword"
                element={<ChangePasswordPage />}
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

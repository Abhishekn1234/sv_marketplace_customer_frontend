import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./features/context/themeContext";
import { LanguageProvider } from "./features/context/LanguageContext";
import { ToastContainer } from "react-toastify";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";

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
import PaymentPage from "./features/Payment/presentation/Paymentpage";
import PaymentCallbackPage from "./features/Payment/presentation/components/PaymentCallbackPage";
import ListDisputes from "./features/Disputes/presentation/components/ListDisputes";

import { useNotification } from "./features/utils/useNotification";
import { useEffect } from "react";
import "./App.css";

import { useAuthStore } from "./features/core/store/auth";
import { initializeSocket } from "./features/core/Websocket/socket";
import ScrollToTop from "./ScrollToTop";

/* 🔥 ADD THESE */
import { requestAndGetToken, initOnMessage } from "@/components/firebase/notifications";
import InvoicePrintPage from "./features/JobTracking/presentation/components/InvoicePrintPage";

function App() {
  const { accessToken, isLoggedIn } = useAuthStore();

  useNotification(); // your existing hook

  /* ✅ SERVICE WORKER + NOTIFICATION INIT */
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        if (!("serviceWorker" in navigator)) return;

        // Register service worker
        const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        console.log("✅ SW registered:", reg);

        // Request permission
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          console.warn("❌ Notification permission denied");
          return;
        }

        console.log("✅ Notification permission granted");

        // Get FCM token
        const token = await requestAndGetToken();
        console.log("🔥 FCM Token:", token);

        // Listen for foreground messages
        initOnMessage();

      } catch (err) {
        console.error("❌ Notification setup error:", err);
      }
    };

    setupNotifications();
  }, []);

  /* ✅ SOCKET INIT */
  useEffect(() => {
    if (isLoggedIn && accessToken) {
      initializeSocket(accessToken);
    }
  }, [isLoggedIn, accessToken]);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
            draggable
            theme="light"
            style={{ top: "80px", right: "20px" }}
            toastClassName="rounded-xl shadow-lg border border-gray-200"
            className="text-sm font-medium"
          />

          <Routes>
             <Route path="/invoice/:id" element={<InvoicePrintPage />} />
            <Route element={<DashboardLayout />}>
              {/* Public */}
              <Route path="/login" element={<LoginLayout />} />
              <Route path="/register" element={<RegisterLayout />} />
              <Route path="/language" element={<LanguagePage />} />
              <Route path="/location" element={<LocationPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordLayout />} />
              <Route path="/verification" element={<VerificationPage />} />
              <Route path="/cookiepolicy" element={<CookiePolicyPage />} />
              

              {/* Protected */}
              <Route element={<ProtectedRoute />}>
                <Route index element={<WebsiteHome />} />
                <Route path="bookingdetail/:serviceId/:serviceTierId" element={<BookingDetailPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="changepassword" element={<ChangePasswordPage />} />
                <Route path="servicetierselection/:id" element={<ServiceTierSelectionPage />} />
                <Route path="bookings" element={<MyBookings />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="servicerating/:bookingId" element={<ServiceRating />} />
                <Route path="jobcompleted" element={<JobCompletedPage />} />
                <Route path="services/:id" element={<ServiceDetailPage />} />
                <Route path="privacy" element={<PrivacyPolicyPage />} />
                <Route path="payment" element={<PaymentPage />} />
                <Route path="disputes" element={<ListDisputes />} />
                <Route path="payment/callback" element={<PaymentCallbackPage />} />
                <Route path="dispute/:bookingId" element={<Disputepage />} />
                <Route path="help" element={<HelpPage />} />
                <Route path="security" element={<SecurityPage />} />
                <Route path="profile" element={<Profile />} />
                <Route path="jobtracking/:bookingId" element={<JobTrackingPage />} />
                <Route path="jobprogress/:bookingId" element={<JobProgressPage />} />
                
                <Route path="confirmation/:bookingId" element={<ConfirmationPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
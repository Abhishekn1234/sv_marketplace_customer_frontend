import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./features/context/themeContext";
import "leaflet/dist/leaflet.css";
import "react-toastify/ReactToastify.css";
import { ToastContainer } from "react-toastify";



import DashboardLayout from "./features/Layout/DashboardLayout";
import WebsiteHome from "./features/Home/presentation/DashboardHome";
import BookService from "./features/Bookings/presentation/components/bookings/BookService";
import MyBookings from "./features/Bookings/presentation/MyBookings";



import { ProtectedRoute } from "./ProtectedLayout";

import './App.css';
import { useNotification } from "./features/utils/useNotification";


import LoginLayout from "./features/Auth/presentation/components/auth/Login/LoginLayout";
import LanguagePage from "./features/Auth/presentation/components/Language/presentation/LanguagePage";
import LocationPage from "./features/Auth/presentation/components/Location/presentation/LocationPage";
import Profile from "./features/Profile/presentation/ProfilePage";

import RegisterLayout from "./features/Auth/presentation/components/auth/Register/RegisterLayout";
import { LanguageProvider } from "./features/context/LanguageContext";
import VerificationPage from "./features/Auth/presentation/components/Verification/presentation/VerificationPage";
import PrivacyPolicyPage from "./features/Privacy/presentation/privacy.page";
import AboutPage from "./features/AboutUs/presentation/AboutPage";
import ServiceDetailPage from "./features/ServiceDetails/presentation/ServiceDetail.page";
import ServiceTierSelectionPage from "./features/ServiceTierSelection/presentation/ServiceTierSelectionPage";
import BookingDetailPage from "./features/BookingDetail/presentation/BookingDetailPage";
import JobTrackingPage from "./features/JobTracking/presentation/JobTrackingPage";
import JobProgressPage from "./features/JobProgress/presentation/JobProgressPage";
import ConfirmationPage from "./features/Confirmation/presentation/ConfirmationPage";
import { useEffect } from "react";
import ScrollToTop from "./ScrollToTop";
import ChangePasswordPage from "./features/ChangePassword/presentation/ChangePasswordPage";
import HelpPage from "./features/Help/presentation/HelpPage";
import SecurityPage from "./features/Security/presentation/SecurityPage";
import ServiceRating from "./features/ServiceRating/presentation/ServiceRating";
import JobCompletedPage from "./features/JobCompleted/presentation/JobCompletedPage";
import ForgotPasswordLayout from "./features/Auth/presentation/components/ForgotPassword/presentation/components/ForgotPasswordLayout";
import NotificationsPage from "./features/Notifications/presentation/NotificationsPage";

function App() {
  useNotification();

useEffect(()=>{

})
  return (
    <ThemeProvider>
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
     <LanguageProvider>
      <Router>
          <ScrollToTop />
    <Routes>
  {/* Public pages */}
  <Route path="/login" element={<LoginLayout />} />
  <Route path="/register" element={<RegisterLayout />} />
  <Route path="/language" element={<LanguagePage />} />
  <Route path="/location" element={<LocationPage />} />
  
  <Route path="/forgot-password" element={<ForgotPasswordLayout />} />
 <Route path="/verification" element={<VerificationPage/>}/>
  {/* Protected pages */}
  <Route path="/" element={<ProtectedRoute><DashboardLayout  /></ProtectedRoute>}>
    <Route index element={<WebsiteHome />} />
    <Route path="bookingdetail/:serviceId/:serviceTierId"element={<BookingDetailPage/>}/>
    <Route path="notifications" element={<NotificationsPage/>}/>
    <Route path="changepassword" element={<ChangePasswordPage/>}/>
    <Route path="servicetierselection/:id" element={<ServiceTierSelectionPage/>}/>
    <Route path="bookings" element={<MyBookings/>}/>
    <Route path="about" element={<AboutPage/>}/>
    <Route path="servicerating" element={<ServiceRating/>}/>
    <Route path="jobcompleted" element={<JobCompletedPage/>}/>
    <Route path="services/:id" element={<ServiceDetailPage/>}/>
    <Route path="privacy" element={<PrivacyPolicyPage/>}/>
      <Route path="help" element={<HelpPage/>}/>
        <Route path="security" element={<SecurityPage/>}/>
    <Route path="profile" element={<Profile/>}/>
    <Route path="book-service/:serviceId" element={<BookService />} />
     <Route path="jobtracking/:bookingId" element={<JobTrackingPage />} />
     <Route path="jobprogress" element={<JobProgressPage />} />
     <Route path="confirmation/:bookingId" element={<ConfirmationPage/>}/>
  </Route>

  {/* Catch-all */}
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>

      </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

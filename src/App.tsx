import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./features/context/themeContext";
import "leaflet/dist/leaflet.css";
import "react-toastify/ReactToastify.css";
import {ToastContainer} from "react-toastify";
/* AUTH */
import Login from "./features/Auth/presentation/components/auth/Login";
import Register from "./features/Auth/presentation/components/auth/Register";

import ForgotPassword from "./features/Auth/presentation/components/auth/ForgotPassword";

// /* DASHBOARD */
import DashboardLayout from "./features/Layout/DashboardLayout";
import WebsiteHome from "./features/Home/presentation/DashboardHome";

import BookService from "./features/Bookings/presentation/components/bookings/BookService";
import MyBookings from "./features/Bookings/presentation/MyBookings";
import Profile from "./features/Profile/presentation/Profile";


// /* AUTH LOGIC */
import { useAuth } from "./features/Auth/presentation/hooks/useAuth";
import { ProtectedRoute } from "./ProtectedLayout";

import './App.css';

function App() {
  const { logout } = useAuth();

  return (
    <ThemeProvider>
      <ToastContainer position="top-right" />

      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout onLogout={logout} />
              </ProtectedRoute>
            }
          >
            <Route index element={<WebsiteHome />} />
            <Route path="book-service/:serviceId" element={<BookService />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* 🔥 Global Modal */}

    </ThemeProvider>
  );
}


export default App;


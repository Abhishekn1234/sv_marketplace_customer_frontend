"use client";

import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";

import BookingSummary from "./BookingSummary";
import WhatsNext from "./WhatsNext";

import { ArrowRight, Calendar, Home } from "lucide-react";
import { statusMessageMap } from "../helpers/statusmessagemapping";

import { useLanguage } from "@/features/context/LanguageContext";
import { useServices } from "@/features/Bookings/presentation/hooks/useServices";
import { useBookingById } from "@/features/Bookings/presentation/hooks/useBookingById";
import Button from "@/components/input/Button";

export default function ConfirmationContent() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { bookingId } = useParams<{ bookingId: string }>();

  // ✅ SINGLE BOOKING (NOT LIST)
  const { booking: data, loading} = useBookingById(bookingId);
 console.log("Booking Data in ConfirmationContent:", data);
  const [placeName, setPlaceName] = useState("Loading...");
  const [showLoader, setShowLoader] = useState(true);

  const { serviceTiers } = useServices();

  // -----------------------------
  // LOCATION FORMAT
  // -----------------------------
  useEffect(() => {
    if (!data?.location?.coordinates?.length) return;

    const [lng, lat] = data.location.coordinates;
    setPlaceName(`Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`);
  }, [data]);

  // -----------------------------
  // LOADER CONTROL
  // -----------------------------
  useEffect(() => {
    if (!loading && data) {
      const timer = setTimeout(() => setShowLoader(false), 400);
      return () => clearTimeout(timer);
    }
  }, [loading, data]);

  // -----------------------------
  // TIER NAME
  // -----------------------------
  const tierName = useMemo(() => {
    if (!serviceTiers || !data) return "N/A";

    return (
      serviceTiers.find((tier: any) => tier._id === data.serviceTierId)
        ?.displayName ?? "N/A"
    );
  }, [serviceTiers, data]);

  // -----------------------------
  // STATUS FORMAT
  // -----------------------------
  const formattedStatus = data?.status
    ? data.status.charAt(0).toUpperCase() + data.status.slice(1).toLowerCase()
    : "";

  // -----------------------------
  // ERROR STATE
  // -----------------------------
 

  // -----------------------------
  // LOADING STATE
  // -----------------------------
  if (showLoader || !data) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-81px)] bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">
            {t.confirmationpage.loading}
          </p>
        </div>
      </div>
    );
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <main className="animate-fadeIn flex flex-col items-center justify-center min-h-[calc(100vh-81px)] px-4 sm:px-6 py-8 sm:py-12 bg-gray-50">
      <div className="max-w-[700px] w-full text-center">

        {/* Success Icon */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 sm:mb-8 rounded-full bg-emerald-100 border-4 border-emerald-200 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-10 h-10 sm:w-14 sm:h-14 text-emerald-500"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          {t.confirmationpage.booking} {formattedStatus}
        </h1>

        {/* Status message */}
        <p className="text-base sm:text-lg text-gray-500 font-medium mb-8">
          {statusMessageMap[data.status] || "Booking status updated."}
        </p>

        {/* Reference ID */}
        <div className="inline-flex items-center gap-3 px-5 py-3 mb-8 bg-white border-2 border-gray-200 rounded-full shadow-sm">
          <span className="text-xs font-bold uppercase text-gray-400">
            {t.confirmationpage.referenceId}
          </span>
          <span className="text-sm font-bold text-gray-900">
            {data._id}
          </span>
        </div>

        {/* Booking Summary */}
        <BookingSummary
          data={data}
          placeName={placeName}
          tierName={tierName}
        />

        {/* Track Job */}
        <Button
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition mb-6"
          onClick={() => navigate(`/jobtracking/${data._id}`)}
        >
          <span className="flex gap-3 justify-center items-center">
            {t.confirmationpage.trackJob}
            <ArrowRight className="w-5" />
          </span>
        </Button>

        {/* Links */}
        <div className="flex justify-center gap-8 mb-10 text-sm font-bold uppercase">
          <Link to="/" className="hover:text-blue-600 flex items-center gap-2">
            <Home className="w-5" />
            {t.confirmationpage.returnHome}
          </Link>

          <Link to="/bookings" className="hover:text-blue-600 flex items-center gap-2">
            <Calendar className="w-5" />
            {t.confirmationpage.viewBookings}
          </Link>
        </div>

        {/* Whats Next */}
        <WhatsNext />

      </div>
    </main>
  );
}
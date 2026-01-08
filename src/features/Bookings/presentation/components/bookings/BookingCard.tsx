import { Calendar, DollarSign, MapPin, Clock, Users, Eye } from "lucide-react";
import type { Booking } from "../../../domain/entities/booking.types";
import { StatusBadge } from "./StatusBadge";

interface BookingCardProps {
  booking: Booking;
  serviceName: string;
  onViewDetails: () => void;
}

export const BookingCard = ({ booking, serviceName, onViewDetails }: BookingCardProps) => {
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Not scheduled";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short'
    }).format(date);
  };

  const getTimeSince = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-semibold text-gray-900">
                {serviceName}
              </h4>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                #{booking._id?.slice(-8)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(booking.schedule?.startDateTime || booking.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{formatCurrency(booking.amount, booking.currency)}</span>
              </div>
              {booking.numberOfWorkers > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{booking.numberOfWorkers} workers</span>
                </div>
              )}
              {booking.schedule?.estimatedDays && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{booking.schedule.estimatedDays} days</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={booking.status} />
            <button
              onClick={onViewDetails}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Created {getTimeSince(booking.createdAt)}
          </div>
          {booking.location?.coordinates && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="truncate max-w-xs">Location available</span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View Invoice
          </button>
          <span className="text-gray-300">•</span>
          <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
            Message Provider
          </button>
          {booking.status === "REQUESTED" && (
            <>
              <span className="text-gray-300">•</span>
              <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
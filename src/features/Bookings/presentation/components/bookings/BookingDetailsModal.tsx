import { X, Calendar, DollarSign,  MapPin,  FileText, Package, MessageCircle } from "lucide-react";
import type { Booking } from "../../../domain/entities/booking.types";

interface BookingDetailsModalProps {
  booking: Booking;
  serviceName: string;
  onClose: () => void;
}

export const BookingDetailsModal = ({ booking, serviceName, onClose }: BookingDetailsModalProps) => {
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return "Not scheduled";
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  const statusColors = {
    REQUESTED: "bg-amber-100 text-amber-800",
    ACTIVE: "bg-emerald-100 text-emerald-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-gray-100 text-gray-800",
    CANCELLED: "bg-red-100 text-red-800"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{serviceName}</h2>
              <p className="text-gray-600">Booking #{booking._id?.slice(-8)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[booking.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
              {booking.status}
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 mb-1">Amount</p>
              <p className="text-lg font-semibold text-blue-900">
                {formatCurrency(booking.amount, booking.currency)}
              </p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-amber-600 mb-1">Workers</p>
              <p className="text-lg font-semibold text-amber-900">
                {booking.numberOfWorkers}
              </p>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-sm text-emerald-600 mb-1">Estimated Days</p>
              <p className="text-lg font-semibold text-emerald-900">
                {booking.schedule?.estimatedDays || "N/A"}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 mb-1">Pricing Mode</p>
              <p className="text-lg font-semibold text-purple-900 capitalize">
                {booking.pricingMode.replace("_", " ").toLowerCase()}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Schedule Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date</span>
                    <span className="font-medium">
                      {formatDateTime(booking.schedule?.startDateTime || booking.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created On</span>
                    <span className="font-medium">
                      {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium">
                      {new Date(booking.updatedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Service Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Tier</span>
                    <span className="font-medium">
                      {booking.serviceTier?.name || "Standard"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service ID</span>
                    <span className="font-mono text-sm">
                      {booking.serviceId?.slice(-6)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-medium">
                      {formatCurrency(booking.amount, booking.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currency</span>
                    <span className="font-medium uppercase">
                      {booking.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Status</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                      {booking.status || "Pending"}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location
                </h3>
                {booking.location?.coordinates ? (
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Latitude: {booking.location.coordinates[1].toFixed(6)}</p>
                    <p>Longitude: {booking.location.coordinates[0].toFixed(6)}</p>
                    <p className="text-xs mt-2">
                      Note: Exact address available in main booking view
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">No location specified</p>
                )}
              </div>
            </div>
          </div>

          {/* Work Description */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Work Description
            </h3>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700">
                {booking.workDescription || "No description provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              View Full Details
            </button>
            <button className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Contact Support
            </button>
            <button className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              Download Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
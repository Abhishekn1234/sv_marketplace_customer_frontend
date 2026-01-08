import { useState, useMemo } from "react";
import { Calendar, ChevronRight } from "lucide-react";
import type { Booking, ServiceRef } from "../../../domain/entities/booking.types";
import { BookingFilters, type BookingFilters as FiltersType } from "./BookingFilters";
import { BookingCard } from "./BookingCard";
import { BookingDetailsModal } from "./BookingDetailsModal";

interface AllBookingsListProps {
  bookings: Booking[];
  services: ServiceRef[];
  limit?: number;
}

export const AllBookingsList = ({ bookings, services, limit = 3 }: AllBookingsListProps) => {
  const [viewAll, setViewAll] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filters, setFilters] = useState<FiltersType>({
    search: "",
    status: "",
    dateRange: { start: "", end: "" },
    sortBy: "newest"
  });

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(booking => {
        const serviceName = getServiceName(booking).toLowerCase();
        const bookingId = booking._id.toLowerCase();
        const description = (booking.workDescription || "").toLowerCase();
        
        return serviceName.includes(searchLower) || 
               bookingId.includes(searchLower) || 
               description.includes(searchLower);
      });
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(booking => booking.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      result = result.filter(booking => {
        const bookingDate = new Date(booking.createdAt);
        const start = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const end = filters.dateRange.end ? new Date(filters.dateRange.end) : null;

        if (start && bookingDate < start) return false;
        if (end && bookingDate > end) return false;
        return true;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "amount_high":
          return b.amount - a.amount;
        case "amount_low":
          return a.amount - b.amount;
        case "status":
          const statusOrder = { REQUESTED: 0, CONFIRMED: 1, ACTIVE: 2, COMPLETED: 3, CANCELLED: 4 };
          const statusA = statusOrder[a.status as keyof typeof statusOrder] || 5;
          const statusB = statusOrder[b.status as keyof typeof statusOrder] || 5;
          return statusA - statusB;
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [bookings, filters]);

  const displayedBookings = viewAll ? filteredBookings : filteredBookings.slice(0, limit);

  const getServiceName = (booking: Booking) => {
    const service = services.find(s => String(s._id) === String(booking.serviceId));
    return service?.name || "Unknown Service";
  };

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
          <p className="text-gray-600">
            {filteredBookings.length} of {bookings.length} bookings
          </p>
        </div>
        <button 
          onClick={() => setViewAll(!viewAll)}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          {viewAll ? "Show Less" : "View All"} 
          <ChevronRight className={`w-4 h-4 transition-transform ${viewAll ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Filters */}
      <BookingFilters onFilterChange={setFilters} />

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm font-medium text-blue-700 mb-1">Active</p>
          <p className="text-2xl font-bold text-blue-900">
            {bookings.filter(b => b.status === "ACTIVE").length}
          </p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4">
          <p className="text-sm font-medium text-amber-700 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-900">
            {bookings.filter(b => b.status === "REQUESTED").length}
          </p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4">
          <p className="text-sm font-medium text-emerald-700 mb-1">Completed</p>
          <p className="text-2xl font-bold text-emerald-900">
            {bookings.filter(b => b.status === "COMPLETED").length}
          </p>
        </div>
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {displayedBookings.map((booking) => (
          <BookingCard
            key={booking._id}
            booking={booking}
            serviceName={getServiceName(booking)}
            onViewDetails={() => setSelectedBooking(booking)}
          />
        ))}
      </div>

      {/* Empty State */}
      {displayedBookings.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Found</h3>
          <p className="text-gray-600">
            {filters.search || filters.status || filters.dateRange.start || filters.dateRange.end
              ? "Try changing your filters to see more bookings."
              : "You don't have any bookings yet."}
          </p>
        </div>
      )}

      {/* Load More */}
      {!viewAll && filteredBookings.length > limit && (
        <div className="text-center mt-6">
          <button
            onClick={() => setViewAll(true)}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Load More ({filteredBookings.length - limit} more)
          </button>
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          serviceName={getServiceName(selectedBooking)}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};
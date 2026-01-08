import { Calendar } from "lucide-react";

export const EmptyState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center max-w-md">
      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
      <p className="text-gray-600 mb-4">You haven't made any bookings yet. Start by exploring our services.</p>
      <button 
        onClick={() => window.location.href = '/services'}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Browse Services
      </button>
    </div>
  </div>
);
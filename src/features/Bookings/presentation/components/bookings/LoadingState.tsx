import { Loader2 } from "lucide-react";

export const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
      <p className="text-gray-600">Loading your bookings...</p>
    </div>
  </div>
);
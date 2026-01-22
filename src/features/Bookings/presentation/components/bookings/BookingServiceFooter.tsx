import { Button } from "@/components/ui/button";

interface BookingServiceFooterProps {
  selectedTiers: string[];
  calculateTotalPrice: number;
  formatPrice: (price: number) => string;
  loading: boolean;
  isGeocoding: boolean;
  onClose?: () => void;
  handleSubmit: () => void;
}

export default function BookingServiceFooter({
  selectedTiers,
  calculateTotalPrice,
  formatPrice,
  loading,
  isGeocoding,
  onClose,
  handleSubmit,
}: BookingServiceFooterProps) {
  return (
    <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {selectedTiers.length > 0 && (
          <>
            <span className="font-medium">Estimated Total:</span>
            <span className="ml-2 text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatPrice(calculateTotalPrice)}
            </span>
          </>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 border rounded-lg transition disabled:opacity-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || selectedTiers.length === 0 || isGeocoding}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
              Booking...
            </>
          ) : isGeocoding ? (
            "Processing location..."
          ) : (
            `Confirm Booking - ${formatPrice(calculateTotalPrice)}`
          )}
        </Button>
      </div>
    </div>
  );
}
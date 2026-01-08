import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface CancelBookingModalProps {
  bookingId: string;
  onCancel?: (bookingId: string, reason: string) => Promise<boolean>;
  onClose: () => void;
}

export const CancelBookingModal = ({
  bookingId,
  onCancel,
  onClose,
}: CancelBookingModalProps) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for cancellation.");
      return;
    }

    if (!onCancel) return;

    setLoading(true);
    setError("");

    const success = await onCancel(bookingId, reason);

    setLoading(false);
    if (success) onClose();
    else setError("Failed to cancel booking. Please try again.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Cancel Booking
              </h2>
              <p className="text-sm text-gray-500">
                Booking ID: {bookingId.slice(-8)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Reason for cancellation
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Please explain why you are cancelling this booking..."
            className="
              w-full resize-none rounded-xl border border-gray-300 p-3
              text-sm text-gray-900
              focus:border-red-500 focus:ring-2 focus:ring-red-500
            "
          />

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">
              ⚠ Cancelling this booking may be subject to cancellation policies
              and charges.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="
              rounded-xl border border-gray-300 px-5 py-2
              text-gray-700 font-medium
              hover:bg-gray-50
              disabled:opacity-50
            "
          >
            Keep Booking
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading || !reason.trim()}
            className="
              inline-flex items-center justify-center gap-2
              rounded-xl bg-red-600 px-5 py-2
              text-white font-semibold
              transition-all duration-200
              hover:bg-red-700
              active:scale-95
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Cancelling...
              </>
            ) : (
              "Confirm Cancellation"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

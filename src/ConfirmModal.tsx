import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "./features/core/store/auth";

export default function ConfirmModal() {
  const { customerData} = useAuthStore();
  const [open, setOpen] = useState(false);
 const accessToken=customerData.accessToken;
  // Open modal when accessToken exists
  useEffect(() => {
    if (accessToken) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [accessToken]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/50 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl
                   animate-in fade-in zoom-in duration-200"
      >
        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 rounded-full p-1 text-gray-500
                     hover:bg-gray-100 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900">
          Confirm Action
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to continue? This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setOpen(false)}
            className="rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

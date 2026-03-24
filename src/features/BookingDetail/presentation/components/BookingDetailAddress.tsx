import { useState, useEffect } from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { toast } from "react-toastify";

export default function BookingDetailAddress() {
  const { current_location, updateAddress } = useAuthStore();
  const addresses = current_location?.addresses ?? [];

  const homeAddressSaved = addresses.find((a) => a.type === "home")?.value || "";
  const entryInstructionsSaved = addresses.find((a) => a.type === "other")?.value || "";

  const [isOpen, setIsOpen] = useState(false);
  const [homeAddress, setHomeAddress] = useState(homeAddressSaved);
  const [entryInstructions, setEntryInstructions] = useState(entryInstructionsSaved);

  // Sync with store
  useEffect(() => {
    setHomeAddress(homeAddressSaved);
    setEntryInstructions(entryInstructionsSaved);
  }, [homeAddressSaved, entryInstructionsSaved]);

  const handleSave = () => {
    if (!homeAddress.trim()) {
      toast.error("Home address cannot be empty");
      return;
    }

    updateAddress("home", homeAddress.trim());
    updateAddress("other", entryInstructions.trim());
    toast.success("Addresses updated successfully!");
    setIsOpen(false);
  };

  return (
    <>
      {/* Inline Display */}
      <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-gray-900">Service Address</h3>
          <button
            onClick={() => setIsOpen(true)}
            className="text-xs font-bold uppercase tracking-wide text-blue-600 hover:underline"
          >
            Change
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
          <strong className="block text-sm font-bold text-gray-900 mb-1">Home</strong>
          <p className="text-sm text-gray-500 leading-6">{homeAddress || "No address added"}</p>
        </div>

        <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
          Entry Instructions
        </label>
        <input
          type="text"
          value={entryInstructions}
          onChange={(e) => setEntryInstructions(e.target.value)}
          placeholder="Apartment, street, building..."
          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 mb-2"
        />
      </div>

      {/* Modal for editing */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Update Home Address</h2>

            <input
              type="text"
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
              placeholder="Type your home address..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none mb-2"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
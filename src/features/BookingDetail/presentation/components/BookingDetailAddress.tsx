import { useState, useEffect } from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { toast } from "react-toastify";
import { useLanguage } from "@/features/context/LanguageContext";
import { Input, Label } from "@/components/input";
import Button from "@/components/input/Button";

export default function BookingDetailAddress() {
  const { current_location, updateAddress } = useAuthStore();
  const addresses = current_location?.addresses ?? [];
  const { t } = useLanguage();

  const homeSaved = addresses.find((a) => a.type === "home");
  const otherSaved = addresses.find((a) => a.type === "other");

  const homeAddressSaved = homeSaved?.value || "";
  const entryInstructionsSaved = otherSaved?.value || "";

  const [isOpen, setIsOpen] = useState(false);
  const [homeAddress, setHomeAddress] = useState(homeAddressSaved);
  const [entryInstructions, setEntryInstructions] = useState(
    entryInstructionsSaved
  );

  const [loadingLocation, setLoadingLocation] = useState(false);

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

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Save home address with location
        updateAddress("home", "home",  lat,lng);

        // Save entry instructions
        updateAddress("other", "other",  lat,lng);

        toast.success("Addresses updated successfully!");
        setIsOpen(false);
        setLoadingLocation(false);
      },
      () => {
        toast.error("Failed to get current location");
        setLoadingLocation(false);
      }
    );
  };

  return (
    <>
      {/* Inline Display */}
      <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-gray-900">
            {t.bookingdetailpage.serviceAddress}
          </h3>

          <Button
            onClick={() => setIsOpen(true)}
            className="text-xs font-bold uppercase tracking-wide text-blue-600 hover:underline"
          >
            {t.bookingdetailpage.change}
          </Button>
        </div>

        {/* Home Address */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
          <strong className="block text-sm font-bold text-gray-900 mb-1">
            {t.bookingdetailpage.home}
          </strong>
          <p className="text-sm text-gray-500 leading-6">
            {homeAddress || "No address added"}
          </p>
        </div>

        {/* Entry Instructions */}
        <Label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
          {t.bookingdetailpage.entryInstructions}
        </Label>

        <Input
          type="text"
          value={entryInstructions}
          onChange={(e) => setEntryInstructions(e.target.value)}
          placeholder="Apartment, street, building..."
          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 mb-2"
        />
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Update Home Address
            </h2>

            <Input
              type="text"
              value={homeAddress}
              onChange={(e) => setHomeAddress(e.target.value)}
              placeholder="Type your home address..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none mb-2"
            />

            <p className="text-xs text-gray-400 mb-3">
              Location will be captured from your current position
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSave}
                disabled={loadingLocation}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loadingLocation ? "Getting location..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
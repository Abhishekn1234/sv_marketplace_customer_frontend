import { useState, useEffect } from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { toast } from "react-toastify";
import { useLanguage } from "@/features/context/LanguageContext";
import { Input, Label } from "@/components/input";
import Button from "@/components/input/Button";
import CommonCard from "@/components/common/CommonCards";
import CommonModal from "@/components/common/CommonModal";

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
     <CommonCard className="mt-6 rounded-2xl border border-gray-200 p-6">
  
  {/* Header */}
  <div className="mb-4 flex items-center justify-between">
    <h3 className="text-base font-bold text-gray-900">
      {t.bookingdetailpage.serviceAddress}
    </h3>

    <Button
      onClick={() => setIsOpen(true)}
      className="
        text-xs
        font-bold
        uppercase
        tracking-wide
        text-blue-600
        hover:underline
      "
    >
      {t.bookingdetailpage.change}
    </Button>
  </div>

  {/* Address Card */}
  <div
    className="
      mb-4
      rounded-xl
      border
      border-gray-200
      bg-gray-50
      p-4
    "
  >
    <strong
      className="
        mb-1
        block
        text-sm
        font-bold
        text-gray-900
      "
    >
      {t.bookingdetailpage.home}
    </strong>

    <p
      className="
        text-sm
        leading-6
        text-gray-500
      "
    >
      {homeAddress ||
        "No address added"}
    </p>
  </div>

  {/* Entry Instructions */}
  <div>
    <Label
      className="
        mb-2
        block
        text-xs
        font-bold
        uppercase
        tracking-wide
        text-gray-400
      "
    >
      {
        t.bookingdetailpage
          .entryInstructions
      }
    </Label>

    <Input
      type="text"
      value={entryInstructions}
      onChange={(value) =>
        setEntryInstructions(
         value
        )
      }
      placeholder="Apartment, street, building..."
      className="
        h-12
        w-full
        rounded-xl
        border
        border-gray-200
        bg-white
        px-4
        text-sm
        text-gray-900
        outline-none
        transition-all
        focus:border-blue-600
        focus:ring-4
        focus:ring-blue-100
      "
    />
  </div>
</CommonCard>
      {/* Modal */}
    <CommonModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  title="Update Home Address"
  width="max-w-md"
  footer={
    <>
      <Button
        onClick={() => setIsOpen(false)}
        className="
          px-4
          py-2
          text-sm
          font-semibold
          text-gray-600
          hover:text-gray-900
        "
      >
        Cancel
      </Button>

      <Button
        onClick={handleSave}
        disabled={loadingLocation}
        className="
          rounded-xl
          bg-blue-600
          px-5
          py-2
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-blue-700
          disabled:opacity-50
        "
      >
        {loadingLocation
          ? "Getting location..."
          : "Save"}
      </Button>
    </>
  }
>
  <div>
    <Input
      type="text"
      value={homeAddress}
      onChange={(value) =>
        setHomeAddress(value)
      }
      placeholder="Type your home address..."
      className="
        mb-2
        w-full
        rounded-xl
        border
        border-gray-200
        p-3
        text-sm
        outline-none
        transition-all
        focus:border-blue-600
        focus:ring-4
        focus:ring-blue-100
      "
    />

    <p className="text-xs text-gray-400">
      Location will be captured from your
      current position
    </p>
  </div>
</CommonModal>
    </>
  );
}
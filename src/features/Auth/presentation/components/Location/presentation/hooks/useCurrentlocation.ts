import { toast } from "react-toastify";
import { useAuthStore } from "@/features/core/store/auth";
import { getCurrentLocationName } from "@/features/utils/reverse";

export const useUpdateCurrentLocation = () => {
  const { addAddress, updateAddress } = useAuthStore();

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    try {
      const {  placeName } = await getCurrentLocationName();

      // Check if 'home' already exists, else add
      const current = JSON.parse(JSON.stringify(useAuthStore.getState().customerData.current_location)) || { addresses: [] };
      const hasHome = current.addresses.some((addr: any) => addr.type === "home");
      const hasInputValue = current.addresses.some((addr: any) => addr.type === "inputValue");

      if (hasHome) {
        updateAddress("home", placeName);
      } else {
        addAddress("home", placeName);
      }

      if (hasInputValue) {
        updateAddress("inputValue", placeName);
      } else {
        addAddress("inputValue", placeName);
      }

      toast.success("Location updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to get current location");
    }
  };

  return { handleUseCurrentLocation };
};
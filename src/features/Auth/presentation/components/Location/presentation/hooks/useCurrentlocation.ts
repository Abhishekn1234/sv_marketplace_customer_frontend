
import { toast } from "react-toastify";
import { useAuthStore } from "@/features/core/store/auth";
import { getCurrentLocationName } from "@/features/utils/reverse";

export const useUpdateCurrentLocation = () => {
  const addAddress = useAuthStore((state) => state.addAddress);
  const updateHome = useAuthStore((state) => state.updateHome);
  const addresses = useAuthStore((state) => state.current_location.addresses);

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    try {
      const { placeName } = await getCurrentLocationName();

      // Check if 'home' exists
      const homeAddr = addresses.find((addr) => addr.type === "home");
      const inputAddr = addresses.find((addr) => addr.type === "inputValue");

      if (homeAddr) {
        updateHome("home", placeName); // update existing home
      } else {
        addAddress("home", placeName); // add new home
      }

      if (inputAddr) {
        updateHome("inputValue", placeName);
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
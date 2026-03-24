import { toast } from "react-toastify";
import { useAuthStore } from "@/features/core/store/auth";
import { getCurrentLocation } from "@/features/utils/reverse";

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
      const { lat, lng } = await getCurrentLocation();

      // ✅ Store as object
    
      const homeAddr = addresses.find((addr) => addr.type === "home");
      const inputAddr = addresses.find((addr) => addr.type === "inputValue");
      const currentLocation = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
            if (homeAddr) {
          updateHome("home", currentLocation);
        } else {
          addAddress("home", currentLocation);
        }

        if (inputAddr) {
          updateHome("inputValue", currentLocation);
        } else {
          addAddress("inputValue", currentLocation);
        }

      toast.success("Location updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to get current location");
    }
  };

  return { handleUseCurrentLocation };
};
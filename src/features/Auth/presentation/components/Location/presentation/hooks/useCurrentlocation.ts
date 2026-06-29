import { toast } from "react-toastify";
import { useAuthStore } from "@/features/core/store/auth";
import { getCurrentLocation } from "@/features/utils/reverse";
import { handleApiError } from "@/components/common/ApiError";

export const useUpdateCurrentLocation = () => {
  const addAddress = useAuthStore((state) => state.addAddress);
  const updateHome = useAuthStore((state) => state.updateHome);

  const addresses = useAuthStore(
    (state) => state.current_location.addresses
  );

  const setPrevLocation = useAuthStore((state) => state.setPrevLocation); // ✅ ADD THIS

  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    try {
      const { lat, lng } = await getCurrentLocation();

      // ✅ STEP 1: find current stored home location
      const homeAddr = addresses.find((addr) => addr.type === "home");
      const inputAddr = addresses.find((addr) => addr.type === "inputValue");

      // ✅ STEP 2: SAVE PREVIOUS LOCATION BEFORE OVERWRITING
      if (homeAddr) {
        const match = homeAddr.value.match(
          /Lat:\s*(-?\d+\.?\d*),\s*Lng:\s*(-?\d+\.?\d*)/
        );

        if (match) {
          setPrevLocation({
            lat: Number(match[1]),
            lng: Number(match[2]),
          });
        }
      }

      const currentLocation = `Lat: ${lat.toFixed(
        5
      )}, Lng: ${lng.toFixed(5)}`;

      // ✅ STEP 3: update current location
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
    } catch (err:any) {
      console.error(err);
      handleApiError(err);
    }
  };

  return { handleUseCurrentLocation };
};
import { toast } from "react-toastify";

/**
 * Get current location once
 */
export const getCurrentLocation = async (): Promise<{
  lat: number;
  lng: number;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return reject(new Error("Geolocation not supported"));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error(error);
        toast.error("Unable to get your location");
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

/**
 * Watch user location (real-time updates)
 */
export const watchUserLocation = (
  onChange: (data: { lat: number; lng: number }) => void,
  onError?: (error: GeolocationPositionError) => void
): number | null => {
  if (!navigator.geolocation) {
    toast.error("Geolocation not supported");
    return null;
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onChange({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    (error) => {
      console.error("Watch position error:", error);
      toast.error("Tracking failed");
      onError?.(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    }
  );

  return watchId;
};

/**
 * Stop watching location
 */
export const clearLocationWatch = (watchId: number) => {
  if (navigator.geolocation && watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
  }
};
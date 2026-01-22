import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { getCurrentLocationName} from "./reverse";
import type { Location } from "./getdistance";
import { haversineDistance } from "./getdistance";
const NOTIFY_INTERVAL = 60_000; 
const MIN_DISTANCE_KM = 1;
export const useNotification = () => {
  const lastNotifyTimeRef = useRef(0);
  const lastLocationRef = useRef<Location | null>(null);
  const watchIdRef = useRef<number | null>(null);
   useEffect(() => {
    if (!navigator.geolocation) return;

    let intervalId: number;

    const init = async () => {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return;

      const handlePosition = async (position: GeolocationPosition) => {
        const now = Date.now();
        if (now - lastNotifyTimeRef.current < NOTIFY_INTERVAL) return;

        const current: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const previous = lastLocationRef.current;

       
        if (!previous) {
          lastLocationRef.current = current;
          return;
        }

        const distanceKm = haversineDistance(previous, current);
        if (distanceKm < MIN_DISTANCE_KM) return;

       const { placeName } = await getCurrentLocationName();

        new Notification("Location Changed", {
          body: `Moved ${Math.round(distanceKm)} km — ${placeName}`,
        });

        lastLocationRef.current = current;
        lastNotifyTimeRef.current = now;
      };

      watchIdRef.current = navigator.geolocation.watchPosition(
        handlePosition,
        (err) => toast.error(err.message),
        { enableHighAccuracy: true }
      );

      intervalId = window.setInterval(() => {
        navigator.geolocation.getCurrentPosition(handlePosition);
      }, 5000);
    };

    init();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (intervalId) clearInterval(intervalId);
    };
  }, []);
};

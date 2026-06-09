import { useAuthStore } from "@/features/core/store/auth";
import { parseLatLng } from "../utils/parselatlng";
import { getDistanceInKm } from "../utils/distance";

import { requestAndGetToken } from "@/components/firebase/notifications";
import { onMessage } from "firebase/messaging";
import { messaging } from "@/components/firebase/firebase";


export const handleLocationChange = async () => {
  const state = useAuthStore.getState();

  const prev = state.prev_location;

  const currentRaw =
    state.current_location?.addresses?.[0]?.value;

  if (!currentRaw) return;

  const current = parseLatLng(currentRaw);
  if (!current) return;

  let distance = 0;

  if (prev) {
    distance = getDistanceInKm(
      prev.lat,
      prev.lng,
      current.lat,
      current.lng
    );
  console.log(distance);
  }
 
  // update store
  state.setPrevLocation(current);

  // store notification locally
  state.pushNotification({
    id: Date.now().toString(),
    title: "Location Changed",
    message: `You moved ${distance.toFixed(2)} km`,
    type: "LOCATION_CHANGED",
    isRead: false,
  });

  // 🔥 LOCAL WEB PUSH (NO BACKEND)
  const token = await requestAndGetToken();

  if (token) {
    console.log("FCM Token:", token);

    // store locally so SW can use it
    localStorage.setItem("fcm_token", token);
  }

  // trigger browser notification manually
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Location Changed", {
      body: `You moved ${distance.toFixed(2)} km`,
    });
  }
};

export const listenMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Foreground message:", payload);

    new Notification(payload.notification?.title || "Alert", {
      body: payload.notification?.body || "",
    });
  });
};
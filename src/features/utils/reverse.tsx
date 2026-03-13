import { toast } from "react-toastify";
import { apiUrl } from "../api/apiConfig";


export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(`${apiUrl}/geolocation/reverse?lat=${lat}&lon=${lng}`);
    if (!response.ok) throw new Error("Geocoding request failed");

    const data = await response.json();
    if (data.error) {
      console.warn("Backend returned an error:", data.error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    return data.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    toast.error("Failed to fetch address from backend");
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};


export const getCurrentLocationName = async (): Promise<{ lat: number; lng: number; placeName: string }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.watchPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const placeName = await reverseGeocode(lat, lng);
          resolve({ lat, lng, placeName });
        } catch {
          resolve({ lat, lng, placeName: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` });
        }
      },
      (error) => reject(error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });
};

// Get suggestions (search for address and get coordinates)
export const getSuggestions = async (
  query: string,
  signal?: AbortSignal
): Promise<{ lat: number; lng: number; display_name: string }[]> => {
  if (!query) return [];

  try {
    const res = await fetch(
      `${apiUrl}/geolocation/suggestions?q=${encodeURIComponent(query)}`,
      { signal }
    );

    if (!res.ok) return [];

    const data: { coordinates: { coordinates: { lat: number; lng: number } }; display_name: string }[] = await res.json();

    // Map backend DTO to simple frontend object
    return data.map((item) => ({
      lat: item.coordinates.coordinates.lat,
      lng: item.coordinates.coordinates.lng,
      display_name: item.display_name,
    }));
  } catch (error) {
    console.error("Suggestions fetch error:", error);
    return [];
  }
};

// Get first suggestion coordinates from query
export const getCoordinatesFromQuery = async (
  query: string
): Promise<{ lat: number; lng: number; placeName: string } | null> => {
  const suggestions = await getSuggestions(query);
  if (suggestions.length === 0) return null;
  const first = suggestions[0];
  return { lat: first.lat, lng: first.lng, placeName: first.display_name };
};

// Get place name from lat/lng
export const getPlaceNameFromCoords = async (
  lat: number,
  lng: number
): Promise<string> => {
  return reverseGeocode(lat, lng);
};


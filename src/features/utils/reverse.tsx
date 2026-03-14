import { toast } from "react-toastify";
import { apiUrl } from "../api/apiConfig";

export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    const response = await fetch(
      `${apiUrl}/geolocation/reverse?lat=${lat}&lon=${lng}`
    );

    if (!response.ok) {
      throw new Error("Reverse geocode request failed");
    }

    const data = await response.json();

    if (data.error) {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    toast.error("Failed to fetch address");
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

export const getCurrentLocation = async (): Promise<{
  lat: number;
  lng: number;
  placeName: string;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const placeName = await reverseGeocode(lat, lng);
          resolve({ lat, lng, placeName });
        } catch {
          resolve({
            lat,
            lng,
            placeName: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
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

export const getSuggestions = async (
  query: string,
  signal?: AbortSignal
): Promise<{ lat: number; lng: number; display_name: string }[]> => {
  if (!query.trim()) return [];

  try {
    const response = await fetch(
      `${apiUrl}/geolocation/suggestions?q=${encodeURIComponent(query)}`,
      { signal }
    );

    if (!response.ok) {
      throw new Error("Suggestions request failed");
    }

    const data = await response.json();

    console.log("Backend suggestions:", data);

    return (data.suggestions || []).map((item: any) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lng),
      display_name: item.display_name,
    }));
  } catch (error) {
    console.error("Suggestions fetch error:", error);
    return [];
  }
};

export const getCoordinatesFromQuery = async (
  query: string
): Promise<{ lat: number; lng: number; placeName: string } | null> => {
  try {
    const suggestions = await getSuggestions(query);

    if (!suggestions.length) return null;

    const first = suggestions[0];

    return {
      lat: first.lat,
      lng: first.lng,
      placeName: first.display_name,
    };
  } catch (error) {
    console.error("Coordinates fetch error:", error);
    return null;
  }
};

export const getPlaceNameFromCoords = async (
  lat: number,
  lng: number
): Promise<string> => {
  return reverseGeocode(lat, lng);
};


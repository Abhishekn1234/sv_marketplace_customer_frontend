import { toast } from "react-toastify";
import { apiUrl } from "../api/apiConfig";


export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    console.log("Reverse geocode called with:", { lat, lng });

    // ✅ Call your backend reverse geocode endpoint
    const response = await fetch(`${apiUrl}/geolocation/reverse?lat=${lat}&lon=${lng}`);

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();
    console.log("Backend response data:", data);

    if (data.error) {
      console.warn("Backend returned an error:", data.error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }

    const address = data.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    console.log("Final formatted address from backend:", address);

    return address;
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
          console.log(placeName);
          resolve({ lat, lng, placeName });
        } catch (error) {
          resolve({ 
            lat, 
            lng, 
            placeName: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` 
          });
        }
      },
      (error) => {
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


export const getCoordinatesFromAddress = async (address: string) => {
  try {
    if (!address) return null;

    // Call your NestJS backend instead of Nominatim directly
    const response = await fetch(
      `${apiUrl}/geolocation/forward?address=${encodeURIComponent(address)}`, 
      {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("Backend geocoding error:", response.status);
      return null;
    }

    const data = await response.json();

    // Check if backend returned an error
    if (!data || data.error) {
      console.error("Geocoding error:", data?.error);
      return null;
    }

    return {
      lat: data.lat,
      lng: data.lng,
    };
  } catch (error) {
    console.error("Geocoding fetch error:", error);
    return null;
  }
};


export const getPlaceNameFromCoords = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    // Call your backend instead of Nominatim directly
    const response = await fetch(
      `${apiUrl}/geolocation/reverse?lat=${lat}&lon=${lng}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location from backend");
    }

    const data = await response.json();

    // Your backend returns { address: string } or { error: string }
    if (data.error) return "Location not available";

    return data.address || "Unknown location";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Location not available";
  }
};

// utils/geolocation.ts
export const getSuggestions = async (
  query: string,
  signal?: AbortSignal
): Promise<string[]> => {
  if (!query) return [];

  const res = await fetch(
    `${apiUrl}/geolocation/suggestions?q=${encodeURIComponent(query)}`,
    { signal }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.suggestions ?? [];
};

// export const getCoordinatesFromAddress = async (address: string) => {
//   try {
//     if (!address) return null;

//     // Call your NestJS backend instead of Nominatim directly
//     const response = await fetch(
//       `${apiUrl}/geolocation/forward?address=${encodeURIComponent(address)}`, 
//       {
//         method: "GET",
//         headers: {
//           "Accept": "application/json",
//         },
//       }
//     );

//     if (!response.ok) {
//       console.error("Backend geocoding error:", response.status);
//       return null;
//     }

//     const data = await response.json();

//     // Check if backend returned an error
//     if (!data || data.error) {
//       console.error("Geocoding error:", data?.error);
//       return null;
//     }

//     return {
//       lat: data.lat,
//       lng: data.lng,
//     };
//   } catch (error) {
//     console.error("Geocoding fetch error:", error);
//     return null;
//   }
// };

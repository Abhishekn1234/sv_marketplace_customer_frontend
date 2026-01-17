// utils/geocoding.ts
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en&zoom=18`
    );
    
    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }
    
    const data = await response.json();
    
    if (data.address) {
      const { address } = data;
      const parts = [];
      
      if (address.road) parts.push(address.road);
      if (address.suburb) parts.push(address.suburb);
      if (address.city) parts.push(address.city);
      if (address.town) parts.push(address.town);
      if (address.village) parts.push(address.village);
      if (address.state) parts.push(address.state);
      if (address.country) parts.push(address.country);
      
      return parts.length > 0 
        ? parts.join(", ")
        : data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

export const getCurrentLocationName = async (): Promise<{ lat: number; lng: number; placeName: string }> => {
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
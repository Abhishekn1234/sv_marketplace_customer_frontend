
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    console.log("Reverse geocode called with:", { lat, lng });

   const response = await fetch(
  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en&zoom=18`,
  {
    headers: {
      "User-Agent": "YourAppName/1.0 (your@email.com)",
      "Accept": "application/json",
    },
  }
);

    console.log("Fetch response:", response);

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();
    console.log("Full API data:", data);

    if (data.address) {
      const { address } = data;
      console.log("Address object:", address);

      const parts: string[] = [];

      if (address.road) {
        console.log("Road:", address.road);
        parts.push(address.road);
      }

      if (address.suburb) {
        console.log("Suburb:", address.suburb);
        parts.push(address.suburb);
      }

      if (address.city) {
        console.log("City:", address.city);
        parts.push(address.city);
      }

      if (address.town) {
        console.log("Town:", address.town);
        parts.push(address.town);
      }

      if (address.village) {
        console.log("Village:", address.village);
        parts.push(address.village);
      }

      if (address.state) {
        console.log("State:", address.state);
        parts.push(address.state);
      }

      if (address.country) {
        console.log("Country:", address.country);
        parts.push(address.country);
      }

      const finalAddress =
        parts.length > 0
          ? parts.join(", ")
          : data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      console.log("Final formatted address:", finalAddress);
      return finalAddress;
    }

    console.log("No address found, using display_name");
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
    
    navigator.geolocation.watchPosition(
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
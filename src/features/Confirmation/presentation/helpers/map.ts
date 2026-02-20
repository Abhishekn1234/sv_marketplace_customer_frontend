export const getPlaceNameFromCoords = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`,
      {
        headers: {
          "User-Agent": "your-app-name", // Required by Nominatim
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location");
    }

    const data = await response.json();

    return data.display_name || "Unknown location";
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return "Location not available";
  }
};

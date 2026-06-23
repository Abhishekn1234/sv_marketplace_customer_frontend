type Coordinates = {
  lat: number;
  lng: number;
};

export async function resolveLocation(
  homeAddress: string,
  current_location: any,
  getCoordinatesFromQuery: (query: string) => Promise<any>
): Promise<Coordinates | null> {
  let lat: number | undefined;
  let lng: number | undefined;

  // console.log("🏠 Home Address:", homeAddress);

  // 🔹 1. Check if "lat,lng"
  const isLatLngString =
    /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/.test(homeAddress);

  if (isLatLngString) {
    const [parsedLat, parsedLng] = homeAddress.split(",").map(Number);
    lat = parsedLat;
    lng = parsedLng;

    // console.log("✅ Parsed from string:", lat, lng);
  }

  // 🔹 2. Geocode if needed
  if (lat === undefined || lng === undefined) {
    try {
      const coords = await getCoordinatesFromQuery(homeAddress);
      // console.log("🌍 Geocoded:", coords);

      if (coords?.lat !== undefined && coords?.lng !== undefined) {
        lat = coords.lat;
        lng = coords.lng;
      }
    } catch (e) {
      console.error("❌ Geocoding failed:", e);
    }
  }

  // 🔹 3. Fallback → direct lat/lng
  if (lat === undefined || lng === undefined) {
    if (
      current_location?.lat !== undefined &&
      current_location?.lng !== undefined
    ) {
      lat = current_location.lat;
      lng = current_location.lng;

      // console.log("✅ Using current_location:", lat, lng);
    }
  }

  // 🔹 4. Fallback → GeoJSON
  if (lat === undefined || lng === undefined) {
    const coords = current_location?.coordinates?.coordinates;

    if (coords?.length === 2) {
      lng = coords[0];
      lat = coords[1];

      // console.log("✅ Using GeoJSON:", lat, lng);
    }
  }

  // console.log("🎯 Final coords:", lat, lng);

  if (lat === undefined || lng === undefined) return null;

  return { lat, lng };
}
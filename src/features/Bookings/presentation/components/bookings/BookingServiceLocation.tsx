import { useCallback } from "react";



import CommonMap from "@/components/common/CommonMap";
import { getCurrentLocation } from "@/components/utils/reverse";
import { Badge, Label, RadioGroup } from "@/components/input";

interface BookingServiceLocationProps {
  lat: number;
  lng: number;
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
  placeName: string;
  setPlaceName: (name: string) => void;
  locationMode: "current" | "new";
  setLocationMode: (mode: "current" | "new") => void;
  isGeocoding: boolean;
  setIsGeocoding: (loading: boolean) => void;
}

export default function BookingServiceLocation({
  lat,
  lng,
  setLat,
  setLng,
  placeName,
  setPlaceName,
  locationMode,
  setLocationMode,
  isGeocoding,
  setIsGeocoding,
}: BookingServiceLocationProps) {

  // ✅ Set current location using getCurrentLocation
  const handleSetCurrentLocation = useCallback(async () => {
    setIsGeocoding(true);
    try {
      const location = await getCurrentLocation();
      setLat(location.lat);
      setLng(location.lng);
      setPlaceName(`Lat: ${location.lat.toFixed(5)}, Lng: ${location.lng.toFixed(5)}`);
      setLocationMode("current");
    } catch (err) {
      console.error("Failed to get current location:", err);
      setPlaceName("Unable to detect location");
    } finally {
      setIsGeocoding(false);
    }
  }, [setLat, setLng, setPlaceName, setLocationMode, setIsGeocoding]);

  // When user clicks "current" or "new" radio
  const handleLocationModeChange = useCallback(
    async (mode: "current" | "new") => {
      setLocationMode(mode);
      if (mode === "current") {
        await handleSetCurrentLocation();
      }
    },
    [handleSetCurrentLocation, setLocationMode]
  );

  // Handle map clicks in "new" mode
  const handleMapLocationChange = useCallback(
    (newLat: number, newLng: number) => {
      if (locationMode !== "new") return;
      setLat(newLat);
      setLng(newLng);
      setPlaceName(`Custom Location (${newLat.toFixed(5)}, ${newLng.toFixed(5)})`);
    },
    [locationMode, setLat, setLng, setPlaceName]
  );

  return (
    <div className="space-y-4">
      <Label>Location *</Label>

            <RadioGroup
        name="locationMode"
        value={locationMode}
        onChange={(val) =>
          handleLocationModeChange(val as "current" | "new")
        }
        options={[
          { label: "Use Current Location", value: "current" },
          { label: "Set New Location on Map", value: "new" },
        ]}
      />

      <div className="p-3 bg-blue-50 rounded-lg border border-gray-200 flex justify-between items-start">
        <div>
          <p className="text-sm font-medium">Selected Location:</p>
          <p className="text-lg font-semibold mt-1">{isGeocoding ? "Loading..." : placeName}</p>
          <p className="text-xs text-gray-500 mt-1">
            Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
          </p>
        </div>
        <Badge variant="secondary">{locationMode === "current" ? "📍 Current" : "🗺️ Custom"}</Badge>
      </div>

      <div className="relative">
        <CommonMap
          lat={lat}
          lng={lng}
          setLat={setLat}
          setLng={setLng}
          locationMode={locationMode}
          onLocationChange={handleMapLocationChange}
        />

        <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs p-2 rounded backdrop-blur-sm">
          {locationMode === "new"
            ? "Click anywhere on the map to set location"
            : "Switch to 'Set New Location' mode to click on map"}
        </div>
      </div>
    </div>
  );
}
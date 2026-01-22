import { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import CommonMap from "@/components/common/CommonMap";
import { reverseGeocode, getCurrentLocationName } from "../../../../utils/reverse";

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
  const handleSetCurrentLocation = useCallback(async () => {
    setIsGeocoding(true);
    try {
      const location = await getCurrentLocationName();
      setLat(location.lat);
      setLng(location.lng);
      setPlaceName(location.placeName);
      setLocationMode("current");
    } finally {
      setIsGeocoding(false);
    }
  }, [setLat, setLng, setPlaceName, setLocationMode, setIsGeocoding]);

  const handleLocationChange = useCallback(
    async (newLat: number, newLng: number) => {
      if (locationMode !== "new") return;

      setIsGeocoding(true);
      try {
        const name = await reverseGeocode(newLat, newLng);
        setPlaceName(name);
      } catch {
        setPlaceName(`Custom Location (${newLat.toFixed(4)}, ${newLng.toFixed(4)})`);
      } finally {
        setIsGeocoding(false);
      }
    },
    [locationMode, setPlaceName, setIsGeocoding]
  );

  const handleLocationModeChange = useCallback(
    async (mode: "current" | "new") => {
      setLocationMode(mode);
      if (mode === "current") {
        await handleSetCurrentLocation();
        return;
      }
      // If switching to "new", update the name of existing coordinates
      setIsGeocoding(true);
      try {
        const name = await reverseGeocode(lat, lng);
        setPlaceName(name);
      } catch {
        setPlaceName(`Custom Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
      } finally {
        setIsGeocoding(false);
      }
    },
    [lat, lng, handleSetCurrentLocation, setLocationMode, setPlaceName, setIsGeocoding]
  );

  return (
    <div className="space-y-4">
      <Label>Location *</Label>

      <RadioGroup
        value={locationMode}
        onValueChange={(val: "current" | "new") => handleLocationModeChange(val)}
        className="flex flex-col sm:flex-row gap-4 mb-3"
      >
        <label className="flex items-center space-x-2 cursor-pointer">
          <RadioGroupItem value="current" disabled={isGeocoding} className="w-4 h-4 text-blue-600" />
          <span className="text-gray-700">
            Use Current Location {isGeocoding && locationMode === "current" && "(Detecting...)"}
          </span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <RadioGroupItem value="new" disabled={isGeocoding} className="w-4 h-4 text-blue-600" />
          <span className="text-gray-700">
            Set New Location on Map {isGeocoding && locationMode === "new" && "(Updating...)"}
          </span>
        </label>
      </RadioGroup>

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
          onLocationChange={handleLocationChange}
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

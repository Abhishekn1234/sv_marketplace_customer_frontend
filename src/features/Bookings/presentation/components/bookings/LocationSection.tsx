import { useCallback } from "react";
// import { toast } from "react-toastify";
import { getCurrentLocation } from "../../../../../components/utils/reverse";

import CommonMap from "@/components/common/CommonMap";
import { Input, Label } from "@/components/input";
import { handleApiError } from "@/components/common/ApiError";

interface LocationSelectorProps {
  lat: number;
  lng: number;
  setLat: (val: number) => void;
  setLng: (val: number) => void;
  placeName: string;
  setPlaceName: (val: string) => void;
  locationMode: "current" | "new";
  setLocationMode: (mode: "current" | "new") => void;
  isGeocoding: boolean;
  setIsGeocoding: (val: boolean) => void;
}

export default function LocationSelector({
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
}: LocationSelectorProps) {
  // Handle user clicking "Use Current Location"
  const handleUseCurrent = useCallback(async () => {
    setIsGeocoding(true);
    try {
      const location = await getCurrentLocation();
      setLat(location.lat);
      setLng(location.lng);
      setPlaceName(`Lat: ${location.lat.toFixed(5)}, Lng: ${location.lng.toFixed(5)}`);
      setLocationMode("current");
    } catch (err: any) {
     handleApiError(err);
    } finally {
      setIsGeocoding(false);
    }
  }, [setLat, setLng, setPlaceName, setLocationMode, setIsGeocoding]);

  // Handle user selecting a custom location on map
  const handleLocationChange = useCallback(
    (newLat: number, newLng: number) => {
      if (locationMode !== "new") return;

      setLat(newLat);
      setLng(newLng);
      setPlaceName(`Lat: ${newLat.toFixed(5)}, Lng: ${newLng.toFixed(5)}`);
    },
    [locationMode, setLat, setLng, setPlaceName]
  );

  return (
    <div className="space-y-2">
      <div className="flex gap-4">
        <Label>
          <Input
            type="radio"
            checked={locationMode === "current"}
            onChange={handleUseCurrent}
            disabled={isGeocoding}
          />{" "}
          Current Location
        </Label>
        <Label>
          <Input
            type="radio"
            checked={locationMode === "new"}
            onChange={() => setLocationMode("new")}
            disabled={isGeocoding}
          />{" "}
          Set New
        </Label>
      </div>

      <div className="p-3 bg-gray-50 rounded border">
        <p>Selected Location: {placeName}</p>
        <p>Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}</p>
      </div>

      <CommonMap
        lat={lat}
        lng={lng}
        setLat={setLat}
        setLng={setLng}
        locationMode={locationMode}
        onLocationChange={handleLocationChange}
      />
    </div>
  );
}
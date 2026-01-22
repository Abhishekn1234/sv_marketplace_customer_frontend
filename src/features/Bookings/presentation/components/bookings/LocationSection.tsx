import { useCallback } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { reverseGeocode,getCurrentLocationName } from "../../../../utils/reverse";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CommonMap from "@/components/common/CommonMap";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

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



export default function LocationSelector(props: LocationSelectorProps) {
  const { lat, lng, setLat, setLng, placeName, setPlaceName, locationMode, setLocationMode, isGeocoding, setIsGeocoding } = props;

  const handleLocationChange = useCallback(async (newLat: number, newLng: number) => {
    if (locationMode !== "new") return;

    setIsGeocoding(true);
    try {
      const name = await reverseGeocode(newLat, newLng);
      setLat(newLat);
      setLng(newLng);
      setPlaceName(name);
    } catch {
      setPlaceName(`Custom Location (${newLat.toFixed(4)}, ${newLng.toFixed(4)})`);
    } finally {
      setIsGeocoding(false);
    }
  }, [locationMode]);

  const handleUseCurrent = useCallback(async () => {
    setIsGeocoding(true);
    try {
      const location = await getCurrentLocationName();
      setLat(location.lat);
      setLng(location.lng);
      setPlaceName(location.placeName);
      setLocationMode("current");
    } catch (err: any) {
      toast.error(err.message || "Unable to get location");
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  return (
    <div className="space-y-2">
      <div className="flex gap-4">
        <Label>
          <Input type="radio" checked={locationMode === "current"} onChange={handleUseCurrent} disabled={isGeocoding} /> Current Location
        </Label>
        <Label>
          <Input type="radio" checked={locationMode === "new"} onChange={() => setLocationMode("new")} disabled={isGeocoding} /> Set New
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


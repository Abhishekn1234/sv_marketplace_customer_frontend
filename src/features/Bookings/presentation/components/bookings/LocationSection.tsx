import { useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { reverseGeocode,getCurrentLocationName } from "../../utils/reverse";
import { toast } from "react-toastify";

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

function LocationMarker({ lat, lng, setLat, setLng, disabled = false, onChange }: any) {
  useMapEvents({
    click(e) {
      if (!disabled) {
        const newLat = e.latlng.lat;
        const newLng = e.latlng.lng;
        setLat(newLat);
        setLng(newLng);
        onChange?.(newLat, newLng);
      }
    },
  });
  return <Marker position={[lat, lng]} />;
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
        <label>
          <input type="radio" checked={locationMode === "current"} onChange={handleUseCurrent} disabled={isGeocoding} /> Current Location
        </label>
        <label>
          <input type="radio" checked={locationMode === "new"} onChange={() => setLocationMode("new")} disabled={isGeocoding} /> Set New
        </label>
      </div>

      <div className="p-3 bg-gray-50 rounded border">
        <p>Selected Location: {placeName}</p>
        <p>Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}</p>
      </div>

      <MapContainer center={[lat, lng]} zoom={13} className="w-full h-64 rounded">
        <TileLayer 
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" 
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
/>

        <LocationMarker lat={lat} lng={lng} setLat={setLat} setLng={setLng} disabled={locationMode === "current"} onChange={handleLocationChange} />
      </MapContainer>
    </div>
  );
}


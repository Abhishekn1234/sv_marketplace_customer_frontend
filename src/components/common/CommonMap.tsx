import { useMapEvents, Marker, MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface CommonMapProps {
  lat: number;
  lng: number;
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
  locationMode: "current" | "new";
  onLocationChange: (lat: number, lng: number) => void | Promise<void>;
}

// Fix leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function CommonMap({
  lat,
  lng,
  setLat,
  setLng,
  locationMode,
  onLocationChange,
}: CommonMapProps) {
  // Marker component to handle map clicks
  function LocationMarker({
    lat,
    lng,
    setLat,
    setLng,
    disabled,
    onLocationChange,
  }: {
    lat: number;
    lng: number;
    setLat: (lat: number) => void;
    setLng: (lng: number) => void;
    disabled: boolean;
    onLocationChange?: (lat: number, lng: number) => void | Promise<void>;
  }) {
    useMapEvents({
      click(e) {
        if (!disabled) {
          const newLat = e.latlng.lat;
          const newLng = e.latlng.lng;
          setLat(newLat);
          setLng(newLng);
          onLocationChange?.(newLat, newLng);
        }
      },
    });
    return <Marker position={[lat, lng]} />;
  }

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      scrollWheelZoom
      className="w-full h-64 rounded-lg border border-gray-300"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <LocationMarker
        lat={lat}
        lng={lng}
        setLat={setLat}
        setLng={setLng}
        disabled={locationMode === "current"}
        onLocationChange={onLocationChange}
      />
    </MapContainer>
  );
}

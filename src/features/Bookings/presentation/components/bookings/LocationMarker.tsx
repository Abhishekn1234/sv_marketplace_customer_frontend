import { useMapEvents, Marker } from "react-leaflet";

interface LocationMarkerProps {
  lat: number;
  lng: number;
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
  disabled?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
}

export default function LocationMarker({
  lat,
  lng,
  setLat,
  setLng,
  disabled = false,
  onLocationChange,
}: LocationMarkerProps) {
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
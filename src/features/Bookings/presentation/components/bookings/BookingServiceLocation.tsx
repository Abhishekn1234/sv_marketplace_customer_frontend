import { useCallback } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import LocationMarker from "./LocationMarker";
import { reverseGeocode, getCurrentLocationName } from "../../../../utils/reverse";

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

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
    try {
      setIsGeocoding(true);
      const location = await getCurrentLocationName();
      setLat(location.lat);
      setLng(location.lng);
      setPlaceName(location.placeName);
      setLocationMode("current");
    } catch (error: any) {
      console.error("Location error:", error);
    } finally {
      setIsGeocoding(false);
    }
  }, [setLat, setLng, setPlaceName, setLocationMode, setIsGeocoding]);

  const handleLocationMarkerChange = useCallback(
    async (newLat: number, newLng: number) => {
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
    },
    [locationMode, setLat, setLng, setPlaceName, setIsGeocoding]
  );

  const handleLocationModeChange = useCallback(
    async (mode: "current" | "new") => {
      setLocationMode(mode);

      if (mode === "current") {
        await handleSetCurrentLocation();
        return;
      }

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
    [lat, lng, handleSetCurrentLocation, setLocationMode, setIsGeocoding, setPlaceName]
  );

  return (
    <div>
      <label className="block font-medium mb-1">Location *</label>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-3">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="locationMode"
            value="current"
            checked={locationMode === "current"}
            onChange={() => handleLocationModeChange("current")}
            disabled={isGeocoding}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700 dark:text-gray-300">
            Use Current Location
            {isGeocoding && locationMode === "current" && " (Detecting...)"}
          </span>
        </label>
        
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="locationMode"
            value="new"
            checked={locationMode === "new"}
            onChange={() => handleLocationModeChange("new")}
            disabled={isGeocoding}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-gray-700 dark:text-gray-300">
            Set New Location on Map
            {isGeocoding && locationMode === "new" && " (Updating...)"}
          </span>
        </label>
      </div>

      <div className="mb-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Location:</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-1">
              {isGeocoding ? "Loading location name..." : placeName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {locationMode === "current" ? "📍 Current" : "🗺️ Custom"}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          scrollWheelZoom={true}
          className="w-full h-64 rounded-lg border border-gray-300 dark:border-gray-600"
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
            onLocationChange={handleLocationMarkerChange}
          />
        </MapContainer>
        
        <div className="absolute bottom-2 left-2 bg-black/80 text-white text-xs p-2 rounded backdrop-blur-sm">
          {locationMode === "new" 
            ? "Click anywhere on the map to set location" 
            : "Switch to 'Set New Location' mode to click on map"}
        </div>
        
        {isGeocoding && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
            <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
              <p className="text-sm text-gray-700 dark:text-gray-300">Getting location name...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useEffect, useCallback, useMemo } from "react";
import { X } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Service, PricingTier } from "../../../../types/service.types";
import { toast } from "react-toastify";
import { useBookings } from "../../hooks/useBookings";
import type { BookingPayload } from "../../../domain/entities/booking.types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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

interface BookingServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

function LocationMarker({
  lat,
  lng,
  setLat,
  setLng,
  disabled = false,
  onLocationChange,
}: {
  lat: number;
  lng: number;
  setLat: (lat: number) => void;
  setLng: (lng: number) => void;
  disabled?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
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

// 反向地理编码函数 - 获取地点名称
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en&zoom=18`
    );
    
    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }
    
    const data = await response.json();
    
    if (data.address) {
      const { address } = data;
      const parts = [];
      
      if (address.road) parts.push(address.road);
      if (address.suburb) parts.push(address.suburb);
      if (address.city) parts.push(address.city);
      if (address.town) parts.push(address.town);
      if (address.village) parts.push(address.village);
      if (address.state) parts.push(address.state);
      if (address.country) parts.push(address.country);
      
      return parts.length > 0 
        ? parts.join(", ")
        : data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
    
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

// 获取当前位置的名称
const getCurrentLocationName = async (): Promise<{ lat: number; lng: number; placeName: string }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        try {
          const placeName = await reverseGeocode(lat, lng);
          resolve({ lat, lng, placeName });
        } catch (error) {
          resolve({ 
            lat, 
            lng, 
            placeName: `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)})` 
          });
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export default function BookingServiceModal({
  isOpen,
  onClose,
  service,
}: BookingServiceModalProps) {
  // =====================
// STATE & HOOKS
// =====================
const [workDescription, setWorkDescription] = useState("");
const [numberOfWorkers, setNumberOfWorkers] = useState(1);
const [estimatedHours, setEstimatedHours] = useState(1);
const [estimatedDays, setEstimatedDays] = useState(1);
const [startDateTime, setStartDateTime] = useState("");
const [startDate, setStartDate] = useState<Date | null>(null);
const [pricingMode, setPricingMode] = useState<"HOURLY" | "PER_DAY">("HOURLY");
const [bookingType, setBookingType] = useState<"INSTANT" | "SCHEDULED">("INSTANT");
const [lat, setLat] = useState(12.9716);
const [lng, setLng] = useState(77.5946);
const [placeName, setPlaceName] = useState("Bangalore, India");
const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
const [loading, setLoading] = useState(false);
const [locationMode, setLocationMode] = useState<"current" | "new">("current");
const [isGeocoding, setIsGeocoding] = useState(false);

const { createBooking } = useBookings();

// =====================
// MEMOS
// =====================
const calculateTotalPrice = useMemo(() => {
  if (!service || selectedTiers.length === 0) return 0;

  let total = 0;
  selectedTiers.forEach((tierId) => {
    const tier = service.pricingTiers.find(t => t._id === tierId);

    if (!tier) return;

    if (pricingMode === "HOURLY" && tier.HOURLY?.ratePerHour) {
      total += tier.HOURLY.ratePerHour * estimatedHours * numberOfWorkers;
    }

    if (pricingMode === "PER_DAY" && tier.PER_DAY?.ratePerDay) {
      total += tier.PER_DAY.ratePerDay * estimatedDays * numberOfWorkers;
    }
  });

  return total;
}, [
  service,
  selectedTiers,
  pricingMode,
  estimatedHours,
  estimatedDays,
  numberOfWorkers,
]);

// =====================
// EFFECTS
// =====================
useEffect(() => {
  if (bookingType === "INSTANT") {
    setStartDateTime(new Date().toISOString().slice(0, 16));
  } else {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    setStartDateTime(tomorrow.toISOString().slice(0, 16));
  }
}, [bookingType]);

useEffect(() => {
  if (isOpen && locationMode === "current") {
    handleSetCurrentLocation();
  }
}, [isOpen]);

// =====================
// CALLBACKS & HANDLERS
// =====================
const formatPrice = (price: number) =>
  `${price.toFixed(2)} ${service?.currency || "SAR"}`;

const handleTierClick = useCallback((tierId: string) => {
  setSelectedTiers(prev =>
    prev.includes(tierId)
      ? prev.filter(id => id !== tierId)
      : [...prev, tierId]
  );
}, []);


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
  [locationMode]
);
const getDurationLabel = () => { if (pricingMode === "HOURLY") { return estimatedHours === 1 ? "1 hour" : `${estimatedHours} hours`; } else { return estimatedDays === 1 ? "1 day" : `${estimatedDays} days`; } };  const getWorkersLabel = () => { return numberOfWorkers === 1 ? "1 worker" : `${numberOfWorkers} workers`; };
const handleSetCurrentLocation = useCallback(async () => {
  try {
    setIsGeocoding(true);
    const location = await getCurrentLocationName();
    setLat(location.lat);
    setLng(location.lng);
    setPlaceName(location.placeName);
    setLocationMode("current");
  } catch (error: any) {
    toast.error(`Unable to get current location: ${error.message}`);
  } finally {
    setIsGeocoding(false);
  }
}, []);

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
  [lat, lng, handleSetCurrentLocation]
);

const handleSubmit = async () => {
  if (selectedTiers.length === 0) {
    toast.error("Please select at least one pricing tier");
    return;
  }

  if (bookingType === "SCHEDULED" && !startDate) {
    toast.error("Please select start date & time");
    return;
  }

  setLoading(true);

  const payload: BookingPayload = {
    workDescription,
    serviceId: service!._id,
    serviceTierId: selectedTiers[0],
    pricingMode,
    numberOfWorkers,
    bookingType,
    startDateTime:
      bookingType === "INSTANT"
        ? new Date().toISOString()
        : startDate!.toISOString(), // 🔥 key line
    estimatedHours: pricingMode === "HOURLY" ? estimatedHours : 0,
    estimatedDays: pricingMode === "PER_DAY" ? estimatedDays : 0,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
  };

  console.log("FINAL PAYLOAD:", payload);

  try {
    await createBooking(payload);
    toast.success("Booking created successfully");
    onClose();
  } catch (err: any) {
    toast.error(err.message || "Booking failed");
  } finally {
    setLoading(false);
  }
};


// =====================
// SAFE EARLY RETURN
// =====================
if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full max-w-4xl rounded-xl shadow-xl overflow-y-auto max-h-[90vh] border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-xl font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {service.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Work Description *</label>
            <textarea
              value={workDescription}
              onChange={(e) => setWorkDescription(e.target.value)}
              placeholder="Describe the work in detail..."
              className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          {/* Booking Type and Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Booking Type *</label>
              <select
                value={bookingType}
                onChange={(e) => setBookingType(e.target.value as any)}
                className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="INSTANT">Instant Booking (Start Now)</option>
                <option value="SCHEDULED">Schedule for Later</option>
              </select>
            </div>

            {bookingType === "SCHEDULED" && (
  <div>
    <label className="block font-medium mb-1">Start Date & Time *</label>
    <DatePicker
      selected={startDate}
      onChange={(date:any) => setStartDate(date)}
      showTimeSelect
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="MMMM d, yyyy h:mm aa"
      minDate={new Date()}
      className="w-full p-2 border rounded-lg rounded-lg border-gray-300 dark:border-gray-600"
      placeholderText="Select date and time"
    />
  </div>
)}
          </div>

          {/* Pricing Mode and Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-medium mb-1">Pricing Mode *</label>
              <select
                value={pricingMode}
                onChange={(e) => {
                  setPricingMode(e.target.value as any);
                  // Reset duration when mode changes
                  if (e.target.value === "HOURLY") {
                    setEstimatedHours(1);
                  } else {
                    setEstimatedDays(1);
                  }
                }}
                className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="HOURLY">Hourly Rate</option>
                <option value="PER_DAY">Daily Rate</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">
                {pricingMode === "HOURLY" ? "Estimated Hours *" : "Estimated Days *"}
              </label>
              <input
                type="number"
                min={pricingMode === "HOURLY" ? 1 : 1}
                value={pricingMode === "HOURLY" ? estimatedHours : estimatedDays}
                onChange={(e) => {
                  const value = Math.max(1, Number(e.target.value));
                  if (pricingMode === "HOURLY") {
                    setEstimatedHours(value);
                  } else {
                    setEstimatedDays(value);
                  }
                }}
                className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Number of Workers *</label>
              <input
                type="number"
                min={1}
                value={numberOfWorkers}
                onChange={(e) => setNumberOfWorkers(Math.max(1, Number(e.target.value)))}
                className="w-full p-2 border rounded-lg border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Pricing Tiers with Price Calculation */}
          <div>
            <label className="block font-medium mb-2">
              Select Pricing Tiers * (Select one or more)
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                Total: {formatPrice(calculateTotalPrice)}
              </span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {service.pricingTiers.map((tier: PricingTier) => {
                // Get rate based on pricing mode
                const rate = pricingMode === "HOURLY" 
                  ? tier.HOURLY?.ratePerHour 
                  : tier.PER_DAY?.ratePerDay;
                
                // Calculate tier total
                const tierTotal = rate ? 
                  (pricingMode === "HOURLY" 
                    ? rate * estimatedHours * numberOfWorkers
                    : rate * estimatedDays * numberOfWorkers)
                  : 0;
                   console.log("CLICK ID:", tier._id);
                    console.log("CHECK ID:", tier.tierId);
                return (
                  <button
                    key={tier._id}
                    type="button"
                   onClick={() => handleTierClick(tier._id)}
                    className={`p-3 text-sm rounded-lg border text-left transition-all ${
                      selectedTiers.includes(tier._id)
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-[1.02]"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:border-gray-600"
                    }`}
                  >
                    <div className="font-semibold text-base mb-1">
                      {tier.tier?.displayName || tier.tierId}
                    </div>
                    <div className="text-sm mb-2">
                      {rate ? (
                        <>
                          <div className="font-medium">
                            Rate: {rate} {service.currency}
                            {pricingMode === "HOURLY" ? "/hr" : "/day"}
                          </div>
                          <div className="text-xs opacity-80 mt-1">
                            {getDurationLabel()} × {getWorkersLabel()}
                          </div>
                        </>
                      ) : (
                        <div className="text-red-500">Rate not available</div>
                      )}
                    </div>
                    {rate && (
                      <div className="text-xs font-semibold border-t pt-2 border-white/30">
                        Tier Total: {formatPrice(tierTotal)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Price Summary */}
          {selectedTiers.length > 0 && calculateTotalPrice > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300">Booking Summary</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {selectedTiers.length} tier(s) selected • {getDurationLabel()} • {getWorkersLabel()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                    {formatPrice(calculateTotalPrice)}
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {pricingMode === "HOURLY" ? "Hourly rate" : "Daily rate"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Location Selection */}
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
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {selectedTiers.length > 0 && (
              <>
                <span className="font-medium">Estimated Total:</span>
                <span className="ml-2 text-lg font-bold text-blue-600 dark:text-blue-400">
                  {formatPrice(calculateTotalPrice)}
                </span>
              </>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 dark:text-red-400 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || selectedTiers.length === 0 || isGeocoding}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Booking...
                </>
              ) : isGeocoding ? (
                "Processing location..."
              ) : (
                `Confirm Booking - ${formatPrice(calculateTotalPrice)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
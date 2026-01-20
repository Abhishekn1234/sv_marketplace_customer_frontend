import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import type { Service } from "../../../domain/entities/service.types";
import type { BookingPayload } from "../../../domain/entities/bookingpayload.types"
import { useBookings } from "../../hooks/useBookings";
import { useServices } from "../../hooks/useServices";
import BookingServiceHeader from "./BookingServiceHeader";
import BookingServiceForm from "./BookingServiceForm";
import BookingServiceLocation from "./BookingServiceLocation";
import BookingServiceFooter from "./BookingServiceFooter";
import { getCurrentLocationName } from "../../../../utils/reverse";

interface BookingServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

export default function BookingServiceModal({
  isOpen,
  onClose,
  service,
}: BookingServiceModalProps) {
  
  const [workDescription, setWorkDescription] = useState("");
  const [numberOfWorkers, setNumberOfWorkers] = useState(1);
  const [estimatedHours, setEstimatedHours] = useState(1);
  const [estimatedDays, setEstimatedDays] = useState(1);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [pricingMode, setPricingMode] = useState<"HOURLY" | "PER_DAY">("HOURLY");
  const [bookingType, setBookingType] = useState<"INSTANT" | "SCHEDULED">("INSTANT");

  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [placeName, setPlaceName] = useState<string>("Fetching current location...");
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationMode, setLocationMode] = useState<"current" | "new">("current");
  const [isGeocoding, setIsGeocoding] = useState(false);

  const { serviceTiers } = useServices();
  const { createBooking } = useBookings();

   const calculateTotalPrice = useMemo(() => {
    if (!service || selectedTiers.length === 0) return 0;

    let total = 0;
    selectedTiers.forEach((tierId) => {
      const tier = service.pricingTiers.find((t) => t.tierId === tierId);
      if (!tier) return;

      if (pricingMode === "HOURLY" && tier.HOURLY?.ratePerHour) {
        total += tier.HOURLY.ratePerHour * estimatedHours * numberOfWorkers;
      }

      if (pricingMode === "PER_DAY" && tier.PER_DAY?.ratePerDay) {
        total += tier.PER_DAY.ratePerDay * estimatedDays * numberOfWorkers;
      }
    });

    return total;
  }, [service, selectedTiers, pricingMode, estimatedHours, estimatedDays, numberOfWorkers]);

  const tierNameMap = useMemo(() => {
    if (!serviceTiers) return {};
    const map: Record<string, string> = {};
    for (const tier of serviceTiers) {
      map[tier._id] = tier.displayName ?? "Tier";
    }
    return map;
  }, [serviceTiers]);


  useEffect(() => {
  const now = new Date();

  if (bookingType === "INSTANT") {
    setStartDate(now);
  } else {
    const scheduledTime = new Date(now.getTime() + 15 * 60 * 1000);
    setStartDate(scheduledTime);
  }
}, [bookingType]);


 
  useEffect(() => {
    if (!isOpen) return;

    if (locationMode === "current") {
      setIsGeocoding(true);
      getCurrentLocationName()
        .then(({ lat, lng, placeName }) => {
          setLat(lat);
          setLng(lng);
          setPlaceName(placeName);
        })
        .catch((err) => {
          console.error(err);
          setPlaceName("Location unavailable");
        })
        .finally(() => setIsGeocoding(false));
    }
  }, [isOpen, locationMode]);

  
  const formatPrice = (price: number) =>
    `${price.toFixed(2)} ${service?.currency || "SAR"}`;

  const handleTierClick = (tierId: string) => {
    setSelectedTiers((prev) =>
      prev.includes(tierId) ? prev.filter((id) => id !== tierId) : [...prev, tierId]
    );
  };

  const getDurationLabel = () => {
    if (pricingMode === "HOURLY") {
      return estimatedHours === 1 ? "1 hour" : `${estimatedHours} hours`;
    } else {
      return estimatedDays === 1 ? "1 day" : `${estimatedDays} days`;
    }
  };

  const getWorkersLabel = () => {
    return numberOfWorkers === 1 ? "1 worker" : `${numberOfWorkers} workers`;
  };

  const handleSubmit = async () => {
    if (selectedTiers.length === 0) {
      toast.error("Please select at least one pricing tier");
      return;
    }

    if (bookingType === "SCHEDULED" && !startDate) {
      toast.error("Please select start date & time");
      return;
    }

    if (lat === null || lng === null) {
      toast.error("Location not set yet");
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
      startDateTime: startDate!.toISOString(),
      estimatedHours: pricingMode === "HOURLY" ? estimatedHours : 0,
      estimatedDays: pricingMode === "PER_DAY" ? estimatedDays : 0,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    };

    try {
      await createBooking(payload);
      // toast.success("Booking created successfully");
      onClose();
    } catch (err: any) {
      // toast.error(err.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

 
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-full max-w-4xl rounded-xl shadow-xl overflow-y-auto max-h-[90vh] border border-gray-200 dark:border-gray-700">
        
        <BookingServiceHeader 
          service={service}
          onClose={onClose}
        />

        
        <div className="p-4 space-y-4">
        
          <BookingServiceForm
            workDescription={workDescription}
            setWorkDescription={setWorkDescription}
            bookingType={bookingType}
            setBookingType={setBookingType}
            startDate={startDate}
            setStartDate={setStartDate}
            pricingMode={pricingMode}
            setPricingMode={setPricingMode}
            estimatedHours={estimatedHours}
            setEstimatedHours={setEstimatedHours}
            estimatedDays={estimatedDays}
            setEstimatedDays={setEstimatedDays}
            numberOfWorkers={numberOfWorkers}
            setNumberOfWorkers={setNumberOfWorkers}
            service={service}
            selectedTiers={selectedTiers}
            handleTierClick={handleTierClick}
            calculateTotalPrice={calculateTotalPrice}
            formatPrice={formatPrice}
            getDurationLabel={getDurationLabel}
            getWorkersLabel={getWorkersLabel}
            serviceTiers={serviceTiers}
            tierNameMap={tierNameMap}
          />

         
          <BookingServiceLocation
            lat={lat ?? 0}
            lng={lng ?? 0}
            setLat={setLat}
            setLng={setLng}
            placeName={placeName}
            setPlaceName={setPlaceName}
            locationMode={locationMode}
            setLocationMode={setLocationMode}
            isGeocoding={isGeocoding}
            setIsGeocoding={setIsGeocoding}
          />
        </div>

      
        <BookingServiceFooter
          selectedTiers={selectedTiers}
          calculateTotalPrice={calculateTotalPrice}
          formatPrice={formatPrice}
          loading={loading}
          isGeocoding={isGeocoding}
          onClose={onClose}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}

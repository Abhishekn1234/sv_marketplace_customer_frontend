import { useState } from "react";

import { useLanguage } from "@/features/context/LanguageContext";
import { toast } from "react-toastify";
import { getCurrentLocation } from "@/components/utils/reverse";
import { Input } from "@/components/input";
import Button from "@/components/input/Button";
import { MapPinIcon, NavigationGPSIcon } from "@/components/icons";

type Props = {
  selected: "home" | "office" | null;
  inputValue: string;
  setInputValue: (v: string) => void;
  onChange: (v: { lat: number; lng: number; display_name: string }) => void;
};

export default function LocationSearchInput({
  inputValue,
  setInputValue,
  onChange,
}: Props) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  // Use current location
  const handleUseCurrentLocation = async () => {
    setIsLoading(true);
    try {
      const { lat, lng } = await getCurrentLocation();

      // Create display string
      const display_name = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;

      setInputValue(display_name);
      onChange({ lat, lng, display_name });

      toast.success(t.location?.title ?? "Location updated!");
    } catch (err) {
      console.error(err);
      toast.error(t.common?.locationError ?? "Unable to fetch location");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative w-full max-w-xl">
        <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          value={inputValue}
          onChange={(value) => setInputValue(value)}
          placeholder={t.location?.searchPlaceholder ?? "Enter location"}
          className="h-14 w-full rounded-2xl px-12"
        />

        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            Loading...
          </div>
        )}
      </div>
       
      <Button
        variant="ghost"
        onClick={handleUseCurrentLocation}
        className="inline-flex items-center gap-2 mb-2 text-blue-600 cursor-pointer text-sm font-bold px-4 py-2 rounded-full hover:bg-blue-100"
      
      >
              <div className="flex justify-center">
          <NavigationGPSIcon size={50} color="#0000FF" />
        </div>
        
        {t.location?.useCurrent ?? "Use current location"}
      </Button>
    </>
  );
}
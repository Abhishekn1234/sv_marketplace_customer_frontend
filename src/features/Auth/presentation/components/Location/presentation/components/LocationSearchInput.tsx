import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/features/context/LanguageContext";
import { toast } from "react-toastify";

type Props = {
  selected: "home" | "office" | null;
  inputValue: string;
  setInputValue: (v: string) => void;
  onChange: (v: string) => void;
};

export default function LocationSearchInput({
 
  inputValue,
  setInputValue,
  onChange,
}: Props) {
  const { t } = useLanguage();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
  `https://nominatim.openstreetmap.org/search?format=jsonv2&accept-language=en&q=${encodeURIComponent(query)}`
);

      const data: { display_name?: string }[] = await res.json();
      setSuggestions(data.map((d) => d.display_name ?? ""));
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (value: string) => {
    setInputValue(value);
    onChange(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (loc: string) => {
    setInputValue(loc);
    onChange(loc);
    setSuggestions([]);
  };

  const handleUseCurrentLocation = () => {
    // if (!selected) {
    //   toast.error("Please select Home or Office first");
    //   return;
    // }

    if (!navigator.geolocation) {
      toast.error(t.common?.geoNotSupported ?? "Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
       const res = await fetch(
  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=en&lat=${coords.latitude}&lon=${coords.longitude}`
);

        const data = await res.json();
        const loc = data.display_name ?? `${coords.latitude}, ${coords.longitude}`;
        setInputValue(loc);
        onChange(loc);
      },
      () => toast.error(t.common?.locationError ?? "Unable to fetch location")
    );
  };

  return (
    <>
      <div className="relative w-full max-w-xl">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={t.location.searchPlaceholder ?? "Enter location"}
          className="h-14 w-full rounded-2xl px-12"
        />

        {suggestions.length > 0 && (
          <ul className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-md z-50 max-h-60 overflow-y-auto">
            {suggestions.map((loc, i) => (
              <li
                key={i}
                onClick={() => handleSuggestionClick(loc)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                {loc}
              </li>
            ))}
          </ul>
        )}

        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            Loading...
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        onClick={handleUseCurrentLocation}
        className="inline-flex items-center gap-2 mb-2 text-blue-600  cursor-pointer text-sm font-bold px-4 py-2 rounded-full hover:bg-blue-100"
      >
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polygon points="3 11 22 2 13 21 11 13 3 11" />
          </svg>
        {t.location.useCurrent ?? "Use current location"}
      </Button>
    </>
  );
}

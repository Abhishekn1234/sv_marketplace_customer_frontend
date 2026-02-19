import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/core/store/auth";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export default function AddressModal({
  open,
  onClose,
}: AddressModalProps) {
  const { customerData, updateAddress } = useAuthStore();

  const [selectedType, setSelectedType] = useState<"home" | "office">("home");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  useEffect(() => {
    if (open) {
      setAddress(customerData.current_location?.[selectedType] || "");
    }
  }, [open, selectedType, customerData]);

  /* Autocomplete */
  useEffect(() => {
    if (address.length < 3) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&addressdetails=1&limit=5&countrycodes=in&accept-language=en`
      )
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch(() => setSuggestions([]));
    }, 400);

    return () => clearTimeout(delay);
  }, [address]);

  const handleSave = () => {
    if (!address.trim()) return;
    updateAddress(selectedType, address.trim());
    onClose();
  };

  const handleSelect = (item: Suggestion) => {
    setAddress(item.display_name);
    setSuggestions([]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-xl font-bold mb-6 text-gray-900">
          Select Address Type
        </h2>

        {/* Radio Row */}
        <div className="flex gap-4 mb-6">
          {/* Home */}
          <label
            className={`flex-1 flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              selectedType === "home"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              value="home"
              checked={selectedType === "home"}
              onChange={() => setSelectedType("home")}
              className="hidden"
            />

            {/* Home SVG */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M3 12l9-9 9 9" />
              <path d="M9 21V9h6v12" />
            </svg>

            <span className="font-medium">Home</span>
          </label>

          {/* Office */}
          <label
            className={`flex-1 flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
              selectedType === "office"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <input
              type="radio"
              value="office"
              checked={selectedType === "office"}
              onChange={() => setSelectedType("office")}
              className="hidden"
            />

            {/* Office SVG */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="7" width="18" height="14" rx="2" />
              <path d="M16 3h-8v4h8V3z" />
            </svg>

            <span className="font-medium">Office</span>
          </label>
        </div>

        {/* Address Input */}
        <div className="relative">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address..."
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-200 rounded-xl mt-2 w-full max-h-60 overflow-y-auto shadow-lg">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelect(item)}
                  className="p-3 cursor-pointer hover:bg-blue-50 text-sm"
                >
                  {item.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
          >
            Save
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 py-3 rounded-xl hover:bg-gray-200 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

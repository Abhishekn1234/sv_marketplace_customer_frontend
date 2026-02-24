import { useEffect, useState } from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { getSuggestions } from "@/features/utils/reverse";
import { useDebounce } from "../utils/debouncer";
interface AddressModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddressModal({
  open,
  onClose,
}: AddressModalProps) {
  const { customerData, updateHome } = useAuthStore();

  const [selectedType, setSelectedType] = useState<"home" | "office">("home");
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // ✅ Debounce input (400ms)
  const debouncedAddress = useDebounce(address, 400);

  /* Load existing address */
  useEffect(() => {
    if (!open) return;

    const addresses = customerData.current_location?.addresses ?? [];

    const existing =
      addresses.find((addr) => addr.type === selectedType)?.value || "";

    setAddress(existing);
  }, [open, selectedType, customerData]);

  /* Fetch suggestions only when debounced value changes */
useEffect(() => {
  if (!debouncedAddress || debouncedAddress.length < 3) {
    setSuggestions([]);
    return;
  }

  const controller = new AbortController();

  const fetchSuggestions = async () => {
    try {
      const results = await getSuggestions(debouncedAddress, controller.signal);
      setSuggestions(results);
    } catch (error) {
      if ((error as any).name !== "AbortError") {
        console.error(error);
      }
    }
  };

  fetchSuggestions();

  return () => controller.abort(); // ✅ cancel previous request
}, [debouncedAddress]);

  const handleSave = () => {
    if (!address.trim()) return;

    updateHome(selectedType, address.trim());
    onClose();
  };

  const handleSelect = (value: string) => {
    setAddress(value);
    setSuggestions([]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-xl font-bold mb-6 text-gray-900">
          Select Address Type
        </h2>

        <div className="flex gap-4 mb-6">
          {["home", "office"].map((type) => (
            <label
              key={type}
              className={`flex-1 flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                selectedType === type
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <input
                type="radio"
                checked={selectedType === type}
                onChange={() =>
                  setSelectedType(type as "home" | "office")
                }
                className="hidden"
              />
              <span className="font-medium capitalize">{type}</span>
            </label>
          ))}
        </div>

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
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

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
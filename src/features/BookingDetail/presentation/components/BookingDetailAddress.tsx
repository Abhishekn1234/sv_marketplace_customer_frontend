import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { toast } from "react-toastify";

export default function BookingDetailAddress() {
  const { customerData, updateAddress } = useAuthStore();

  // Existing saved data
  const homeaddress = customerData?.current_location?.home || "";
  const entryInstructionsSaved = customerData?.current_location?.other || "";

  // Modal open state
  const [isOpen, setIsOpen] = useState(false);

  // Inputs
  const [newAddress, setNewAddress] = useState(homeaddress);
  const [entryInstructions, setEntryInstructions] = useState(entryInstructionsSaved);

  // Suggestions & loading
  const [homeSuggestions, setHomeSuggestions] = useState<{ display_name: string }[]>([]);
  const [entrySuggestions, setEntrySuggestions] = useState<{ display_name: string }[]>([]);
  const [loadingHome, setLoadingHome] = useState(false);
  const [loadingEntry, setLoadingEntry] = useState(false);

  // Debounce refs
  const homeDebounceRef = useRef<number | null>(null);
  const entryDebounceRef = useRef<number | null>(null);

  // Sync with store changes
  useEffect(() => {
    setNewAddress(homeaddress);
    setEntryInstructions(entryInstructionsSaved);
  }, [homeaddress, entryInstructionsSaved]);

  // Fetch suggestions helper
  const fetchSuggestions = async (
    input: string,
    setSuggestions: React.Dispatch<React.SetStateAction<{ display_name: string }[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    debounceRef: React.MutableRefObject<number | null>
  ) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      if (!input) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            input
          )}&addressdetails=1&limit=5&accept-language=en`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  // Save updated addresses
  const handleSave = () => {
    updateAddress("home", newAddress);
    updateAddress("other", entryInstructions);
    toast.success("Addresses updated successfully!");
    setIsOpen(false);
  };

  return (
    <>
      {/* Display current address */}
      <div className="mt-6 bg-white rounded-2xl p-6 border-2 border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[16px] font-bold text-gray-900">Service Address</h3>
          <button
            onClick={() => setIsOpen(true)}
            className="text-[12px] font-bold uppercase tracking-[0.5px] text-blue-600 hover:underline"
          >
            Change
          </button>
        </div>

        <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 mb-4">
          <strong className="block text-[14px] font-bold text-gray-900 mb-1">Home</strong>
          <p className="text-[14px] text-gray-500 leading-6">{homeaddress || "No address added"}</p>
        </div>

        <label className="block text-[12px] font-bold uppercase tracking-[0.5px] text-gray-400 mb-2">
          Entry Instructions
        </label>
        <input
          type="text"
          value={entryInstructions}
          onChange={(e) => {
            setEntryInstructions(e.target.value);
            fetchSuggestions(e.target.value, setEntrySuggestions, setLoadingEntry, entryDebounceRef);
          }}
          placeholder="Apartment, street, building..."
          className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-[14px] text-gray-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 mb-2"
        />
        {loadingEntry && <p className="text-sm text-gray-500 mt-1">Loading suggestions...</p>}
        {entrySuggestions.length > 0 && (
          <ul className="border border-gray-200 rounded-xl mt-1 max-h-60 overflow-auto">
            {entrySuggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => {
                  setEntryInstructions(s.display_name);
                  setEntrySuggestions([]);
                }}
                className="p-2 text-sm hover:bg-blue-50 cursor-pointer"
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal for updating addresses */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Update Home & Entry Address</h2>

            {/* Home Address Input */}
            <input
              type="text"
              value={newAddress}
              onChange={(e) => {
                setNewAddress(e.target.value);
                fetchSuggestions(e.target.value, setHomeSuggestions, setLoadingHome, homeDebounceRef);
              }}
              placeholder="Type your home address..."
              className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none mb-2"
            />
            {loadingHome && <p className="text-sm text-gray-500 mt-1">Loading suggestions...</p>}
            {homeSuggestions.length > 0 && (
              <ul className="border border-gray-200 rounded-xl mt-1 max-h-60 overflow-auto">
                {homeSuggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setNewAddress(s.display_name);
                      setHomeSuggestions([]);
                    }}
                    className="p-2 text-sm hover:bg-blue-50 cursor-pointer"
                  >
                    {s.display_name}
                  </li>
                ))}
              </ul>
            )}


            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { toast } from "react-toastify";
import { getSuggestions } from "@/features/utils/reverse";

export default function BookingDetailAddress() {
  const { current_location, updateAddress } = useAuthStore();

  const addresses = current_location?.addresses ?? [];

  const homeaddress =
    addresses.find((a) => a.type === "home")?.value ||
    addresses.find((a) => a.type === "inputValue")?.value ||
    "";

  const entryInstructionsSaved =
    addresses.find((a) => a.type === "other")?.value || "";

  const [isOpen, setIsOpen] = useState(false);

  const [newAddress, setNewAddress] = useState(homeaddress);
  const [entryInstructions, setEntryInstructions] =
    useState(entryInstructionsSaved);

  const [homeSuggestions, setHomeSuggestions] = useState<string[]>([]);
  const [entrySuggestions, setEntrySuggestions] = useState<string[]>([]);

  const [loadingHome, setLoadingHome] = useState(false);
  const [loadingEntry, setLoadingEntry] = useState(false);

  const homeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const entryDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const homeAbortRef = useRef<AbortController | null>(null);
  const entryAbortRef = useRef<AbortController | null>(null);

  // Sync when store changes
  useEffect(() => {
    setNewAddress(homeaddress);
    setEntryInstructions(entryInstructionsSaved);
  }, [homeaddress, entryInstructionsSaved]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (homeAbortRef.current) homeAbortRef.current.abort();
      if (entryAbortRef.current) entryAbortRef.current.abort();
    };
  }, []);

  const fetchSuggestions = async (
    input: string,
    setSuggestions: React.Dispatch<React.SetStateAction<string[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    debounceRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>,
    abortRef: React.MutableRefObject<AbortController | null>
  ) => {
    // Clear previous debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (!input.trim() || input.length < 3) {
        setSuggestions([]);
        return;
      }

      // Cancel previous API request
      if (abortRef.current) {
        abortRef.current.abort();
      }

      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);

      try {
        const results = await getSuggestions(input, controller.signal);
        setSuggestions(results);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Suggestion error:", error);
        }
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleSave = () => {
    if (!newAddress.trim()) {
      toast.error("Home address cannot be empty");
      return;
    }

    updateAddress("home", newAddress);
    updateAddress("other", entryInstructions);

    toast.success("Addresses updated successfully!");
    setIsOpen(false);
  };

  return (
    <>
      {/* Display Section */}
      <div className="mt-6 bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base font-bold text-gray-900">
            Service Address
          </h3>
          <button
            onClick={() => setIsOpen(true)}
            className="text-xs font-bold uppercase tracking-wide text-blue-600 hover:underline"
          >
            Change
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
          <strong className="block text-sm font-bold text-gray-900 mb-1">
            Home
          </strong>
          <p className="text-sm text-gray-500 leading-6">
            {homeaddress || "No address added"}
          </p>
        </div>

        <label className="block text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
          Entry Instructions
        </label>

        <input
          type="text"
          value={entryInstructions}
          onChange={(e) => {
            const value = e.target.value;
            setEntryInstructions(value);

            fetchSuggestions(
              value,
              setEntrySuggestions,
              setLoadingEntry,
              entryDebounceRef,
              entryAbortRef
            );
          }}
          placeholder="Apartment, street, building..."
          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 mb-2"
        />

        {loadingEntry && (
          <p className="text-sm text-gray-500 mt-1">
            Loading suggestions...
          </p>
        )}

        {entrySuggestions.length > 0 && (
          <ul className="border border-gray-200 rounded-xl mt-1 max-h-60 overflow-auto">
            {entrySuggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => {
                  setEntryInstructions(s);
                  setEntrySuggestions([]);
                }}
                className="p-2 text-sm hover:bg-blue-50 cursor-pointer"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Update Home Address
            </h2>

            <input
              type="text"
              value={newAddress}
              onChange={(e) => {
                const value = e.target.value;
                setNewAddress(value);

                fetchSuggestions(
                  value,
                  setHomeSuggestions,
                  setLoadingHome,
                  homeDebounceRef,
                  homeAbortRef
                );
              }}
              placeholder="Type your home address..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none mb-2"
            />

            {loadingHome && (
              <p className="text-sm text-gray-500 mt-1">
                Loading suggestions...
              </p>
            )}

            {homeSuggestions.length > 0 && (
              <ul className="border border-gray-200 rounded-xl mt-1 max-h-60 overflow-auto">
                {homeSuggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setNewAddress(s);
                      setHomeSuggestions([]);
                    }}
                    className="p-2 text-sm hover:bg-blue-50 cursor-pointer"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}

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
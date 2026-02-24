import { useState, useEffect } from "react";
import { useAuthStore } from "@/features/core/store/auth";
import { getSuggestions } from "@/features/utils/reverse";
import { useDebounce } from "../utils/debouncer";

export default function SavedAddress() {
  const { customerData, addAddress, updateAddress, deleteAddress } =
    useAuthStore();

  const addresses = customerData?.current_location?.addresses ?? [];

  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [selectedType, setSelectedType] = useState<"home" | "office">("home");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempAddress, setTempAddress] = useState("");

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const activeInputValue = editingId ? tempAddress : newAddress;
  const debouncedValue = useDebounce(activeInputValue, 600);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedValue || debouncedValue.trim().length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const results = await getSuggestions(debouncedValue.trim());
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  const startEdit = (id: string, currentValue: string) => {
    setEditingId(id);
    setTempAddress(currentValue);
    setSuggestions([]);
  };

  const saveEdit = () => {
    if (!editingId || !tempAddress.trim()) return;
    updateAddress(editingId, tempAddress);
    setEditingId(null);
    setTempAddress("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempAddress("");
    setSuggestions([]);
  };

  const handleDelete = (id: string) => {
    deleteAddress(id);
  };

  const handleAdd = () => {
    if (!newAddress.trim()) return;
    addAddress(selectedType, newAddress);
    setNewAddress("");
    setShowAddForm(false);
    setSuggestions([]);
  };

  const homeAddresses = addresses.filter((a) => a.type === "home");
  const officeAddresses = addresses.filter((a) => a.type === "office");

  const LocationIcon = () => (
    <svg
      className="w-4 h-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M12 21s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );

  const EditIcon = () => (
    <svg className="w-4 h-4 text-gray-500 hover:text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} > <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /> <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /> </svg>
  );

  const DeleteIcon = () => (
    <svg className="w-4 h-4 text-gray-500 hover:text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} > <polyline points="3 6 5 6 21 6" /> <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /> </svg>
  );

  const renderInputWithSuggestions = (
    value: string,
    onChange: (v: string) => void,
    onSelect: (v: string) => void,
    placeholder: string
  ) => (
    <div className="relative">
      <div className="relative">
        <span className="absolute left-3 top-2.5">
          <LocationIcon />
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-9 pr-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-sm"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-20 mt-2 w-full bg-white border rounded-xl shadow-lg max-h-52 overflow-y-auto">
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => {
                onSelect(s);
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer transition"
            >
              <LocationIcon />
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCard = (addr: any, index: number) => (
    <div
      key={addr.id}
      className="p-5 bg-gray-50"
    >
      <div className="flex justify-between items-center mb-3">
      <span className="font-semibold text-gray-800 flex items-center gap-2">
  {addr.type === "home" ? (
    <>
      <svg
        className="w-5 h-5 text-blue-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
     Home {index === 0 ? "" : index + 1}
    </>
  ) : (
    <>
      <svg
        className="w-5 h-5 text-blue-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <path d="M9 22v-4h6v4" />
      </svg>
      Office {index === 0 ? "" : index + 1}
    </>
  )}
</span>

        <div className="flex gap-2">
          {editingId === addr.id ? (
            <>
              <button
                onClick={saveEdit}
                className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="px-3 py-1 bg-gray-300 rounded-lg text-xs"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => startEdit(addr.id, addr.value)}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition"
              >
                <EditIcon />
              </button>
              <button
                onClick={() => handleDelete(addr.id)}
                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition"
              >
                <DeleteIcon />
              </button>
            </>
          )}
        </div>
      </div>

      {editingId === addr.id ? (
        renderInputWithSuggestions(
          tempAddress,
          setTempAddress,
          setTempAddress,
          `Enter ${addr.type} address`
        )
      ) : (
        <p className="text-sm text-gray-600">{addr.value}</p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border mt-6">
      
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        <svg
    className="w-5 h-5 text-blue-600"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
  Saved Addresses
  
</h3>

      <div className="flex flex-col gap-4">
        {homeAddresses.map((addr, i) => renderCard(addr, i))}
        {officeAddresses.map((addr, i) => renderCard(addr, i))}

        {showAddForm ? (
          <div className="p-5 bg-gray-50 border rounded-2xl space-y-4">
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={selectedType === "home"}
                  onChange={() => setSelectedType("home")}
                />
                Home
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={selectedType === "office"}
                  onChange={() => setSelectedType("office")}
                />
                Office
              </label>
            </div>

            {renderInputWithSuggestions(
              newAddress,
              setNewAddress,
              setNewAddress,
              "Enter address"
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" > <line x1="12" y1="5" x2="12" y2="19" /> <line x1="5" y1="12" x2="19" y2="12" /> </svg>
                Add Address
              </button>

              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewAddress("");
                }}
                className="px-5 py-2 bg-gray-200 rounded-xl text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-4 bg-blue-50 border-2 border-dashed border-blue-600 rounded-2xl text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition"
          >
            + Add New Address
          </button>
        )}
      </div>
    </div>
  );
}
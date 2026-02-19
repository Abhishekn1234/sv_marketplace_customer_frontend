import { useState } from "react";
import { useAuthStore } from "@/features/core/store/auth";

export default function SavedAddress() {
  const { customerData, updateAddress } = useAuthStore();

  const homecustomer = customerData.current_location?.home ?? "";
  const officecustomer = customerData.current_location?.office ?? "";

  const [editingType, setEditingType] = useState<"home" | "office" | null>(null);
  const [tempAddress, setTempAddress] = useState("");

  const startEdit = (type: "home" | "office", currentValue: string) => {
    setEditingType(type);
    setTempAddress(currentValue);
  };

  const saveEdit = () => {
    if (editingType) {
      updateAddress(editingType, tempAddress);
      setEditingType(null);
    }
  };

  const cancelEdit = () => {
    setEditingType(null);
    setTempAddress("");
  };

  const handleDelete = (type: "home" | "office") => {
    updateAddress(type, "");
  };

  const renderAddressCard = (type: "home" | "office", label: string, value: string) => (
    <div className="p-5 bg-gray-50 border-2 border-gray-200 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[14px] font-bold text-gray-900">{label}</div>

        <div className="flex gap-2">
          {editingType !== type && (
            <button
              onClick={() => startEdit(type, value)}
              className="w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 group"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-gray-500 group-hover:text-blue-600"
              >
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}

          {editingType === type ? (
            <>
              <button
                onClick={saveEdit}
                className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => handleDelete(type)}
              className="w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-200 rounded-lg hover:border-red-600 hover:bg-red-50 group"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-gray-500 group-hover:text-red-600"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {editingType === type ? (
        <input
          type="text"
          value={tempAddress}
          onChange={(e) => setTempAddress(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-[14px]"
          placeholder={`Enter ${label} address`}
        />
      ) : (
        <p className="text-[14px] text-gray-500 leading-relaxed">
          {value || `No ${label} Location set`}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-[20px] p-8 shadow-sm border border-gray-200 mt-6">
       <div className="flex items-center gap-2 mb-6">
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-6 h-6 text-blue-600"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
  <h3 className="text-[18px] font-bold text-gray-900">Saved Addresses</h3>
</div>


      <div className="flex flex-col gap-4">
        {renderAddressCard("home", "Home", homecustomer)}
        {renderAddressCard("office", "Office", officecustomer)}

        {/* Add New Address (UI only, can extend later) */}
        <button className="flex items-center justify-center gap-2 w-full p-4 bg-blue-50 border-2 border-dashed border-blue-600 rounded-2xl text-[14px] font-semibold text-blue-600 hover:bg-blue-600 hover:text-white hover:border-solid">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Address
        </button>
      </div>
    </div>
  );
}

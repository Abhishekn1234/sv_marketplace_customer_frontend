import { useState } from "react";

export default function LocationModal() {
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 space-y-6 relative">

        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800">
          Set Your Location
        </h2>

        {/* Search Input */}
        <div className="relative">
          
          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="7" strokeWidth="2" />
            <path strokeWidth="2" d="M20 20l-3-3" />
          </svg>

          <input
            type="text"
            placeholder="Search location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Current Location */}
        <button className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:text-blue-700">
          
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="3" strokeWidth="2" />
            <path strokeWidth="2" d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          </svg>

          Use current location
        </button>

        {/* Save As */}
        <p className="text-sm text-gray-500">Save as</p>

        <div className="flex gap-3">

          {/* Home */}
          <button className="flex items-center gap-2 border rounded-xl px-4 py-3 hover:bg-gray-100 flex-1 justify-center">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeWidth="2" d="M3 10L12 3l9 7v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z"/>
            </svg>

            Home
          </button>

          {/* Office */}
          <button className="flex items-center gap-2 border rounded-xl px-4 py-3 hover:bg-gray-100 flex-1 justify-center">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeWidth="2" d="M4 21V7l8-4 8 4v14M9 21v-6h6v6"/>
            </svg>

            Office
          </button>

        </div>

        {/* Save Button */}
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-medium">
          Save Location
        </button>

      </div>
    </div>
  );
}

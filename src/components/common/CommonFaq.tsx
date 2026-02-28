import { useState } from "react";

export default function CommonFaq() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6  cursor-pointer right-6 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 z-50"
        aria-label="Open FAQ"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-6 h-6 fill-white"
        >
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </button>

     
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-xl relative">

            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black cursor-pointer"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold">1. How do I book a service?</h3>
                <p>You can book a service from the services page by selecting your category and confirming.</p>
              </div>

              <div>
                <h3 className="font-semibold">2. How do I cancel a booking?</h3>
                <p>Go to your bookings section and click cancel before the service starts.</p>
              </div>

              <div>
                <h3 className="font-semibold">3. Is online payment available?</h3>
                <p>Yes, we support online and cash payments.</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
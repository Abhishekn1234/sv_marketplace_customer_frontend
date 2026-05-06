"use client";

import { useState } from "react";
import { Image, Input } from "../input";
import Button from "../input/Button";
import { PlusIcon } from "../icons";

export default function CommonFaq() {
  const [open, setOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [message, setMessage] = useState("");

  const phone = "916238519397";

  const handleSendToWhatsApp = () => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      message || "Hi, I need help!"
    )}`;
    window.open(url, "_blank");
  };

  return (
    <>

    <div
  className="fixed bottom-24 right-6 z-50"
  onMouseEnter={() => setWhatsappOpen(true)}
  onMouseLeave={() => {
    setWhatsappOpen(false);
    setMessage("");
  }}
  onClick={() => setWhatsappOpen((prev) => !prev)}
>
        {/* Button */}
        <Button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
            alt="WhatsApp"
            className="w-7 h-7"
          />
        </Button>

        {/* ================= HOVER MODAL ================= */}
        {whatsappOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">

            {/* Header */}
            <div className="bg-green-500 text-white p-4">
              <h3 className="font-semibold text-sm">Chat with us on WhatsApp</h3>
              <p className="text-xs opacity-90">We usually reply instantly ⚡</p>
            </div>

            {/* Body */}
            <div className="p-4 space-y-3">
              <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              <Button
                onClick={handleSendToWhatsApp}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition font-medium"
              >
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ================= FAQ FLOAT BUTTON ================= */}
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 z-50"
      >
       
       <PlusIcon />
      </Button>

      {/* ================= FAQ MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-xl relative">
            <Button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </Button>

            <h2 className="text-xl font-bold mb-4">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h3 className="font-semibold">1. How do I book a service?</h3>
                <p>
                  You can book a service from the services page by selecting your category and confirming.
                </p>
              </div>

              <div>
                <h3 className="font-semibold">2. How do I cancel a booking?</h3>
                <p>
                  Go to your bookings section and click cancel before the service starts.
                </p>
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
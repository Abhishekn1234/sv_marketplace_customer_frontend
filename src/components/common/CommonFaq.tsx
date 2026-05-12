"use client";

import { useState } from "react";
import { Image, Input, Label } from "../input";
import Button from "../input/Button";
import { PlusIcon } from "../icons";
import CommonModal from "./CommonModal";

export default function CommonFaq() {
  const [open, setOpen] = useState(false);

  const [whatsappOpen, setWhatsappOpen] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const phone = "916238519397";

  const handleSendToWhatsApp = () => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      message || "Hi, I need help!"
    )}`;

    window.open(url, "_blank");

    setWhatsappOpen(false);

    setMessage("");
  };

  return (
    <>
      {/* ================= WHATSAPP BUTTON ================= */}

      <div className="fixed bottom-24 right-6 z-50">
        <Button
          onClick={() =>
            setWhatsappOpen(true)
          }
          className="
            w-14
            h-14
            bg-green-500
            rounded-full
            flex
            items-center
            justify-center
            shadow-xl
            hover:scale-110
            active:scale-95
            transition-all
            duration-300
          "
        >
          <Image
            src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
            alt="WhatsApp"
            className="w-7 h-7"
          />
        </Button>
      </div>

      {/* ================= WHATSAPP MODAL ================= */}

      <CommonModal
        open={whatsappOpen}
        onClose={() =>
          setWhatsappOpen(false)
        }
        title="Chat with us on WhatsApp"
        width="max-w-md"
      >
        <div className="space-y-4">
          

          {/* Input */}
          <div>
            <Label className="mb-2 block text-sm font-semibold text-gray-700">
              Your Message
            </Label>

            <Input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Type your message..."
              className="
                w-full
                rounded-xl
                border
                border-gray-200
                px-4
                py-3
                text-sm
                outline-none
                focus:border-green-500
                focus:ring-4
                focus:ring-green-100
              "
            />
          </div>

          {/* Action */}
          <Button
            onClick={handleSendToWhatsApp}
            className="
              w-full
              rounded-xl
              bg-green-500
              py-3
              font-semibold
              text-white
              transition
              hover:bg-green-600
            "
          >
            Chat on WhatsApp
          </Button>
        </div>
      </CommonModal>

      {/* ================= FAQ FLOAT BUTTON ================= */}

      <Button
        onClick={() => setOpen(true)}
        className="
          fixed
          bottom-6
          right-6
          z-50
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-blue-600
          text-white
          shadow-xl
          transition-all
          duration-300
          hover:scale-110
          active:scale-95
        "
      >
        <PlusIcon

        />
      </Button>

      {/* ================= FAQ MODAL ================= */}

      <CommonModal
        open={open}
        onClose={() => setOpen(false)}
        title="Frequently Asked Questions"
        width="max-w-md"
      >
        <div className="space-y-5 text-sm text-gray-700">
          {/* FAQ 1 */}
          <div
            className="
              rounded-xl
              border
              border-gray-100
              bg-gray-50
              p-4
            "
          >
            <h3 className="mb-2 font-semibold text-gray-900">
              1. How do I book a service?
            </h3>

            <p className="leading-6 text-gray-600">
              You can book a service from
              the services page by selecting
              your category and confirming.
            </p>
          </div>

          {/* FAQ 2 */}
          <div
            className="
              rounded-xl
              border
              border-gray-100
              bg-gray-50
              p-4
            "
          >
            <h3 className="mb-2 font-semibold text-gray-900">
              2. How do I cancel a booking?
            </h3>

            <p className="leading-6 text-gray-600">
              Go to your bookings section
              and click cancel before the
              service starts.
            </p>
          </div>

          {/* FAQ 3 */}
          <div
            className="
              rounded-xl
              border
              border-gray-100
              bg-gray-50
              p-4
            "
          >
            <h3 className="mb-2 font-semibold text-gray-900">
              3. Is online payment available?
            </h3>

            <p className="leading-6 text-gray-600">
              Yes, we support online and
              cash payments.
            </p>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
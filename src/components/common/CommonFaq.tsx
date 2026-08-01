"use client";

import { useState } from "react";
import { Image, Input, Label } from "../input";
import Button from "../input/Button";
import { PlusIcon, WhatsAppIcon } from "../icons";
import CommonModal from "./CommonModal";
import { useLanguage } from "@/features/context/LanguageContext";

export default function CommonFaq() {
  const [open, setOpen] = useState(false);
 const {t}=useLanguage();
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

<div
  className="
    fixed
    z-50

    bottom-20
    right-6

    md:bottom-24
    md:right-6
  "
>
  <Button
    onClick={() => setWhatsappOpen(true)}
    className="
      w-14
      h-14
      
      bg-green-400
      text-white
      
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
   <WhatsAppIcon/>
  </Button>
</div>

{/* ================= FAQ BUTTON ================= */}

<Button
  onClick={() => setOpen(true)}
  className="
    fixed
    z-50

    bottom-20
    left-6

    md:left-auto
    md:right-6
    md:bottom-6

    flex
    h-14
    w-14
    items-center
    justify-center
    rounded-full
    bg-blue-600
    text-white
    hover:text-blue-700
    shadow-xl
    transition-all
    duration-300
    hover:scale-110
    active:scale-95
  "
>
  <PlusIcon />
</Button>

      {/* ================= WHATSAPP MODAL ================= */}

      <CommonModal
  open={whatsappOpen}
  onClose={() => setWhatsappOpen(false)}
  title={t.faq.chatOnWhatsapp}

  width="max-w-xs"
>
  <div className="space-y-3">
    <div>
      <Label className="mb-2 block text-sm font-semibold text-gray-700">
        {t.faq.yourMessage}
      </Label>

      <Input
        type="text"
        value={message}
        onChange={(value) => setMessage(value)}
        placeholder={t.faq.messagePlaceholder}
        className="
          w-full
          rounded-lg
          border
          border-gray-200
          px-3
          py-2.5
          text-sm
          focus:border-green-500
          focus:ring-2
          focus:ring-green-100
        "
      />
    </div>

    <Button
      onClick={handleSendToWhatsApp}
      className="
        w-full
        rounded-lg
        bg-green-500
        py-2.5
        text-sm
        font-medium
        text-white
        hover:bg-green-600
      "
    >
      {t.faq.chatOnWhatsapp}
    </Button>
  </div>
</CommonModal>

      {/* ================= FAQ FLOAT BUTTON ================= */}

     

      {/* ================= FAQ MODAL ================= */}

   <CommonModal
  open={open}
  onClose={() => setOpen(false)}
  title={t.faq.modalTitle}
  width="max-w-lg"
>
  <div
    className="
      max-h-[60vh]
      sm:max-h-[70vh]
      md:max-h-[75vh]
      overflow-y-auto
      pr-2
      space-y-4
      text-sm
      sm:text-base
      text-gray-700
    "
  >
    {/* FAQ 1 */}
    <div
      className="
        rounded-xl
        border
        border-gray-200
        bg-gray-50
        p-4
        sm:p-5
      "
    >
      <h3 className="mb-2 font-semibold text-gray-900">
        {t.faq.q1}
      </h3>

      <p className="leading-6 text-gray-600 break-words">
        {t.faq.a1}
      </p>
    </div>

    {/* FAQ 2 */}
    <div
      className="
        rounded-xl
        border
        border-gray-200
        bg-gray-50
        p-4
        sm:p-5
      "
    >
      <h3 className="mb-2 font-semibold text-gray-900">
        {t.faq.q2}
      </h3>

      <p className="leading-6 text-gray-600 break-words">
        {t.faq.a2}
      </p>
    </div>

    {/* FAQ 3 */}
    <div
      className="
        rounded-xl
        border
        border-gray-200
        bg-gray-50
        p-4
        sm:p-5
      "
    >
      <h3 className="mb-2 font-semibold text-gray-900">
        {t.faq.q3}
      </h3>

      <p className="leading-6 text-gray-600 break-words">
        {t.faq.a3}
      </p>
    </div>
  </div>
</CommonModal>
    </>
  );
}
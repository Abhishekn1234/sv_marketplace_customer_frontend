"use client";

import { type ReactNode, useState } from "react";

interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: "top" | "bottom";
}

export default function Tooltip({
  children,
  text,
  position = "top",
}: TooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
        <div
          className={`absolute z-50 px-2 py-1 text-xs text-white bg-black rounded-md whitespace-nowrap
          ${position === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}
        >
          {text}
        </div>
      )}
    </div>
  );
}
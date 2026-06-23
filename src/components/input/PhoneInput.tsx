import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useLanguage } from "@/features/context/LanguageContext";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  country?: string;
}
export function PhoneInput({
  value,
  onChange,
  country = "in",
}: PhoneInputProps) {
  const { isRTLOrder } = useLanguage();

  const phoneValue = value
    ? value.replace("+", "").replace("-", "")
    : "";

  return (
    <div
      dir={isRTLOrder ? "rtl" : "ltr"}
      className={
        isRTLOrder
          ? "[&_.flag-dropdown]:left-auto [&_.flag-dropdown]:right-0"
          : ""
      }
    >
      <ReactPhoneInput
        country={country}
        value={phoneValue}
        onChange={(phone: string, data: any) => {
          const dialCode = data?.dialCode || "";

          const nationalNumber = phone.startsWith(dialCode)
            ? phone.slice(dialCode.length)
            : phone;

          onChange(`+${dialCode}-${nationalNumber}`);
        }}
        containerClass="w-full"
        inputClass={`
          !w-full
          !h-12
          !rounded-xl
          !border
          !border-gray-300
          ${isRTLOrder
            ? "!pr-[60px] !pl-3 !text-right"
            : "!pl-[60px] !pr-3 !text-left"}
        `}
        buttonClass={`
          ${isRTLOrder ? "!right-0" : "!left-0"}
        `}
        inputProps={{
          dir: "ltr",
        }}
      />
    </div>
  );
}
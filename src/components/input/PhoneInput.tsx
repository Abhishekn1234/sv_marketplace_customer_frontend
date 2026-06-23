import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  country?: string;
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
}


export function PhoneInput({
  value,
  onChange,
  country = "in",
}: PhoneInputProps) {
  // Convert "+91-9876543210" -> "919876543210"
  const phoneValue = value
    ? value.replace("+", "").replace("-", "")
    : "";

  return (
    <ReactPhoneInput
      country={country}
      value={phoneValue}
      onChange={(phone: string, data: any) => {
        const dialCode = data?.dialCode || "";

        const nationalNumber = phone.startsWith(dialCode)
          ? phone.slice(dialCode.length)
          : phone;

        const formatted = `+${dialCode}-${nationalNumber}`;

        onChange(formatted);
      }}
      inputClass="!w-full !h-12 !rounded-xl !border !border-gray-300"
      containerClass="w-full"
    />
  );
}
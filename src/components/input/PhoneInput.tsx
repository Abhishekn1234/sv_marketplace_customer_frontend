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
  label,
  value,
  onChange,
  country = "in",
  containerClassName,
  labelClassName,
}: PhoneInputProps) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className={`block text-sm font-semibold mb-2 ${labelClassName}`}>
          {label}
        </label>
      )}

      <ReactPhoneInput
        country={country}
        value={value}
        onChange={(phone: string, data: any) => {
          const dial = data.dialCode || ""; // "91"

          // remove dial code from full number
          const national = phone.replace(dial, "").trim();

          // ✅ FORMAT WITH DASH
          const formatted = `+${dial}-${national}`;

          onChange(formatted);
        }}
        inputClass="!w-full !h-12 !rounded-xl !border !border-gray-300"
        containerClass="w-full"
      />
    </div>
  );
}
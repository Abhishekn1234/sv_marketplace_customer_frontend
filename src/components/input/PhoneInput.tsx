import * as RPNInput from "react-phone-number-input";
import { PhoneInput as ShadcnPhoneInput } from "@/components/ui/phone-input";
import { useLanguage } from "@/features/context/LanguageContext";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  country?: RPNInput.Country;
}

export function PhoneInput({
  value,
  onChange,
  country = "IN",
}: PhoneInputProps) {
  const { isRTLOrder } = useLanguage();

  return (
    <div dir={isRTLOrder ? "rtl" : "ltr"}>
      <ShadcnPhoneInput
        defaultCountry={country}
        international
        value={(value as RPNInput.Value) || undefined}
        onChange={(phone) => {
          onChange(phone || "");
        }}
        className="w-full"
      />
    </div>
  );
}
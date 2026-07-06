import "react-international-phone/style.css";
import { PhoneInput as IntlPhoneInput } from "react-international-phone";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useLanguage } from "@/features/context/LanguageContext";

interface Props {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: string;
}

export function PhoneInput({
  value,
  onChange,
  defaultCountry = "in",
}: Props) {
  const { isRTLOrder } = useLanguage();

  return (
    <div dir={isRTLOrder ? "rtl" : "ltr"} className="phone-input-wrapper">
      <IntlPhoneInput
        value={value}
        defaultCountry={defaultCountry}
        onChange={(phone, meta) => {
          const dialCode = `+${meta.country.dialCode}`;

          if (phone === dialCode && value) {
            const parsed = parsePhoneNumberFromString(value);

            if (parsed) {
              onChange(`${dialCode}${parsed.nationalNumber}`);
              return;
            }
          }

          onChange(phone);
        }}
      />
    </div>
  );
}
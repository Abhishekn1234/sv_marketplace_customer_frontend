import "react-international-phone/style.css";

import { PhoneInput as IntlPhoneInput } from "react-international-phone";
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
    <div dir={isRTLOrder ? "rtl" : "ltr"} className="w-full">
          <IntlPhoneInput
        value={value}
        onChange={onChange}
        forceDialCode
        inputClassName="!w-full !h-11 !rounded-r-xl !border !border-l-0"
        countrySelectorStyleProps={{
          buttonClassName: "!h-11 !rounded-l-xl !border",
          dropdownStyleProps: {
            className: "!z-50",
          },
        }}
      />
    </div>
  );
}

import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
  label?: string;
  containerClassName?: string;
  labelClassName?: string;
  country?: string; // e.g., "in" for India
}

export function PhoneInput({ label, containerClassName, labelClassName, value, onChange, country = "in", ...props }: PhoneInputProps) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className={`block text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2 ${labelClassName}`}>
          {label}
        </label>
      )}
      <ReactPhoneInput
        country={country}
        value={value}
        onChange={onChange}
        inputClass="!w-full !h-12 !rounded-xl !border-2 !border-gray-200 !bg-gray-50 focus:!bg-white focus:!border-blue-600"
        containerClass="w-full"
        buttonClass="!border-none"
        {...props}
      />
    </div>
  );
}
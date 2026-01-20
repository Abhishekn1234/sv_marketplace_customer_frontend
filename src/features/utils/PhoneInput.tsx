
import { forwardRef } from 'react';
import PhoneInputLib, {type  PhoneInputProps } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>((props, ref) => {
  
  const Component = PhoneInputLib as unknown as React.ComponentType<PhoneInputProps & { inputRef?: React.Ref<HTMLInputElement> }>;
  
  return <Component {...props} inputRef={ref} />;
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
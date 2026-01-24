import type { ChangeEventHandler } from "react";

function PhoneInput({
  phone,
  onChange,
  name,
  className,
  required,
}: {
  phone: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  name?: string;
  required?: boolean;
}) {
  return (
    <input
      required={required}
      name={name}
      type="tel" 
      pattern="0[0-9]{9}"
      placeholder="eg: 0557375350"
      autoComplete="phone"
      value={phone}
      onChange={onChange}
      className={className}
    />
  );
}

export default PhoneInput;

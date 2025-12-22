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
      placeholder="+233"
      autoComplete="phone"
      value={phone}
      onChange={onChange}
      className={className}
    />
  );
}

export default PhoneInput;

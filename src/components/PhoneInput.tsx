import type { ChangeEventHandler } from "react"

function PhoneInput( {phone, onChange, className, required}: {
  phone: string, 
  onChange: ChangeEventHandler<HTMLInputElement>,
  className?: string,
  required?: boolean
} ) {
  return (
    <input
      required = {required}
      type="tel"
      placeholder="+233"
      value={phone}
      onChange={onChange}
      className={className}
    />
  )
}

export default PhoneInput

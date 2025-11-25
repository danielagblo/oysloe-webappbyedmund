import { useRef } from "react";

interface OTPInputProps {
  length: number;
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
}

const OTPInput = ({ length = 6, otp, setOtp }: OTPInputProps) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevIndex = index - 1;
      const newOtp = [...otp];
      newOtp[prevIndex] = "";
      setOtp(newOtp);
      inputsRef.current[prevIndex]?.focus();
    }
  };

  return (
    <>
      {otp.map((value, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          className="w-9 h-12 text-center text-xl font-bold text-gray-800 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-200"
          inputMode="numeric"
        />
      ))}
    </>
  );
};

export default OTPInput;

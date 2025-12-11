import { Link } from "react-router-dom";

function OTPLogin() {
  return (
    <Link to="/enterphone" state={{ phone: "", mode: "otp-login" }}>
      <button className="px-8 py-3 w-full bg-[#F9F9F9] text-black rounded-full text-[9px] sm:text-xs cursor-pointer hover:bg-gray-100 transition">
        OTP Login
      </button>
    </Link>
  );
}

export default OTPLogin;

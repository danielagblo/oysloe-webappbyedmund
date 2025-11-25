import { Link } from "react-router-dom"

function OTPLogin() {
  return (
    <Link
      to="/enterphone"
      state={{ phone: "", mode: "otp-login" }}
    >
      <button
        className="px-8 py-3 w-full bg-[#F9F9F9] text-black rounded-full text-[9px]"
      >
        OTP Login
      </button>
    </Link>
  )
}

export default OTPLogin

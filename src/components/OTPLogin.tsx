import { Link, useNavigate } from "react-router-dom";
function OTPLogin({ page = "default" }: { page?: string }) {

  const navigate = useNavigate();

  if (page !== "default") {
    return (
      <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/login");
          }}
          className="px-5 py-3 w-full bg-[#F9F9F9] text-(--dark-def) max-sm:bg-white max-sm:h-[47px] max-sm:w-[132px] rounded-full text-[12px] sm:text-xs hover:bg-gray-100 transition cursor-pointer"
        >
          Login
        </button>
    )
  }

  return (
    <Link to="/enterphone" state={{ phone: "", mode: "otp-login" }}>
      <button className="px-8 py-3 w-full bg-[#F9F9F9] max-sm:bg-white max-sm:h-[50px] max-sm:text-(--dark-def) max-sm:w-[152px] text-black rounded-full text-[12px] sm:text-xs cursor-pointer hover:bg-gray-100 transition">
        OTP Login
      </button>
    </Link>
  );
}

export default OTPLogin;

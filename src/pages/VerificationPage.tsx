import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import OnboardingScreen from "../components/OnboardingScreen";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { useState } from "react";
import { useVerifyOTP } from "../features/verifyOTP/useVerifyOTP";
import OTPInput from "../components/OTPINput";

const VerificationPage = () => {
  const isSmall = useIsSmallScreen();
  const shouldShowOnboarding =
    typeof window !== "undefined"
      ? localStorage.getItem("oysloe_onboarding_seen") !== "true"
      : true;

  const { verifyOTP, loading, error } = useVerifyOTP();
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone ?? "";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (!phone || otpValue.length !== 6) return;

    try {
      await verifyOTP(phone, otpValue);
      navigate("/homepage");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-11/12 sm:w-[60%] m-8">
        <div className="flex flex-col gap-5 items-center justify-center">
          <h2 className="text-2xl">OTP Login</h2>
          <form className="w-4/5 h-4/5 overflow-y-auto relative">
            <div className="flex flex-col items-center p-8 bg-white rounded-lg">
              <div className="flex space-x-2" id="otp-container">
                <OTPInput length={6} otp={otp} setOtp={setOtp} />
              </div>
            </div>
            <p className="text-center font-extralight">
              Enter the code sent to your phone number
            </p>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="flex flex-col gap-3 w-full mt-8">
              <Button
                name={loading ? "Verifying..." : "Submit"}
                onClick={handleSubmit}
              />
            </div>
            <h6 className="text-[10px] m-2.5 text-center">Can't Login?</h6>
            <div className="flex gap-2 justify-center items-center">
              <Link to={"/reset-password/email"}>
                <button className="px-5 py-3 w-full bg-[#F9F9F9] text-black rounded-full text-[9px]">
                  Password Reset
                </button>
              </Link>
              <Link to={"/reset-password/phone"}>
                <button className="px-8 py-3 w-full bg-[#F9F9F9] text-black rounded-full text-[9px]">
                  OTP Login
                </button>
              </Link>
            </div>
          </form>
        </div>
        <h2 className="font-extralight mt-20">
          Don't have an account ?
          <Link to="/signUp">
            <h2 className="text-black inline opacity-100"> Sign up</h2>
          </Link>
        </h2>
      </div>
      {isSmall ? (
        shouldShowOnboarding ? (
          <OnboardingScreen
            overlay
            onFinish={() => window.location.assign("/login")}
          />
        ) : null
      ) : (
        <OnboardingScreen />
      )}
    </div>
  );
};

export default VerificationPage;

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import OnboardingScreen from "../components/OnboardingScreen";
import OTPInput from "../components/OTPInput";
import OTPLogin from "../components/OTPLogin";
import { ResetDropdown } from "../components/ResetDropdown";
import { useVerifyOTP } from "../features/verifyOTP/useVerifyOTP";
import useIsSmallScreen from "../hooks/useIsSmallScreen";

const VerificationPage = () => {
  const isSmall = useIsSmallScreen();
  const shouldShowOnboarding =
    typeof window !== "undefined"
      ? localStorage.getItem("oysloe_onboarding_seen") !== "true"
      : true;

  const { verifyOTP, loading, error } = useVerifyOTP();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone ?? "";

  let mode = location.state?.mode ?? "reset-password";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const handleSubmit = async (e: React.FormEvent) => {
    mode = location.state?.mode ?? "reset-password";
    console.log("Button CLicked!");
    e.preventDefault();
    const otpValue = otp.join("");
    if (!phone || otpValue.length !== 6) {
      return;
    }

    try {
      if (mode === "otp-login") {
        setLocalLoading(true);
        setLocalError(null);
        // const resp =
        const resp = (await verifyOTP(phone, otpValue)) as {
          token: string;
          user: unknown;
        };
        // store token and user
        localStorage.setItem("oysloe_token", resp.token);
        localStorage.setItem("oysloe_user", JSON.stringify(resp.user));
        navigate("/homepage");
      } else {
        // reset-password flow
        // const resp =
        await verifyOTP(phone, otpValue);
        // localStorage.setItem("oysloe_token", resp.token);
        // localStorage.setItem("oysloe_user", JSON.stringify(resp.user));
        navigate("/resetpassword", { state: { phone } });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(err);
      setLocalError(msg);
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-11/12 sm:w-full m-8">
        <div className="flex flex-col gap-5 items-center justify-center">
          <h2 className="text-2xl">OTP Login</h2>
          <form className="w-4/5 relative">
            <div className="flex flex-col items-center p-8 bg-white rounded-lg">
              <div className="flex space-x-2" id="otp-container">
                <OTPInput length={6} otp={otp} setOtp={setOtp} />
              </div>
            </div>
            <p className="text-center font-extralight">
              Enter the code sent to your phone number
            </p>
            {(error || localError) && (
              <p className="text-red-500 text-center">{error ?? localError}</p>
            )}
            <div className="flex flex-col gap-3 w-full mt-8">
              <Button
                type="submit"
                name={loading || localLoading ? "Verifying..." : "Submit"}
                onClick={handleSubmit}
              />
            </div>
            <h6 className="text-[10px] m-2.5 text-center">Can't Login?</h6>
            <div className="flex gap-2 justify-center items-center">
              <ResetDropdown />
              <OTPLogin />
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

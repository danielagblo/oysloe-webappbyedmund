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
        const resp = (await verifyOTP(phone, otpValue)) as Record<string, unknown>;
        let token: string | null = null;
        try {
          const data = (resp as any)?.data;
          token = (resp as any)?.token ?? (resp as any)?.reset_token ?? data?.token ?? data?.reset_token ?? null;
          if (token && typeof window !== "undefined") {
            localStorage.setItem("oysloe_reset_token", String(token));
          }
        } catch (e) {
          void e;
        }
        navigate("/resetpassword", { state: { phone, token } });
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
    <div className="h-screen max-sm:bg-(--bg) w-screen flex text-(--dark-def) items-center max-sm:items-start justify-center max-sm:justify-center">
      <div className="flex flex-col items-center justify-center w-11/12 sm:w-full m-8 max-sm:pb-20">
        <div className="flex flex-col gap-5 items-center justify-center">
          <h2 className="text-2xl max-sm:text-[28px]">OTP Login</h2>
          <form className="w-4/5 max-sm:w-full relative">
            <div className="flex flex-col items-center p-8 max-sm:bg-(--bg) bg-white rounded-lg">
              <div className="flex space-x-2" id="otp-container">
                <OTPInput length={6} otp={otp} setOtp={setOtp} />
              </div>
            </div>
            <p className="text-center max-sm:text-[20px] text-gray-600 max-sm:px-4">
              Enter the code sent to your phone number
            </p>
            {(error || localError) && (
              <p className="text-red-500 text-center">{error ?? localError}</p>
            )}
            <div className="flex flex-col gap-3 w-full mt-8 max-sm:px-4">
              <Button
                type="submit"
                className="bg-[#74FFA7] hover:bg-[#74FFA7]/80 max-sm:h-[60px] max-sm:w-[85vw] max-sm:rounded-2xl text-(--dark-def) max-sm:text-[18px]"
                name={loading || localLoading ? "Verifying..." : "Submit"}
                //should countdown 60 seconds then allows you to resend OTP
                onClick={handleSubmit}
              />
            </div>
            <h6 className="text-[16px] my-4 max-sm:mb-8 max-sm:my-6 sm:text-sm text-center">
              Can't Login?
            </h6>
            <div className="flex gap-2 max-sm:gap-[18px] justify-center items-center">
              <ResetDropdown />
              <OTPLogin page="otp-login" />
            </div>
          </form>
        </div>
        <h2 className="max-sm:mt-0 max-sm:fixed max-sm:bottom-4 max-sm:text-[14px] mt-20">
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

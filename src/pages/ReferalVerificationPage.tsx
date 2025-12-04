import { useEffect, useState } from "react";
import type { Location } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "../components/Button";
import OnboardingScreen from "../components/OnboardingScreen";
import { useRegister } from "../features/Auth/useAuth";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import type { RegisterRequest } from "../types/Auth";

const ReferalVerificationPage = () => {
  const isSmall = useIsSmallScreen();
  const shouldShowOnboarding =
    typeof window !== "undefined"
      ? localStorage.getItem("oysloe_onboarding_seen") !== "true"
      : true;

  const location = useLocation() as Location & { state?: { registerData?: RegisterRequest } };
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const incoming = location.state?.registerData;

  const [referralCode, setReferralCode] = useState<string>(
    incoming?.referral_code || "",
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If this page was opened directly without register data, redirect back to signup
    if (!incoming) {
      navigate("/signup");
    }
  }, [incoming, navigate]);

  const handleVerify = async () => {
    setError(null);
    if (!incoming) return;

    const payload: RegisterRequest = {
      ...incoming,
      referral_code: referralCode || incoming.referral_code || "",
    };

    try {
      await registerMutation.mutateAsync(payload as any);
      // After successful registration, navigate to login (mutation already stores token/user)
      toast.success("Registration successful!");
      navigate("/login");
      toast.success("Registration successful!");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : err && typeof err === "object" && "message" in err
            ? (err as any).message
            : "Verification/registration failed. Please try again.";
      setError(errorMessage as string);
      toast.error(error)
    }
  };
  const handleSkip = async () => {
    setError(null);
    if (!incoming) return;

    const payload: RegisterRequest = {
      ...incoming,
    };

    try {
      await registerMutation.mutateAsync(payload as any);
      // After successful registration, navigate to login (mutation already stores token/user)
      toast.success("Registration successful!");
      navigate("/login");
      toast.success("Registration successful!");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : err && typeof err === "object" && "message" in err
            ? (err as any).message
            : "Verification/registration failed. Please try again.";
      setError(errorMessage as string);
      toast.error(error)
    }
  }
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-11/12 sm:w-[60%] m-8">
        <div className="flex flex-col gap-5 items-center justify-center">
          <div className="w-7/8 h-4/5 overflow-y-auto relative">
            <input
              type="text"
              placeholder="Referal code (Optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="border-gray-100 border-2 px-7 py-2 w-full bg-[8px_center] bg-[length:18px_18px] bg-no-repeat bg-[url(Referral.svg)] rounded-lg focus:border-gray-400  outline-0"
            />
            <div className="flex flex-col gap-5 w-full mt-5 justify-center items-center">
              <Button name="Verify" onClick={handleVerify} />
              <button className="flex items-center justify-center bg-[#F9F9F9] px-5 py-3 rounded-full text-black gap-3" onClick={handleSkip}>
                <h2 className="">Skip</h2>
                <img src="skip.svg" alt="Skip" className="h-3" />
              </button>
            </div>
          </div>
        </div>
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

export default ReferalVerificationPage;

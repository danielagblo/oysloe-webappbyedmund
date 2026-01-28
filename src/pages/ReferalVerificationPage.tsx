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

  const location = useLocation() as Location & {
    state?: { registerData?: RegisterRequest };
  };
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const incoming = location.state?.registerData;

  const [referralCode, setReferralCode] = useState<string>(
    incoming?.referral_code || "",
  );
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    // If this page was opened directly without register data, redirect back to signup
    if (!incoming) {
      navigate("/signup");
    }
  }, [incoming, navigate]);

  const handleVerify = async () => {
    setError(null);
    if (!incoming) return;

    // If client is offline, show friendly message and do not attempt registration
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const friendlyOffline =
        "No internet connection. Please check your network and try again.";
      // eslint-disable-next-line no-console
      console.warn("Attempted registration while offline");
      setError(friendlyOffline);
      toast.error(friendlyOffline);
      return;
    }

    const payload: RegisterRequest = {
      ...incoming,
      referral_code: referralCode || incoming.referral_code || "",
    };

    try {
      const data = await registerMutation.mutateAsync(payload as any);
      // Ensure token/user stored (mutation onSuccess already does this, but double-check)
      try {
        if (data?.token) {
          localStorage.setItem("oysloe_token", data.token);
        }
        if (data?.user) {
          localStorage.setItem("oysloe_user", JSON.stringify(data.user));
        }
      } catch (e) {
        void e;
      }
      // After successful registration, navigate to homepage
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : err && typeof err === "object" && "message" in err
            ? (err as any).message
            : "Verification/registration failed. Please try again.";
      // Log raw error for debugging, but show a friendly message to the user
      // and avoid leaking internal error details.
      // eslint-disable-next-line no-console
      console.error("Registration error:", errorMessage, err);
      const friendly = "Verification/registration failed. Please try again.";
      setError(friendly);
      toast.error(friendly);
    }
  };
  const handleSkip = async () => {
    setError(null);
    if (!incoming) return;

    // If client is offline, show friendly message and do not attempt registration
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const friendlyOffline =
        "No internet connection. Please check your network and try again.";
      // eslint-disable-next-line no-console
      console.warn("Attempted registration while offline");
      setError(friendlyOffline);
      toast.error(friendlyOffline);
      return;
    }

    const payload: RegisterRequest = {
      ...incoming,
    };

    try {
      const data = await registerMutation.mutateAsync(payload as any);
      // Ensure token/user stored (mutation onSuccess already does this, but double-check)
      try {
        if (data?.token) {
          localStorage.setItem("oysloe_token", data.token);
        }
        if (data?.user) {
          localStorage.setItem("oysloe_user", JSON.stringify(data.user));
        }
      } catch (e) {
        void e;
      }
      // After successful registration, navigate to homepage
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : err && typeof err === "object" && "message" in err
            ? (err as any).message
            : "Verification/registration failed. Please try again.";
      // Log raw error for debugging, but show a friendly message to the user
      // and avoid leaking internal error details.
      // eslint-disable-next-line no-console
      console.error("Registration error:", errorMessage, err);
      const friendly = "Verification/registration failed. Please try again.";
      setError(friendly);
      toast.error(friendly);
    }
  };
  return (
    <div className="h-screen max-sm:bg-(--bg) w-screen flex items-center max-sm:items-start justify-center max-sm:justify-center">
      <div className="flex flex-col items-center justify-center w-full sm:w-[60%] m-8">
        <div className="flex flex-col gap-5 items-center justify-center">
          <h2 className="text-2xl max-sm:text-[28px]">Referral Verification</h2>
          <div className="w-7/8 max-sm:w-full h-4/5 overflow-y-auto relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Referal code (Optional)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="border-gray-100 max-sm:bg-white max-sm:h-[60px] max-sm:w-[85vw] max-sm:text-[16px] max-sm:rounded-2xl max-sm:border-gray-300 max-sm:pl-12 border-2 px-7 py-2 w-full rounded-lg focus:border-gray-200  outline-0"
              />
              <img
                src="/Referral.svg"
                alt="Referral Icon"
                className="absolute h-5 w-5 left-2 top-3  max-sm:left-4 max-sm:top-5 max-sm:h-6 max-sm:w-6"
              />
            </div>
            <div className="flex flex-col gap-5 w-full mt-5 justify-center items-center">
              <Button
                name="Verify"
                className="bg-[#74FFA7] hover:bg-[#74FFA7]/80 max-sm:h-[60px] max-sm:w-[85vw] max-sm:rounded-2xl text-(--dark-def) max-sm:text-[18px]"
                onClick={handleVerify}
              />
              <button
                className="flex hover:bg-gray-100 transition cursor-pointer items-center justify-center bg-[#F9F9F9] px-5 py-3 rounded-full text-black gap-3"
                onClick={handleSkip}
              >
                <h2>Skip</h2>
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
            onFinish={() => window.location.assign("/")}
          />
        ) : null
      ) : (
        <OnboardingScreen />
      )}
    </div>
  );
};

export default ReferalVerificationPage;

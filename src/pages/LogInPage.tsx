import type { FormEvent } from "react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Button from "../components/Button";
import OnboardingScreen from "../components/OnboardingScreen";
import OTPLogin from "../components/OTPLogin";
import { ResetDropdown } from "../components/ResetDropdown";
import { useLogin } from "../features/Auth/useAuth";
import useIsSmallScreen from "../hooks/useIsSmallScreen";

const LogInPage = () => {
  const navigate = useNavigate();
  const isSmall = useIsSmallScreen();

  const shouldShowOnboarding =
    typeof window !== "undefined"
      ? localStorage.getItem("oysloe_onboarding_seen") !== "true"
      : true;

  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    },
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCompleteSteps, setShowCompleteSteps] = useState(false);
  const loginMutation: ReturnType<typeof useLogin> = useLogin();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    setIsLoading(true);
    // Ask the user on first login whether they want notifications.
    try {
      if (typeof window !== "undefined") {
        const ASKED_KEY = "oysloe_notifications_asked";
        const OPT_IN_KEY = "oysloe_notifications_opt_in";
        const asked = localStorage.getItem(ASKED_KEY) === "true";
        if (!asked) {
          const allow = window.confirm(
            "Would you like to enable push notifications? You can change this later in settings.",
          );
          try {
            localStorage.setItem(ASKED_KEY, "true");
            localStorage.setItem(OPT_IN_KEY, allow ? "true" : "false");
          } catch {
            // ignore storage errors
          }
          if (allow && typeof Notification !== "undefined" && Notification.permission !== "granted") {
            // eslint-disable-next-line no-await-in-loop
            await Notification.requestPermission();
          }
        } else {
          // If previously opted-in but permission not yet granted, request again on gesture
          const opted = localStorage.getItem("oysloe_notifications_opt_in") === "true";
          if (opted && typeof Notification !== "undefined" && Notification.permission !== "granted") {
            // eslint-disable-next-line no-await-in-loop
            await Notification.requestPermission();
          }
        }
      }
    } catch (permErr) {
      void permErr;
    }

    // Show the "Complete steps" prompt after successful login
    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });
      setShowCompleteSteps(true);
    } catch (err) {
      // Parse backend error payload when apiClient throws an Error containing
      // the response body (e.g. '... failed (401) {"error_message":" Incorrect Credentials",...}')
      const parseBackendError = (e: unknown): string => {
        if (e instanceof Error) {
          const text = e.message || "";
          // try to find a JSON object in the error message
          const start = text.indexOf("{");
          const end = text.lastIndexOf("}");
          if (start !== -1 && end !== -1 && end > start) {
            const json = text.substring(start, end + 1);
            try {
              const parsed = JSON.parse(json) as any;
              const candidate =
                parsed?.error_message ||
                parsed?.message ||
                parsed?.detail ||
                parsed?.error;
              if (candidate) {
                if (Array.isArray(candidate)) return candidate.join(" ").trim();
                return String(candidate).trim();
              }
            } catch {
              // ignore JSON parse errors
            }
          }

          // fallback patterns: map known backend text to user-friendly messages
          const lower = text.toLowerCase();
          if (lower.includes("incorrect") && lower.includes("credentials"))
            return "Email or password is incorrect. Please try again.";

          // Generic fallback (do not expose raw backend payload)
          return "Login failed. Please check your credentials and try again.";
        }
        return "Login failed. Please try again.";
      };

      const userMessage = parseBackendError(err);
      toast.error(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-sm:bg-(--bg) h-screen w-screen flex items-center max-sm:items-start justify-center max-sm:justify-center">
      <Helmet>
        <title>Login | OYSLOE</title>
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="flex flex-col items-center justify-center w-11/12 sm:w-full m-8 max-sm:pb-20">
        <div className="flex flex-col gap-5 max-sm:gap-10 items-center justify-center">
          <div className="w-full max-sm:text-(--dark-def) flex mb-4 justify-center items-center">
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem("oysloe_guest", "true");
                } catch { }
                navigate("/");
              }}
              className="text-sm px-2 py-1 pl-3 cursor-pointer text-gray-500 bg-(--div-active) rounded-full hover:bg-gray-100 transition max-sm:fixed max-sm:top-4 max-sm:right-4 max-sm:bg-transparent max-sm:hover:bg-transparent"
            >
              Skip &nbsp;
              <img className="inline h-4 w-4" src="/skip.svg" alt=">" />
            </button>
          </div>
          <h2 className="text-2xl max-sm:text-[28px]">Welcome!</h2>
          <form className="relative max-sm:space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border-gray-100 max-sm:bg-white max-sm:h-[60px] max-sm:w-[85vw] max-sm:text-[16px] max-sm:rounded-2xl border-2 max-sm:border-gray-300 px-8 max-sm:pl-12 py-2 w-full rounded-lg focus:border-gray-400  outline-0"
                />
                <img
                  src="/mailbox-svgrepo-com.svg"
                  alt="Email"
                  className="absolute left-2 max-sm:left-4 top-3 max-sm:top-5 h-5 max-sm:h-6 max-sm:w-6 w-5"
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border-gray-100 max-sm:bg-white max-sm:text-[16px] max-sm:h-[60px] max-sm:w-[85vw] max-sm:rounded-2xl border-2 max-sm:border-gray-300 px-8 max-sm:pl-12 py-2 w-full rounded-lg focus:border-gray-400 outline-0 pr-10"
                />
                <img
                  src="/Passwordkey.svg"
                  alt="Password"
                  className="absolute left-2 top-3 h-5 max-sm:h-6 max-sm:left-4 max-sm:top-5 max-sm:w-6 w-5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 max-sm:right-4 max-sm:top-5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3 w-full mt-3">
              <Button
                type="submit"
                name={isLoading ? "Logging in..." : "Log In"}
                className="bg-[#74FFA7] hover:bg-[#74FFA7]/80 max-sm:h-[60px] max-sm:w-[85vw] max-sm:rounded-2xl text-(--dark-def) max-sm:text-[18px]"
                disabled={isLoading}
              />
            </div>
            <h6 className="text-[16px] sm:text-sm my-4 max-sm:mb-8 max-sm:my-6 text-center">
              Can't Login?
            </h6>
            <div className="flex gap-2 max-sm:gap-[18px] justify-center items-center">
              <ResetDropdown />

              <OTPLogin />
            </div>
          </form>
        </div>
        <h2 className="text-[#646161] mt-20 max-sm:mt-0 max-sm:fixed max-sm:bottom-4 max-sm:text-[14px]">
          Don't have an account ? &nbsp;
          <Link to="/signUp">
            <h2 className="text-black inline opacity-100 hover:underline">
              Sign up
            </h2>
          </Link>
        </h2>
      </div>
      {isSmall ? (
        shouldShowOnboarding ? (
          <OnboardingScreen overlay onFinish={() => navigate("/login")} />
        ) : null
      ) : (
        <div className="lg:w-full lg:h-[90vh] lg:pr-5">
          <OnboardingScreen />
        </div>
      )}

      {showCompleteSteps && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className={`bg-white w-full overflow-y-auto no-scrollbar sm:max-w-md sm:max-h-[85vh] max-sm:rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-7 ${
              isSmall ? "max-sm:pb-8" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <p className="text-[15px] sm:text-[1.2vw] text-gray-700 font-medium leading-snug pr-6">
                Showcase your brand to credible buyers across the internet
                (Tiktok, Google, Facebook) on Oysloe.
              </p>
              <button
                type="button"
                onClick={() => {
                  setShowCompleteSteps(false);
                  navigate("/homepage");
                }}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.361-4.36a1 1 0 111.414 1.414L13.414 10.586l4.36 4.361a1 1 0 01-1.414 1.414L12 12l-4.361 4.361a1 1 0 01-1.414-1.414l4.36-4.361-4.36-4.36a1 1 0 010-1.415z" />
                </svg>
              </button>
            </div>

            <p className="text-sm sm:text-[1.1vw] text-gray-500 mt-2">
              Complete this 3 simple steps to start earning-10x
            </p>

            <div className="mt-5 rounded-3xl bg-gray-50 p-4">
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-[#A6F4B8] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0F5132"
                      strokeWidth="1.5"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                      />
                    </svg>
                  </div>
                  <div className="w-px flex-1 bg-gray-300 my-2" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold lg:text-[1.25vw] text-gray-800">Finalize Account Setup</p>
                  <p className="text-sm lg:text-[1.1vw] text-gray-500">
                    Upload the required remaining details, of the business at{" "}
                    <span 
                      className="bg-yellow-300 px-1 cursor-pointer rounded-sm font-semibold text-gray-900"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowCompleteSteps(false);
                        try {
                          localStorage.setItem("profile_active_tab", "profile");
                        } catch {
                          // ignore storage errors
                        }
                        navigate("/profile");
                      }}
                    >
                      Edit Profile
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 mt-4">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-[#DDF59B] flex items-center justify-center">
                    <img className="p-2" src="/subecribe.svg" alt="subscribe" />
                  </div>
                  <div className="w-px flex-1 bg-gray-300 my-2" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold sm:text-[1.25vw] text-gray-800">Subscribe To Boost 10x</p>
                  <p className="text-sm lg:text-[1.1vw] text-gray-500">
                    Activate a subscription to unlock full access, promote your
                    listings
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 mt-4">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-[#F2D19B] flex items-center justify-center">

                    <img className="p-2.5" src="/Post.svg" alt="post" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold lg:text-[1.25vw] text-gray-800">Post Ads Now</p>
                  <div className="mt-1 text-sm lg:text-[1.1vw] text-gray-500">
                    You're set 100% to upload unlimited ads to real buyers
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowCompleteSteps(false);
                try {
                  localStorage.setItem("profile_active_tab", "profile");
                } catch {
                  // ignore storage errors
                }
                navigate("/profile");
              }}
              className="mt-5 w-full rounded-2xl bg-[#9AF4A5] py-4 text-base lg:text-[1.25vw] font-semibold text-gray-800 hover:bg-[#86ee95] transition"
            >
              Complete steps
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Skip if you’re not a business owner
            </p>
            <button
              type="button"
              onClick={() => {
                setShowCompleteSteps(false);
                navigate("/homepage");
              }}
              className="mt-2 w-full rounded-2xl border border-transparent hover:bg-transparent cursort-pointer hover:border-gray-200 py-3 text-sm hover:text-gray-600 bg-gray-100 transition"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogInPage;

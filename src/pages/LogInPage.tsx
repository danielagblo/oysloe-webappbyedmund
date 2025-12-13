import type { FormEvent } from "react";
import { useState } from "react";
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
    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      });
      navigate("/");
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
      <div className="flex flex-col items-center justify-center w-11/12 sm:w-full m-8 max-sm:pb-20">
        <div className="flex flex-col gap-5 max-sm:gap-10 items-center justify-center">
          <div className="w-full max-sm:text-(--dark-def) flex mb-4 justify-center items-center">
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem("oysloe_guest", "true");
                } catch {}
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
    </div>
  );
};

export default LogInPage;

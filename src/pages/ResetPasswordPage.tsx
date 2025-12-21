import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import LottieSuccess from "../components/LottieSuccess";
import OnboardingScreen from "../components/OnboardingScreen";
import PhoneInput from "../components/PhoneInput";
import { ResetDropdown } from "../components/ResetDropdown";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { resetPassword } from "../services/authService";

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const phoneFromState = location.state?.phone ?? "";
  // Token saved after OTP was sent. OTP flow should save this as
  // localStorage.setItem('oysloe_reset_token', token) or pass via location.state
  const tokenFromState =
    (location.state as any)?.token ??
    (typeof window !== "undefined" ? localStorage.getItem("oysloe_reset_token") : null) ??
    "";
  const isSmall = useIsSmallScreen();
  const shouldShowOnboarding =
    typeof window !== "undefined"
      ? localStorage.getItem("oysloe_onboarding_seen") !== "true"
      : true;

  const [phone, setPhone] = useState(phoneFromState);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!phone) {
      setError("Phone number is required");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required");
      return;
    }

    const validatePassword = (pw: string) => {
      const errors: string[] = [];
      if (!pw || pw.length < 12) {
        errors.push("be at least 12 characters long");
      }
      if (!/[a-z]/.test(pw)) {
        errors.push("include a lowercase letter");
      }
      if (!/[A-Z]/.test(pw)) {
        errors.push("include an uppercase letter");
      }
      if (!/[0-9]/.test(pw)) {
        errors.push("include a number");
      }
      if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)) {
        errors.push("include a symbol (e.g. !@#$%)");
      }
      return errors;
    };

    const pwErrors = validatePassword(newPassword);
    if (pwErrors.length > 0) {
      setError(`Password must ${pwErrors.join(", ")}.`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    // Ensure reset token (from OTP) is available to include with the update
    const resetToken = tokenFromState;
    if (!resetToken) {
      setError("Reset token not found. Please request a new OTP.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(
        {
          phone: phone,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        // send reset token in Authorization header with 'Token ' prefix
        { Authorization: `Token ${resetToken}` },
      );
      // remove stored token after successful password reset
      try {
        localStorage.removeItem("oysloe_reset_token");
      } catch { }
      setShowModal(true);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to reset password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen max-sm:bg-(--bg) w-screen flex items-center max-sm:items-start justify-center max-sm:justify-center">
      <div className="flex flex-col items-center justify-center w-11/12 sm:w-full m-8 max-sm:pb-20">
        <div className="flex sm:w-7/10 flex-col gap-5 max-sm:space-y-6 items-center justify-center">
          <div className="w-full flex mb-4 justify-center items-center">
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
          <h2 className="text-2xl max-sm:text-[28px]">Create New Password</h2>
          <form
            className="w-3/5 max-sm:space-y-6 max-md:w-full"
            onSubmit={handleSubmit}
          >
            {error && (
              <p className="text-red-500 text-center max-sm:text-sm">{error}</p>
            )}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <PhoneInput
                  phone={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="max-sm:bg-white max-sm:h-[60px] max-sm:w-[85vw] max-sm:text-[16px] max-sm:rounded-2xl border-2 max-sm:border-gray-300 max-sm:pl-12 border-gray-100 px-8 py-2 pl-10 w-full rounded-lg focus:border-gray-400 outline-0"
                  required
                />
                <img
                  src="/phone.svg"
                  alt="phone"
                  className="absolute h-6 w-6 left-2 top-3 max-sm:left-4 max-sm:top-5 max-sm:h-6 max-sm:w-6"
                />
              </div>
              <p className="text-left max-sm:text-[12px]  text-sm text-gray-600">
                Use the phone number linked to your account
              </p>
            </div>
            <div className="flex flex-col gap-3 mt-3 max-sm:-mt-2">
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border-gray-100 border-2 px-8 py-2 pl-10 w-full rounded-lg focus:border-gray-400 outline-0 max-sm:h-[60px] max-sm:w-[85vw] max-sm:bg-white max-sm:border-gray-300 max-sm:rounded-2xl max-sm:text-[16px] max-sm:pl-12 pr-10"
                />
                <img
                  src="/Passwordkey.svg"
                  alt="Password"
                  className="absolute left-2 max-sm:left-4 top-3 max-sm:top-5 h-5 max-sm:h-6 max-sm:w-6 w-5"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3 max-sm:right-4 max-sm:top-5 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
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
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border-gray-100 border-2 px-8 py-2 pl-10 w-full rounded-lg focus:border-gray-400 outline-0 max-sm:h-[60px] max-sm:w-[85vw] max-sm:bg-white max-sm:border-gray-300 max-sm:rounded-2xl max-sm:text-[16px] max-sm:pl-12 pr-10"
                />
                <img
                  src="/Passwordkey.svg"
                  alt="Password"
                  className="absolute left-2 max-sm:left-4 top-3 max-sm:top-5 h-5 max-sm:h-6 max-sm:w-6 w-5"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 max-sm:right-4 max-sm:top-5 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
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
            <div className="mt-8">
              <Button
                type="submit"
                name={loading ? "Updating..." : "Update Password"}
                disabled={loading}
                className="bg-[#74FFA7] hover:bg-[#74FFA7]/80 max-sm:h-[60px] max-sm:w-[85vw] max-sm:rounded-2xl text-(--dark-def) max-sm:text-[18px]"
              />
            </div>
            <h6 className="sm:text-sm my-4 text-center max-sm:mb-8 text-[16px] max-sm:hidden">
              Can't Login?
            </h6>
            <div className="flex gap-2 max-sm:gap-[18px] justify-center items-center">
              <ResetDropdown page="email-reset" />
            </div>
          </form>
        </div>
        <h2 className="max-sm:mt-0 max-sm:fixed max-sm:bottom-4 max-sm:text-[14px] mt-20">
          Don't have an account ? &nbsp;
          <Link to="/signUp">
            <h2 className="text-black inline opacity-100 hover:underline transition">
              Sign up
            </h2>
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
        <div className="lg:w-full lg:h-[90vh] lg:pr-5">
          <OnboardingScreen />
        </div>
      )}
      {!showModal && (
        <div className="h-2/5 w-2/7 max-md:w-9/10 max-lg:w-3/5 max-lg:mt-40 max-sm:p-4 max-sm:h-fit flex flex-col justify-center items-center bg-white border-2 border-gray-100 rounded-4xl shadow-lg absolute z-10">
          <LottieSuccess />
          <h2 className="text-2xl text-center">
            Password successfully
            <br />
            reset!
          </h2>
          <button
            onClick={() => {
              setShowModal(false);
              navigate("/login");
            }}
            className="text-center my-2 cursort-pointer bg-[#F9F9F9] px-3 py-2 rounded-lg text-black"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordPage;

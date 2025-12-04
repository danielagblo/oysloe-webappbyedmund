import type { FormEvent, FormEventHandler } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import OnboardingScreen from "../components/OnboardingScreen";
import OTPLogin from "../components/OTPLogin";
import PhoneInput from "../components/PhoneInput";
import { ResetDropdown } from "../components/ResetDropdown";
import { useRegister } from "../features/Auth/useAuth";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import type { RegisterRequest } from "../types/Auth";

const SignInPage = () => {
  const isSmall = useIsSmallScreen();
  const shouldShowOnboarding =
    typeof window !== "undefined"
      ? localStorage.getItem("oysloe_onboarding_seen") !== "true"
      : true;
  const navigate = useNavigate();

  const [formData, setFormData] = useState<
    RegisterRequest & { confirmPassword: string; agreedToTerms: boolean }
  >({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    referral_code: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const registerMutation = useRegister();
  const [error, setError] = useState<string | null>(null);

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;
    if (name === "phone") {
      newValue = newValue.replace(/[^\d+]/g, "");

      if (newValue.indexOf("+") > 0) {
        newValue = newValue.replace(/\+/g, "");
      }

      if (newValue.startsWith("+233") && newValue.length > 13)
        newValue = newValue.slice(0, 13);
      else if (!newValue.startsWith("+") && newValue.length > 12)
        newValue = newValue.slice(0, 12);
      if (newValue.startsWith("0") && newValue.length > 10)
        newValue = newValue.slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));
  };

  const handleSubmit: FormEventHandler = async (e: FormEvent) => {
    console.log("Form Submitted");
    e.preventDefault();
    setError(null);

    const data = formData;

    // Name validation
    if (!data.name?.trim()) {
      console.log("Name is required");
      setError("Name is required");
      return;
    }

    // Email validation (basic check)
    if (!data.email?.trim()) {
      console.log("Email is required");
      setError("Email is required");
      return;
    }

    // Terms & conditions
    if (!data.agreedToTerms) {
      console.log(
        "You must agree to the Privacy Policy and Terms & Conditions",
      );
      setError("You must agree to the Privacy Policy and Terms & Conditions");
      return;
    }

    // Password validation
    if (!data.password || data.password.length < 6) {
      console.log("Password must be at least 6 characters long");
      setError("Password must be at least 6 characters long");
      return;
    }

    if (data.password !== data.confirmPassword) {
      console.log("Passwords do not match");
      setError("Passwords do not match");
      return;
    }

    // Phone validation & sanitization
    const phoneVal = data.phone.replace(/[^\d+]/g, "");

    // Phone validation (trust sanitization)
    if (!data.phone || data.phone.length === 0) {
      console.log("Phone number is required");
      setError("Phone number is required");
      return;
    }

    try {
      console.log("Redirecting to referral verification...");
      const registerData: RegisterRequest = {
        email: phoneVal === data.phone ? data.email : data.email,
        phone: phoneVal,
        password: data.password,
        name: data.name || "",
        address: data.address || "",
        referral_code: data.referral_code || "",
      };

      // Navigate to the referral verification page first and pass the
      // registration payload in location state so the verification page
      // can handle verification and then submit the registration.
      navigate("/referal-verification", { state: { registerData } });
      return;
    } catch (err) {
      console.log("could not navigate to referral verification");
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Navigation failed. Please try again.";
      setError(errorMessage as string);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center ">
      <div className="flex flex-col items-center justify-center w-11/12 sm:w-full m-8 overflow-auto no-scrollbar h-full py-20">
        <div className=" flex flex-col gap-5 items-center justify-center">
          <h2 className="text-2xl pt-10">Getting started</h2>
          <form className="relative" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                autoComplete="name"
                className="border-gray-100 border-2 px-8 py-2 w-full bg-[8px_center] bg-[length:18px_18px] bg-no-repeat bg-[url(name.svg)] rounded-lg focus:border-gray-400  outline-0"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                required
                className="border-gray-100 border-2 px-8 py-2 w-full bg-[8px_center] bg-[length:18px_18px] bg-no-repeat bg-[url(email.svg)] rounded-lg focus:border-gray-400  outline-0"
              />
              <PhoneInput
                name="phone"
                phone={formData.phone}
                onChange={handleInputChange}
                className="border-gray-100 border-2 px-8 py-2 w-full bg-[8px_center] bg-[length:18px_18px] bg-no-repeat bg-[url(phone.svg)] rounded-lg focus:border-gray-400  outline-0"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="border-gray-100 border-2 px-8 py-2 w-full bg-[8px_center] bg-[length:18px] bg-no-repeat bg-[url(Passwordkey.svg)] rounded-lg focus:border-gray-400 outline-0"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Retype Password"
                value={formData.confirmPassword}
                autoComplete="new-password"
                onChange={handleInputChange}
                required
                className="border-gray-100 border-2 px-8 py-2 w-full bg-[8px_center] bg-[length:18px] bg-no-repeat bg-[url(Passwordkey.svg)] rounded-lg focus:border-gray-400 outline-0"
              />
              <p className="text-[10px] pb-2">
                I have agreed to the
                <Link to="/privacy-policy">
                  <span className="text-black inline"> privacy policy</span>
                </Link>{" "}
                and
                <Link to="/terms">
                  <span className="text-black inline"> terms & conditions</span>
                </Link>
                <label
                  className="relative p-0 rounded-4xl cursor-pointer ml-2 -bottom-1 h-2 w-2 inline"
                  htmlFor="custom-checkbox"
                >
                  {/* <!-- Hidden default checkbox --> */}
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleInputChange}
                    className="peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-400  checked:bg-[url(check.svg)] checked:bg-center checked:bg-no-repeat checked:bg-[length:18px_18px]"
                    id="custom-checkbox"
                    required
                  />
                </label>
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Button
                type="submit"
                name={
                  registerMutation.status === "pending"
                    ? "Signing up..."
                    : "Sign up"
                }
                disabled={registerMutation.status === "pending"}
              />
              <button
                type="button"
                className="flex items-center justify-center bg-[#F9F9F9] px-3 py-2.5 w-full rounded-lg text-black gap-3"
              >
                <img
                  src="https://toppng.com/uploads/preview/google-g-logo-icon-11609362962anodywxeaz.png"
                  alt="Google Logo"
                  className="h-5"
                />
                <h2 className="">Log in with Google</h2>
              </button>
            </div>
            <h6 className="text-[10px] m-2.5 text-center">Can't Login?</h6>
            <div className="flex gap-2 justify-center items-center">
              <ResetDropdown />
              <OTPLogin />
            </div>
          </form>
        </div>
        <h2 className="font-extralight">
          I have an account already ?
          <Link to="/login">
            <h2 className="text-black inline opacity-100"> Login</h2>
          </Link>
        </h2>
      </div>

      {isSmall ? (
        shouldShowOnboarding ? (
          <OnboardingScreen overlay onFinish={() => navigate("/login")} />
        ) : null
      ) : (
        <OnboardingScreen />
      )}
    </div>
  );
};

export default SignInPage;

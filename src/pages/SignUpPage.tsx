import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import OnboardingScreen from "../components/OnboardingScreen";
import { ResetDropdown } from "../components/ResetDropdown";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { register } from "../services/authService";
import type { RegisterRequest } from "../types/Auth";
import PhoneInput from "../components/PhoneInput";
import OTPLogin from "../components/OTPLogin";

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

  const [isLoading, setIsLoading] = useState(false);
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


  const handleSubmit = async (e: FormEvent) => {
    console.log("Form Submitted")
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name || formData.name.trim() === "") {
      setError("Name is required");
      return;
    }
    if (!formData.agreedToTerms) {
      setError("You must agree to the Privacy Policy and Terms & Conditions");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!formData.phone.startsWith("+233")) {
      setError("Phone number must start with +233");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Sending formdata to server...")
      const registerData: RegisterRequest = {
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        name: formData.name || "",
        address: formData.address || "",
        referral_code: formData.referral_code || "",
      };

      const response = await register(registerData);

      // Store token and user data
      localStorage.setItem("oysloe_token", response.token);
      localStorage.setItem("oysloe_user", JSON.stringify(response.user));

      // Navigate to home or verification page
      console.log("taking you to login..");
      
      navigate("/login");
    } catch (err) {
      console.log("could not log you in");
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
                name={isLoading ? "Signing up..." : "Sign up"}
                disabled={isLoading}
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

import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  const [error, setError] = useState<string | null>(null);
  const loginMutation: ReturnType<typeof useLogin> = useLogin();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.email) {
      setError("Email is required");
      return;
    }
    if (!formData.password) {
      setError("Password is required");
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
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-11/12 sm:w-full m-8">
        <div className="flex flex-col gap-5 items-center justify-center">
          <h2 className="text-2xl">Welcome!</h2>
          <form className="relative" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-3">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="border-gray-100 border-2 px-8 py-2 w-full bg-position-[8px_center] bg-size-[18px_18px] bg-no-repeat bg-[url(email.svg)] rounded-lg focus:border-gray-400  outline-0"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="border-gray-100 border-2 px-8 py-2 w-full bg-position-[8px_center] bg-size-[18px] bg-no-repeat bg-[url(Passwordkey.svg)] rounded-lg focus:border-gray-400 outline-0"
              />
            </div>
            <div className="flex flex-col gap-3 w-full mt-3">
              <Button
                type="submit"
                name={isLoading ? "Signing in..." : "Sign In"}
                disabled={isLoading}
              />
              <button className="flex items-center justify-center bg-[#F9F9F9] px-3 py-2.5 w-full rounded-lg text-black gap-3">
                <img
                  src="https://toppng.com/uploads/preview/google-g-logo-icon-11609362962anodywxeaz.png"
                  alt="Google Logo"
                  className="h-5"
                />
                <h2 className="">Sign in with Google</h2>
              </button>
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
          <OnboardingScreen overlay onFinish={() => navigate("/login")} />
        ) : null
      ) : (
        <OnboardingScreen />
      )}
    </div>
  );
};

export default LogInPage;

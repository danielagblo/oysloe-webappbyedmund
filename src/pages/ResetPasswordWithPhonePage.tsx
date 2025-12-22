import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import Button from "../components/Button";
import OnboardingScreen from "../components/OnboardingScreen";
import OTPLogin from "../components/OTPLogin";
import PhoneInput from "../components/PhoneInput";
import { useVerifyOTP } from "../features/verifyOTP/useVerifyOTP";
import { toast } from "sonner";
import { ResetDropdown } from "../components/ResetDropdown";

const ResetPasswordWithPhonePage = ({
  page = "Reset Password",
}: {
  page?: string;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isSmall = useIsSmallScreen();
  const shouldShowOnboarding =
    typeof window !== "undefined"
      ? localStorage.getItem("oysloe_onboarding_seen") !== "true"
      : true;

  const { sendOTP, loading, error } = useVerifyOTP();
  const [phone, setPhone] = useState("");
  const handlePhoneOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/[^\d+]/g, "");
    if (val.indexOf("+") > 0) {
      val = val.replace(/\+/g, "");
    }
    if (val.startsWith("+233") && val.length > 13) val = val.slice(0, 13);
    else if (!val.startsWith("+") && val.length > 12) val = val.slice(0, 12);
    if (val.startsWith("0") && val.length > 10) val = val.slice(0, 10);
    setPhone(val);
  };

  const mode = location.state?.mode ?? "reset-password";
  if (error) console.log(error);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    try {
      const res = await sendOTP(phone);

      if (res?.success === false) {
        console.log("Phone number not found in the system.");
        return;
      }
      navigate("/verification", { state: { phone, mode } });
    } catch (err: unknown) {
      console.error(err);

      toast.error("Phone number not found in the system.");
    }
  };

  return (
    <div className="h-screen max-sm:bg-(--bg) text-(--dark-def) w-screen flex items-center max-sm:items-start justify-center max-sm:justify-center">
      <div className="flex flex-col items-center justify-center w-11/12 sm:w-full m-8 max-sm:pb-20">
        <div className="flex flex-col gap-5 items-center max-sm:space-y-6 justify-center">
          <h2 className="text-2xl max-sm:text-black max-sm:text-[28px]">{page}</h2>
          <form className="w-3/5 max-md:w-full max-sm:space-y-6 relative">
            <div className="relative">
              <PhoneInput
                phone={phone}
                onChange={handlePhoneOnChange}
                className="max-sm:bg-white max-sm:h-[60px] max-sm:w-[85vw] max-sm:text-[16px] max-sm:rounded-2xl max-sm:border-gray-300 max-sm:pl-12 border-gray-100 border-2 px-8 py-3 pl-10 w-full rounded-lg focus:border-gray-400  outline-0"
              />
              <img
                src="/phone.svg"
                alt="phone"
                className="absolute top-4 left-2 h-6 w-6 max-sm:left-4 max-sm:top-5 max-sm:h-6 max-sm:w-6"
              />
            </div>
            <p className="text-center max-sm:text-[17px] text-sm text-gray-600">
              We'll send a verification link to the number if it is in our
              system
            </p>

            <div className="flex flex-col gap-3 w-full mt-8">
              <Button
                type="submit"
                name={loading ? "Sending..." : "Submit"}
                onClick={handleSubmit}
                className="bg-[#74FFA7] hover:bg-[#74FFA7]/80 max-sm:h-[60px] max-sm:w-[85vw] max-sm:rounded-2xl text-(--dark-def) max-sm:text-[18px]"
              />
            </div>
            <h6 className="sm:text-sm my-4 text-center max-sm:mb-8 text-[16px] max-sm:my-6">
              Can't Login?
            </h6>
            <div className="flex gap-2 max-sm:gap-[18px] justify-center items-center">
              <ResetDropdown />
              <OTPLogin page="phone-reset" />
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

export default ResetPasswordWithPhonePage;

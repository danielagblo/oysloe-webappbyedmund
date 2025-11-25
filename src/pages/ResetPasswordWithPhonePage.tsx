import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import OnboardingScreen from "../components/OnboardingScreen";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { useState } from "react";
import { useVerifyOTP } from "../features/verifyOTP/useVerifyOTP";
import { ResetDropdown } from "../components/ResetDropdown";

const ResetPasswordWithPhonePage = ({
  page = "Reset Password",
}: {
  page?: string;
}) => {
  const navigate = useNavigate();
  const isSmall = useIsSmallScreen();
  const shouldShowOnboarding =
    typeof window !== "undefined"
      ? localStorage.getItem("oysloe_onboarding_seen") !== "true"
      : true;

  const { sendOTP, loading, error } = useVerifyOTP();
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    try {
      const res = await sendOTP(phone);

      if (res?.success === false) {
        console.log("Phone number not found in the system.");
        return;
      }
      navigate("/verification", { state: { phone } });
    } catch (err: unknown) {
      console.error(err);

      alert("Phone number not found in the system.");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-11/12 sm:w-full m-8">
        <div className="flex flex-col gap-5 items-center justify-center">
          <h2 className="text-2xl">{page}</h2>
          <form className="w-3/5 relative">
            <input
              type="tel"
              placeholder="+233"
              value={phone}
              onChange={(e) => {
                let val = e.target.value;
                val = val.replace(/[^\d+]/g, "");
                if (val.indexOf("+") > 0) {
                  val = val.replace(/\+/g, "");
                }
                if (val.startsWith("+233") && val.length > 13)
                  val = val.slice(0, 13);
                else if (!val.startsWith("+") && val.length > 12)
                  val = val.slice(0, 12);
                if (val.startsWith("0") && val.length > 10)
                  val = val.slice(0, 10);
                setPhone(val);
              }}
              className="border-gray-100 border-2 px-8 py-2 w-full bg-[8px_center] bg-[length:18px_18px] bg-no-repeat bg-[url(phone.svg)] rounded-lg focus:border-gray-400  outline-0"
            />
            <p className="text-center font-extralight">
              We'll send a verification link to the number if it is in our
              system
            </p>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="flex flex-col gap-3 w-full mt-8">
              <Button
                name={loading ? "Sending..." : "Submit"}
                onClick={handleSubmit}
              />
            </div>
            <h6 className="text-[10px] m-2.5 text-center">Can't Login?</h6>
            <div className="flex gap-2 justify-center items-center">
              <ResetDropdown />
              <Link to={"/enterphone"}>
                <button className="px-8 py-3 w-full bg-[#F9F9F9] text-black rounded-full text-[9px]">
                  OTP Login
                </button>
              </Link>
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

export default ResetPasswordWithPhonePage;

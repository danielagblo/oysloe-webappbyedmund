import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import LottieSuccess from "../components/LottieSuccess";
import OnboardingScreen from "../components/OnboardingScreen";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { ResetDropdown } from "../components/ResetDropdown";
import OTPLogin from "../components/OTPLogin";

const ResetPasswordWithEmailPage = () => {
  const [showModal, setShowModal] = useState(false);

  const isSmall = useIsSmallScreen();
  const shouldShowOnboarding =
    typeof window !== "undefined"
      ? localStorage.getItem("oysloe_onboarding_seen") !== "true"
      : true;

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-11/12 sm:w-full m-8">
        <div className="flex flex-col gap-5 items-center justify-center">
          <h2 className="text-2xl">Reset Password</h2>
          <form className=" w-3/5">
            <input
              type="email"
              placeholder="Email address"
              className="border-gray-100 border-2 px-8 py-2 w-full bg-[8px_center] bg-[length:18px_18px] bg-no-repeat bg-[url(email.svg)] rounded-lg focus:border-gray-400  outline-0"
            />
            <p className="text-center font-extralight">
              We'll send a link to the email provided to reset your password
            </p>
            <div className="flex flex-col gap-3 w-full mt-8">
              <Button
                type="submit"
                name="Submit"
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              />
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
          <OnboardingScreen
            overlay
            onFinish={() => window.location.assign("/login")}
          />
        ) : null
      ) : (
        <OnboardingScreen />
      )}
      {showModal && (
        <div className="h-2/5 w-2/7 flex flex-col justify-center items-center bg-white border-2 border-gray-100 rounded-4xl shadow-lg absolute z-10">
          <LottieSuccess />
          <h2 className="text-2xl text-center">
            Reset link sent to <br />
            your email
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-center bg-[#F9F9F9] px-3 py-2 rounded-lg text-black"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetPasswordWithEmailPage;

import { useState } from "react";
import { Link } from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import Button from "../components/Button";
import LottieSuccess from "../components/LottieSuccess";
import OnboardingScreen from "../components/OnboardingScreen";
import OTPLogin from "../components/OTPLogin";
import { ResetDropdown } from "../components/ResetDropdown";
import { assetUrl } from "../assets/publicAssets";

const ResetPasswordWithEmailPage = () => {
  const [showModal, setShowModal] = useState(false);

  const isSmall = useIsSmallScreen();
  const shouldShowOnboarding =
    typeof window !== "undefined"
      ? localStorage.getItem("oysloe_onboarding_seen") !== "true"
      : true;

  return (
    <div className="h-screen max-sm:bg-(--bg) w-screen flex items-center max-sm:items-start justify-center max-sm:justify-center">
      <div className="flex flex-col items-center justify-center w-11/12 sm:w-full m-8 max-sm:pb-20">
        <div className="flex flex-col gap-5 max-sm:space-y-6 items-center justify-center">
          <h2 className="text-2xl max-sm:text-[28px]">Reset Password</h2>
          <form className=" w-3/5 max-sm:space-y-6 max-md:w-full">
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="max-sm:bg-white max-sm:h-[60px] max-sm:w-[85vw] max-sm:text-[16px] max-sm:rounded-2xl border-2 max-sm:border-gray-300 max-sm:pl-12 border-gray-100 px-8 py-3 pl-10 w-full rounded-lg focus:border-gray-400  outline-0"
              />
              <img
                src={assetUrl("email.svg")}
                alt="email"
                className="absolute h-6 w-6 left-2 max-sm:left-4 max-sm:top-5 max-sm:h-6 max-sm:w-6"
              />
            </div>
            <p className="text-center max-sm:text-[17px] text-sm text-gray-600">
              We'll send a link to the email provided to reset your password
            </p>
            <div className="flex flex-col gap-3 w-full mt-8">
              <Button
                type="submit"
                name="Submit"
                className="bg-[#74FFA7] hover:bg-[#74FFA7]/80 max-sm:h-[60px] max-sm:w-[85vw] max-sm:rounded-2xl text-(--dark-def) max-sm:text-[18px]"
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              />
            </div>
            <h6 className="sm:text-sm my-4 text-center max-sm:mb-8 text-[16px] max-sm:my-6">
              Can't Login?
            </h6>
            <div className="flex gap-2 max-sm:gap-[18px] justify-center items-center">
              <ResetDropdown page="email-reset" />
              <OTPLogin />
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

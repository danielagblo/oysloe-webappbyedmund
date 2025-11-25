import { Link } from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import Button from "../components/Button";
import OnboardingScreen from "../components/OnboardingScreen";

const ReferalVerificationPage = () => {
  const isSmall = useIsSmallScreen();
  const shouldShowOnboarding =
    typeof window !== "undefined"
      ? localStorage.getItem("oysloe_onboarding_seen") !== "true"
      : true;

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center w-11/12 sm:w-[60%] m-8">
        <div className="flex flex-col gap-5 items-center justify-center">
          <div className="w-7/8 h-4/5 overflow-y-auto relative">
            <input
              type="text"
              placeholder="Referal code (Optional)"
              className="border-gray-100 border-2 px-7 py-2 w-full bg-[8px_center] bg-[length:18px_18px] bg-no-repeat bg-[url(Referral.svg)] rounded-lg focus:border-gray-400  outline-0"
            />
            <div className="flex flex-col gap-5 w-full mt-5 justify-center items-center">
              <Button name="Verify" />
              <Link to="/home-page">
                <button className="flex items-center justify-center bg-[#F9F9F9] px-5 py-3 rounded-full text-black gap-3">
                  <h2 className="">Skip</h2>
                  <img src="skip.svg" alt="Skip" className="h-3" />
                </button>
              </Link>
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default ReferalVerificationPage;

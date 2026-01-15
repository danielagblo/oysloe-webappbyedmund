import { useState, useEffect } from "react";
import LottieJourneyBeginsNow from "./LottieJourneyBeginsNow";
import LottieScaleToSuccess from "./LottieScaleToSuccess";
import LottieUserSafetyGuarantee from "./LottieUserSafetyGuarantee";
import LottieSecurityStatusSafe from "./LottieSecurityStatusSafe";
import LottieScaleToSuccessMobile from "./LottieScaleToSuccessMobile";
import LottieJourneyBeginsNowMobile from "./LottieJourneyBeginsNowMobile";

type Props = {
  overlay?: boolean;
  onFinish?: () => void;
};

const OnboardingScreen = ({ overlay = false, onFinish }: Props) => {
  const [clicked, setClicked] = useState(-1);
  const [visible, setVisible] = useState(true);
  const [splashAnimating, setSplashAnimating] = useState(false);
  const [splashInitialized, setSplashInitialized] = useState(false);
  
  // Skip splash screen on larger screens (sm and up)
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 640) {
      setClicked(0);
    }
  }, []);
  
  // Initialize splash fade-in
  useEffect(() => {
    if (clicked === -1) {
      setSplashInitialized(true);
    }
  }, [clicked]);
  
  // Auto-advance from splash screen
  useEffect(() => {
    if (clicked === -1) {
      const timer = setTimeout(() => setSplashAnimating(true), 2500);
      const nextTimer = setTimeout(() => setClicked(0), 3300);
      return () => {
        clearTimeout(timer);
        clearTimeout(nextTimer);
      };
    }
  }, [clicked]);
  const baseClass = overlay
    ? `fixed inset-0 z-50 flex flex-col items-center max-sm:justify-end max-md:text-(--dark-def) justify-center bg-[#DEFEED] max-md:bg-white p-6 max-sm:p-0 ${visible ? "opacity-100" : "opacity-0"} transition-opacity duration-300`
    : "flex flex-col items-center justify-center h-screen lg:h-[90vh] lg:rounded-4xl bg-[#DEFEED] w-full";

  const STORAGE_KEY = "oysloe_onboarding_seen";

  // if overlay and already seen, immediately call onFinish
  if (
    typeof window !== "undefined" &&
    overlay &&
    localStorage.getItem(STORAGE_KEY) === "true"
  ) {
    if (onFinish) onFinish();
  }

  const handleFinish = () => {
    if (typeof window !== "undefined")
      localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 300);
  };
  return (
    <div className={baseClass}>
      {clicked === -1 ? (
        <div className={`flex flex-col items-center justify-center h-screen w-screen overflow-hidden bg-[var(--green)] transition-all duration-800 ${
          !splashInitialized ? "opacity-0" : splashAnimating ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
        }`}>
          <img src="/Logo1.svg" alt="Oysloe" className="w-[242px] h-[242px] object-contain" />
          <div className="absolute bottom-10 text-center">
            <p className="text-5xl font-medium text-(--dark-def)">Oysloe</p>
          </div>
        </div>
      ) : clicked === 0 ? (
        <>
          <LottieUserSafetyGuarantee />
          <div className="hidden max-sm:flex max-sm:items-center max-sm:mt-30 max-sm:justify-center max-sm:flex-1">
            <LottieSecurityStatusSafe />
          </div>
          <div className="flex flex-col items-center justify-end gap-3 max-sm:pb-5 max-sm:mt-0">
            <h2 className="text-4xl max-sm:px-4 font-medium text-center">
              User Safety Guarantee{" "}
            </h2>
            <p className="text-center text-sm w-7/10 max-md:w-9/10 px-8 max-sm:p-0">
              Buyers and sellers undergo strict checks and verification to
              ensure authenticity and reliability
            </p>
            <div className="flex gap-2 my-3 max-md:mt-8 max-md:mb-40 max-sm:gap-1">
              <span className="h-5 w-5 max-sm:h-3 max-sm:w-3 bg-(--dark-def) rounded-full inline-block mx-1"></span>
              <span className="h-5 w-5 max-sm:h-3 max-sm:w-3 bg-gray-300 rounded-full inline-block mx-1"></span>
              <span className="h-5 w-5 max-sm:h-3 max-sm:w-3 bg-gray-300 rounded-full inline-block mx-1"></span>
            </div>
            <button
              type="button"
              onClick={() => {
                setClicked(1);
                console.log(clicked);
              }}
              className="p-3 h-full w-1/2 max-md:fixed max-md:bottom-5 max-md:h-[60px] max-md:w-4/5 bg-[#F9F9F9] max-md:bg-gray-100 hover:bg-[#F9F9F9]/80 max-md:hover:bg-gray-200 transition cursor-pointer text-black max-md:text-(--dark-def) rounded-lg"
            >
              Next
            </button>
          </div>
        </>
      ) : clicked === 1 ? (
        <>
          <LottieScaleToSuccess />
          <div className="hidden max-sm:flex max-sm:items-center max-sm:mt-30 max-sm:justify-center max-sm:flex-1">
            <LottieScaleToSuccessMobile />
          </div>
          <div className="flex flex-col items-center justify-end gap-3 max-sm:pb-5 max-sm:mt-0">
            <h2 className="text-4xl  max-sm:px-4 font-medium text-center">
              Scale To Success
            </h2>
            <p className="text-center text-sm w-7/10 max-md:w-9/10 px-8 max-sm:p-0">
              Watch your business grow with our designed marketing tools,
              and automated processes
            </p>
            <div className="flex gap-2 my-3 max-md:mt-8 max-md:mb-40 max-sm:gap-1">
              <span className="h-5 w-5 max-sm:h-3 max-sm:w-3 bg-gray-300 rounded-full inline-block mx-1"></span>
              <span className="h-5 w-5 max-sm:h-3 max-sm:w-3 bg-(--dark-def) rounded-full inline-block mx-1"></span>
              <span className="h-5 w-5 max-sm:h-3 max-sm:w-3 bg-gray-300 rounded-full inline-block mx-1"></span>
            </div>
            <button
              type="button"
              onClick={() => {
                setClicked(2);
                console.log(clicked);
              }}
              className="p-3 h-full w-1/2 max-md:fixed max-md:bottom-5 max-md:h-[60px] max-md:w-4/5 bg-[#F9F9F9] max-md:bg-gray-100 hover:bg-[#F9F9F9]/80 max-md:hover:bg-gray-200 transition cursor-pointer text-black max-md:text-(--dark-def) rounded-lg"
            >
              Next
            </button>
          </div>
        </>
      ) : clicked === 2 ? (
        <>
          <LottieJourneyBeginsNow />
          <div className="hidden max-sm:flex max-sm:items-center max-sm:mt-30 max-sm:justify-center max-sm:flex-1">
            <LottieJourneyBeginsNowMobile />
          </div>
          <div className="flex flex-col items-center justify-end gap-3 max-sm:pb-5 max-sm:mt-0">
            <h2 className="text-4xl  max-sm:px-4 font-medium text-center">
              Journey Begins Now
            </h2>
            <p className="text-center text-sm w-7/10 max-md:w-9/10 px-8 max-sm:p-0">
              Optimised for all business owners with 
              seamless experience for everyone
            </p>
            <div className="flex gap-2 my-3 max-md:mt-8 max-md:mb-40 max-sm:gap-1">
              <span className="h-5 w-5 max-sm:h-3 max-sm:w-3 bg-gray-300 rounded-full inline-block mx-1"></span>
              <span className="h-5 w-5 max-sm:h-3 max-sm:w-3 bg-gray-300 rounded-full inline-block mx-1"></span>
              <span className="h-5 w-5 max-sm:h-3 max-sm:w-3 bg-(--dark-def) rounded-full inline-block mx-1"></span>
            </div>
            <button
              type="button"
              onClick={() => {
                console.log(clicked);
                if (overlay) {
                  handleFinish();
                } else {
                  setClicked(3);
                }
              }}
              className="p-3 h-full w-1/2 max-md:fixed max-md:bottom-5 max-md:h-[60px] max-md:w-4/5 bg-[#F9F9F9] max-md:bg-gray-100 hover:bg-[#F9F9F9]/80 max-md:hover:bg-gray-200 transition cursor-pointer text-black max-md:text-(--dark-def) rounded-lg"
            >
              Get Started
            </button>
          </div>
        </>
      ) : (
        <>
          {typeof document !== "undefined" &&
            document.getElementsByTagName("input")[0]?.focus()}
          <LottieJourneyBeginsNow />
          <div className="flex flex-col items-center justify-center gap-3">
            <h2 className="text-4xl font-medium text-center">
              Journey Begins Now
            </h2>
            <p className="text-center text-sm w-7/10 px-8">
              Buyers and sellers undergo strict checks and verification to
              ensure authenticity and reliability
            </p>
            <div className="flex gap-2 my-3">
              <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
              <span className="h-5 w-5 bg-gray-400 rounded-full inline-block mx-1"></span>
              <span className="h-5 w-5 bg-black rounded-full inline-block mx-1"></span>
            </div>
            <button
              type="button"
              onClick={() => {
                setClicked(4);
                console.log(clicked);
                if (overlay) {
                  handleFinish();
                } else {
                  // non-overlay flow: just advance
                  setClicked(4);
                }
              }}
              className="p-3 h-full w-1/2 bg-[#F9F9F9] hover:bg-[#F9F9F9]/80 transition cursor-pointer text-black rounded-lg"
            >
              Get Started
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default OnboardingScreen;

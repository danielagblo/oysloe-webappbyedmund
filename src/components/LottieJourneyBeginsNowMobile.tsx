import Lottie from "lottie-react";
import BoardingScreen from "../assets/journeybeginsnow.json";

const LottieJourneyBeginsNowMobile = () => {
  return (
    <Lottie
      animationData={BoardingScreen}
      loop={true}
      autoplay={true}
      className="h-1/2 max-sm:h-55 max-sm:w-55"
    />
  );
};

export default LottieJourneyBeginsNowMobile;

import Lottie from "lottie-react";
import BoardingScreen from "../assets/scale to success.json";

const LottieScaleToSuccessMobile = () => {
  return (
    <Lottie
      animationData={BoardingScreen}
      loop={true}
      autoplay={true}
      className="h-1/2 max-sm:h-55 max-sm:w-55"
    />
  );
};

export default LottieScaleToSuccessMobile;

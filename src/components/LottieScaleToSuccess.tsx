import Lottie from "lottie-react";
import BoardingScreen from "../assets/scale to success.json";

const LottieScaleToSuccess = () => {
  return (
    <Lottie
      animationData={BoardingScreen}
      loop={true}
      autoplay={true}
      className="h-1/2 max-sm:hidden max-sm:h-55 max-sm:w-55"
    />
  );
};

export default LottieScaleToSuccess;

import Lottie from "lottie-react";
import Success from "../assets/journeybeginsnow.json";

const LottieSuccess = () => {
  return (
    <Lottie
      animationData={Success}
      loop={false}
      autoplay={true}
      className="h-1/2"
    />
  );
};

export default LottieSuccess;

import Lottie from "lottie-react";
import BoardingScreen from "../assets/SAFETY ASSURANCE.json";

const LottieUserSafetyGuarantee = () => {
  return (
    <Lottie
      animationData={BoardingScreen}
      loop={true}
      autoplay={true}
      className="max-sm:hidden h-1/2"
    />
  );
};

export default LottieUserSafetyGuarantee;

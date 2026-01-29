import Lottie from "lottie-react";
import SecurityStatusSafe from "../assets/SAFETY ASSURANCE.json";

const LottieSecurityStatusSafe = () => {
  return (
    <Lottie
      animationData={SecurityStatusSafe}
      loop={true}
      autoplay={true}
      className="h-1/2 max-sm:h-55 max-sm:w-55"
    />
  );
};

export default LottieSecurityStatusSafe;

import Lottie from "lottie-react";
import NoNetwork from "../assets/no network main.json";

const LottieUserSafetyGuarantee = () => {
  return (
    <Lottie
      animationData={NoNetwork}
      loop={true}
      autoplay={true}
      className="h-20 w-20 md:h-40 md:w-40 mx-auto mb-4"
    />
  );
};

export default LottieUserSafetyGuarantee;

import Lottie from "lottie-react";
import BoardingScreen from "../assets/User safety guarantee.json";

const LottieUserSafetyGuarantee = () => {
    return (
        <Lottie
            animationData={BoardingScreen}
            loop={false}
            autoplay={true}
            className="h-1/2"
        />
    );
};

export default LottieUserSafetyGuarantee;

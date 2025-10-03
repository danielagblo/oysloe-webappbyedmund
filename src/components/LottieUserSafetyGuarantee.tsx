import Lottie from "lottie-react";
import BoardingScreen from "../assets/User safety guarantee.json";

const LottieUserSafetyGuarantee = () => {
    return (
        <Lottie
            animationData={BoardingScreen}
            loop={false}
            autoplay={true}
            style={{ width: 300, height: 300 }}
        />
    );
};

export default LottieUserSafetyGuarantee;

import Lottie from "lottie-react";
import BoardingScreen from "../assets/scale to success.json";

const LottieScaleToSuccess = () => {
    return (
        <Lottie
            animationData={BoardingScreen}
            loop={false}
            autoplay={true}
            className="h-1/2"
        />
    );
};

export default LottieScaleToSuccess;

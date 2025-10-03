import Lottie from "lottie-react";
import BoardingScreen from "../assets/scale to success.json";

const LottieScaleToSuccess = () => {
    return (
        <Lottie
            animationData={BoardingScreen}
            loop={false}
            autoplay={true}
            style={{ width: 300, height: 300 }}
        />
    );
};

export default LottieScaleToSuccess;

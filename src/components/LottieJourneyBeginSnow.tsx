import Lottie from "lottie-react";
import BoardingScreen from "../assets/journeybeginsnow.json";

const LottieJourneyBeginSnow = () => {
    return (
        <Lottie
            animationData={BoardingScreen}
            loop={false}
            autoplay={true}
            style={{ width: 300, height: 300 }}
        />
    );
};

export default LottieJourneyBeginSnow;

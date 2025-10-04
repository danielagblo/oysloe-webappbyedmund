import Lottie from "lottie-react";
import BoardingScreen from "../assets/journeybeginsnow.json";

const LottieJourneyBeginsNow = () => {
    return (
        <Lottie
            animationData={BoardingScreen}
            loop={false}
            autoplay={true}
            className="h-1/2"
        />
    );
};

export default LottieJourneyBeginsNow;

import Lottie from "lottie-react";
import celebrate from "../assets/celebrate.json";

const LottieCelebration = () => {
    return (
        <Lottie
            animationData={celebrate}
            loop={true}
            autoplay={true}
            style={{ width: 400, height: 400 }}
        />
    );
};

export default LottieCelebration;

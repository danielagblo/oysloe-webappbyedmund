import Lottie from "lottie-react";
import LoadingDots from "../assets/LoadingDots.json";

const Loader = ({ className }: { className?: string }) => (
  <div className={className}>
    <Lottie animationData={LoadingDots} loop={true} className="w-full h-full" />
  </div>
);
export default Loader;

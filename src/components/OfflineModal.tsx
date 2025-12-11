import { useState } from "react";
import { useOnline } from "../context/ConnectivityStatusContext";
import LottieNoNetwork from "./LottieNoNetwork";

const OfflineModal = () => {
  const isOnline = useOnline();
  const [showToast, setShowToast] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleRetry = async () => {
    setIsChecking(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (navigator.onLine) {
      window.location.reload();
    } else {
      setIsChecking(false);
      alert("Still offline. Please check your connection and try again.");
    }
  };

  if (!isOnline) return null;

  if (showToast) {
    return (
      <div className="fixed top-2 right-5 max-sm:right-2 z-50 bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg hover:opacity-70 transition">
        <p className="sm:text-base lg:text-[1.5vw] whitespace-nowrap flex items-center gap-2 justify-center">
          <span className="bg-white rounded-full p-1 flex items-center justify-center">
            ⚠️
          </span>
          <span> You are offline.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center px-15 max-sm:px-8">
        {/* <img
          src="/no-internet.png"
          alt="No internet connection"
          className="mx-auto mb-4 w-40 h-40 lg:w-50 lg:h-50"
        /> */}
        <LottieNoNetwork />
        <h2 className="text-xl font-bold mb-2">No Internet Connection</h2>
        <p className="text-gray-600 mb-4">
          Please check your network settings.
        </p>
        <div className="grid grid-cols-2 justify-center gap-4 items-center">
          <button
            className="bg-[#99fcae] max-sm:h-full hover:bg-[#d6f0e4] px-4 py-2 rounded cursor-pointer whitespace-nowrap hover:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleRetry}
            disabled={isChecking}
          >
            {isChecking ? "Checking..." : "Retry"}
          </button>
          <button
            className="bg-gray-200 px-4 py-2 rounded cursor-pointer sm:whitespace-nowrap hover:scale-95 transition"
            onClick={() => setShowToast(true)}
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfflineModal;

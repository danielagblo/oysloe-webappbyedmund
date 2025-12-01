import { useState } from "react";
import { useOnline } from "../context/ConnectivityStatusContext";

const OfflineModal = () => {
  const isOnline = useOnline();
  const [showToast, setShowToast] = useState(false);

  if (isOnline) return null;

  if (showToast) {
    return (
      <div className="fixed top-2 right-2 z-50 bg-yellow-400 text-black px-4 py-2 rounded-lg shadow-lg hover:opacity-70 transition">
        <p className="sm:text-base lg:text-[1.5vw] whitespace-nowrap flex items-center gap-2 justify-center">
          <span className="bg-white rounded-full p-1 flex items-center justify-center">⚠️</span>
          <span> You are offline.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center px-15">
        <img
          src="/public/no-internet.png"
          alt="No internet connection"
          className="mx-auto mb-4 w-40 h-40 lg:w-50 lg:h-50"
        />
        <h2 className="text-xl font-bold mb-2">No Internet Connection</h2>
        <p className="text-gray-600 mb-4">Please check your network settings.</p>
        <div className="grid grid-cols-2 justify-center gap-4 items-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer whitespace-nowrap hover:scale-95 transition"
            // onClick={onRetry}
          >
            Retry
          </button>
          <button
            className="bg-gray-200 px-4 py-2 rounded cursor-pointer whitespace-nowrap hover:scale-95 transition"
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

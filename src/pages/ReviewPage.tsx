import { useState } from "react";
import "../App.css";
import LottieSuccess from "../components/LottieSuccess";
import MenuButton from "../components/MenuButton";
import MobileBanner from "../components/MobileBanner";
import ProfileStats from "../components/ProfileStats";

const ReviewPage = () => {
  const [sendSuccess, setSendSuccess] = useState(false);
  const [selectedStars, setSelectedStars] = useState(0);
  const [showMobileForm, setShowMobileForm] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center w-[100vw] min-h-screen bg-(--div-active) text-(--dark-def) relative">
      {/* Mobile header */}
      <div className="sm:hidden w-full fixed top-0 z-30">
        <MobileBanner page="Reviews" />
      </div>

      {/* Profile sidebar (desktop only) */}
      <div className="hidden sm:flex w-[25vw] h-[100vh] items-center justify-center pl-2">
        <ProfileStats />
      </div>

      {/* Main Review Area (desktop) */}
      <div className="hidden sm:flex w-[75vw] h-[93vh] pr-2 gap-4 mt-0">
        {/* Comments Panel */}
        <div className="relative bg-white w-[55%] rounded-2xl shadow-lg flex flex-col p-4 overflow-y-auto no-scrollbar">
          <div className="sticky -mt-4 -top-4 left-0 pt-2 bg-white">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              User Reviews
            </h2>

            {/* Star Filter Bar */}
            <div className="bg-white/95 backdrop-blur-md px-2 py-3 border-b min-h-fit border-gray-100 flex flex-nowrap gap-1 justify-around overflow-x-auto no-scrollbar text-sm">
              <button className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 rounded-full whitespace-nowrap">
                <img src="/star.svg" alt="" className="w-4 h-4" /> All
              </button>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="flex justify-center items-center gap-1 bg-gray-100 rounded-full px-3 py-2 h-auto"
                >
                  <img src="/star.svg" alt="" className="w-4 h-4" />
                  {star}
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4 mt-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="pb-4 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src="/face.svg"
                      alt=""
                      className="w-10 h-10 rounded-lg"
                    />
                    <div className="flex flex-col">
                      <p className="text-[10px] text-gray-400">April 1</p>
                      <h3 className="font-semibold">Sandra</h3>
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <img
                            key={j}
                            src="/star.svg"
                            alt=""
                            className="w-3 h-3"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <img src="/like.svg" alt="" className="w-4 h-4" />
                    <span className="text-xs">20</span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mt-1">
                  This is a great car with excellent features. I had a wonderful
                  experience driving it around the city.
                </p>
              </div>
            ))}
            <div className="h-8 bg-white" />
          </div>
        </div>

        {/* Make a Review Panel (desktop) */}
        <div className="bg-white w-[45%] rounded-2xl shadow-sm flex flex-col items-center justify-start p-6 relative">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Make a Review
          </h2>

          {/* Star Selection */}
          <div className="flex w-full justify-around mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <img
                key={star}
                src="/star.svg"
                alt=""
                className={`w-7 h-7 cursor-pointer transition ${star <= selectedStars ? "opacity-100" : "opacity-40"
                  }`}
                onClick={() => setSelectedStars(star)}
              />
            ))}
          </div>

          <h3 className="text-center text-gray-600 mb-6">
            {selectedStars === 0
              ? "Rate your experience"
              : selectedStars === 5
                ? "Excellent"
                : selectedStars === 4
                  ? "Good"
                  : selectedStars === 3
                    ? "Average"
                    : selectedStars === 2
                      ? "Poor"
                      : "Terrible"}
          </h3>

          {/* Comment Input */}
          <textarea
            placeholder="Comment"
            className="border border-gray-300 rounded-lg p-3 w-11/12 h-28 resize-none mb-6 focus:outline-none focus:ring-2 focus:ring-[var(--dark-def)]"
          />

          {/* Send Button */}
          <button
            onClick={() => setSendSuccess(true)}
            className="text-lg flex items-center gap-2 p-3 px-8 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Send Review
          </button>

          {/* Success Modal */}
          {sendSuccess && (
            <div className="fixed inset-0 bg-[#4c4a4ab8] flex items-center justify-center z-50">
              <div className="bg-white rounded-4xl w-80 max-h-96 flex flex-col justify-center items-center p-6 text-center">
                <LottieSuccess />
                <h2 className="text-lg font-medium mt-2 mb-6">Submitted!</h2>
                <button
                  className="bg-[var(--div-active)] text-white rounded-full px-6 py-2"
                  onClick={() => setSendSuccess(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col sm:hidden w-full mt-16 relative">
        {/* Reviews Section */}
        <div className="p-4 bg-white h-[90vh] -mt-12">
          <h2 className="text-xl font-semibold mb-3">User Reviews</h2>
          <div className="flex gap-2 flex-wrap mb-4">
            <button className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 rounded-full whitespace-nowrap">
              <img src="/star.svg" alt="" className="w-4 h-4" /> All
            </button>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="flex justify-center items-center gap-1 bg-gray-100 rounded-full px-3 py-2 text-sm"
              >
                <img src="/star.svg" alt="" className="w-4 h-4" />
                {star}
              </button>
            ))}
          </div>

          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                  <img src="/face.svg" alt="" className="w-8 h-8 rounded-lg" />
                  <div className="flex flex-col">
                    <p className="text-[10px] text-gray-400">April 1</p>
                    <h3 className="font-semibold">Sandra</h3>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-sm mt-1">
                This is a great car with excellent features.
              </p>
            </div>
          ))}
        </div>

        {/* Floating Add Review Button */}
        <button
          onClick={() => setShowMobileForm(true)}
          className="fixed bottom-20 right-3 bg-[var(--dark-def)] text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg z-30"
        >
          +
        </button>

        {/* Overlay Review Form */}
        {showMobileForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex justify-center items-end">
            <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Make a Review</h2>
                <button
                  onClick={() => setShowMobileForm(false)}
                  className="text-gray-500 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="flex justify-around mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <img
                    key={star}
                    src="/star.svg"
                    alt=""
                    className={`w-7 h-7 cursor-pointer transition ${star <= selectedStars ? "opacity-100" : "opacity-40"
                      }`}
                    onClick={() => setSelectedStars(star)}
                  />
                ))}
              </div>

              <textarea
                placeholder="Comment"
                className="border border-gray-300 rounded-lg p-3 w-full h-24 resize-none mb-4 focus:outline-none"
              />
              <button
                onClick={() => {
                  setSendSuccess(true);
                  setShowMobileForm(false);
                }}
                className="w-full p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                Send Review
              </button>
            </div>
          </div>
        )}
      </div>

      <MenuButton />
    </div>
  );
};

export default ReviewPage;

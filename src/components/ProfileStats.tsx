import { useState } from "react";
import { FaAngleUp } from "react-icons/fa";
import RatingReviews from "./RatingsReviews";

export default function ProfileStats() {
  const [isExpanded, setIsExpanded] = useState(false);

  // --- Small Components ---
  const Profile = () => (
    <div className="flex flex-col items-center pb-6 border-b border-gray-100">
      <img
        src="avatar.jpg"
        alt="pfp"
        className="w-24 h-24 rounded-full object-cover mb-4 bg-pink-300"
        style={{ height: "3rem", width: "3rem" }}
      />
      <h2 className="text-xl font-semibold mb-1">Alexander Kowri</h2>
      <span className="text-xs text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded">
        High Level
      </span>
    </div>
  );

  const AdStats = () => (
    <div className="flex gap-4 justify-center w-full text-sm">
      <div className="text-center bg-gray-100 p-2 rounded-lg flex-1">
        <p className="font-bold">900k</p>
        <p className="text-gray-500 text-xs">Active Ads</p>
      </div>
      <div className="text-center bg-gray-100 p-2 rounded-lg flex-1">
        <p className="font-bold">900k</p>
        <p className="text-gray-500 text-xs">Sold Ads</p>
      </div>
    </div>
  );

  // --- Compact Banner (Mobile View) ---
  const MobileBanner = () => (
    <button
      onClick={() => setIsExpanded(true)}
      className="w-full flex items-center justify-between bg-white shadow-sm rounded-none lg:rounded-xl px-4 py-3 active:scale-[0.99] transition lg:hidden fixed top-0 left-0 z-20"
    >
      <div className="flex items-center gap-3">
        <img
          src="avatar.jpg"
          alt="pfp"
          className="w-10 h-10 rounded-full object-cover bg-pink-300"
        />
        <div className="flex flex-col text-left">
          <span className="font-semibold text-base leading-tight">Alexander Kowri</span>
          <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded w-fit">
            High Level
          </span>
        </div>
      </div>
      <span className="text-lg font-bold text-gray-700">4.5★</span>
    </button>
  );

  // --- Collapse Bar ---
  const CollapseBar = () => (
    <button
      onClick={() => setIsExpanded(false)}
      className="w-full flex items-center justify-center bg-white shadow-sm px-4 py-2 lg:hidden fixed top-0 left-0 z-30 border-b border-gray-200"
    >
      <FaAngleUp className="text-xl text-gray-600" />
    </button>
  );

  // --- Main Layout ---
  return (
    <div className="col-span-12 lg:col-span-3 w-full relative">
      {/* Mobile top banner or collapse bar */}
      {isExpanded ? <CollapseBar /> : <MobileBanner />}

      {/* Spacer to prevent overlap when banner is fixed */}
      <div className="h-[3.5rem] lg:hidden" />

      {/* Full stats visible when expanded or on large screens */}
      <div
        className={`flex flex-col gap-3 transition-all duration-300 ${
          isExpanded ? "block mt-0" : "hidden"
        } lg:block`}
      >
        <div className="shadow-sm p-6 rounded-xl bg-white">
          <Profile />
          <AdStats />
        </div>
        <div className="shadow-sm p-6 rounded-xl bg-white">
          <RatingReviews />
        </div>
      </div>
    </div>
  );
}

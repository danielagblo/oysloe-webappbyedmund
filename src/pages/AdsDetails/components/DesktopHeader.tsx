import React from "react";
import type { Product } from "../../../types/Product";

interface DesktopHeaderProps {
  currentAdData?: Product | any;
  multiplierLabel: string | null;
  imageCount: number;
  galleryIndex: number;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  currentAdData,
  multiplierLabel,
  imageCount,
  galleryIndex,
}) => {
  return (
    <div className="hidden sm:flex sticky top-0 left-0 z-40 mt-10 bg-white p-2 lg:py-2 items-center justify-evenly gap-4 w-full font-light text-xs">
      <div className="flex items-center gap-2">
        <img
          src="/location.svg"
          alt=""
          className="w-3 h-3 sm:w-5 sm:h-5 lg:w-[1.2vw] lg:h-[1.2vw]"
        />
        <h2 className="text-base sm:text-5 lg:text-[1.125vw]">
          {currentAdData?.location?.name || "Unknown"}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <img
          src="/star.svg"
          alt=""
          className="w-3 h-3 sm:h-5 sm:w-5 lg:w-[1.2vw] lg:h-[1.2vw]"
        />
        <h2 className="text-base sm:text-5 lg:text-[1.125vw]">
          {currentAdData?.average_rating ? currentAdData.average_rating : "0.0"}{" "}
          &nbsp;&nbsp;&nbsp;{currentAdData?.total_reviews || "No"} Review
          {(currentAdData?.total_reviews > 1 ||
            currentAdData?.total_reviews === 0) &&
            "s"}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <img
          src="/flag.svg"
          alt=""
          className="w-3 h-3 sm:h-5 sm:w-5 lg:w-[1.2vw] lg:h-[1.2vw]"
        />
        <h2 className="text-base sm:text-5 lg:text-[1.125vw]">
          {String(currentAdData?.total_reports)}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <img
          src="/favorited.svg"
          alt=""
          className="w-5 h-5 sm:w-5 sm:h-5 lg:w-[1.2vw] lg:h-[1.2vw]"
        />
        <h2 className="text-base sm:text-5 lg:text-[1.125vw]">
          {currentAdData?.total_favourites}
        </h2>
      </div>
      {/* Image count (desktop) - mirrors mobile header */}
      <div className="flex items-center gap-2">
        <h2 className="text-sm sm:text-5 lg:text-[1.125vw] font-medium">
          {imageCount > 0
            ? `${Math.min(galleryIndex + 1, imageCount)}/${imageCount}`
            : `0/0`}
        </h2>
      </div>
      <div className="flex gap-2 ml-auto items-center">
        {multiplierLabel && (
          <div className="text-black font-bold rounded-lg px-2 py-0.5 text-xs sm:text-5 lg:text-[1.125vw] bg-green-300">
            {multiplierLabel}
          </div>
        )}
        <button
          className="bg-gray-200 p-2 hidden rounded-full hover:bg-gray-300"
          aria-label="Previous ad"
        >
          <img
            src="/arrowleft.svg"
            alt=""
            className="w-5 h-5 md:w-[1.2vw] md:h-[1.2vw]"
          />
        </button>
        <button
          className="bg-gray-200 p-2 hidden rounded-full hover:bg-gray-300"
          aria-label="Next ad"
        >
          <img
            src="/arrowright.svg"
            alt=""
            className="w-5 h-5 md:w-[1.2vw] md:h-[1.2vw]"
          />
        </button>
      </div>
    </div>
  );
};

export default React.memo(DesktopHeader);

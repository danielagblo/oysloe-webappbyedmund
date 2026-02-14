import React from "react";

interface MobileHeaderProps {
  imageCount: number;
  galleryIndex: number;
  multiplierLabel: string | null;
  totalReports?: number | null;
  totalFavourites?: number | null;
  onBack: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  imageCount,
  galleryIndex,
  multiplierLabel,
  totalReports,
  totalFavourites,
  onBack,
}) => {
  return (
    <div className="w-screen flex sm:hidden justify-between items-center px-2 py-3 bg-(--div-active) fixed top-0 z-50">
      <button onClick={onBack} className="flex items-center gap-1">
        <img src="/arrowleft.svg" alt="Back" loading="lazy" decoding="async" className="w-5 h-5" />
        <span className="text-sm">Back</span>
      </button>
      <h2 className="text-sm font-medium some-gray] rounded-2xl py-1 px-2">
        {imageCount > 0
          ? `${Math.min(galleryIndex + 1, imageCount)}/${imageCount}`
          : `0/0`}
      </h2>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <img src="/flag.svg" alt="" loading="lazy" decoding="async" className="w-4 h-4" />
          <span className="text-xs">{totalReports ?? 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <img src="/favorited.svg" alt="" loading="lazy" decoding="async" className="w-4 h-4" />
          <span className="text-xs">{totalFavourites ?? 0}</span>
        </div>
        {multiplierLabel && (
          <div className="ml-2 text-black font-bold rounded-lg px-2 py-0.5 text-xs bg-green-300">
            {multiplierLabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MobileHeader);

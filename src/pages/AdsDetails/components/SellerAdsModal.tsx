import React, { useState } from "react";
import { Link } from "react-router-dom";
import { formatMoney } from "../../../utils/formatMoney";
import type { Product } from "../../../types/Product";

interface SellerAdsModalProps {
  isSellerAdsModalOpen: boolean;
  sellerProducts: any[];
  setIsSellerAdsModalOpen: (open: boolean) => void;
  currentAdData?: Product | any;
  owner?: any;
}

const SellerAdsModal: React.FC<SellerAdsModalProps> = ({
  isSellerAdsModalOpen,
  sellerProducts,
  setIsSellerAdsModalOpen,
  currentAdData,
  owner,
}) => {
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  if (!isSellerAdsModalOpen) return null;
  const sellerAdsToShow =
    sellerProducts?.filter((p) => !p.is_taken && p.status === "ACTIVE") ?? [];

  const handleDragStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientY);
  };

  const handleDragMove = (e: React.TouchEvent) => {
    if (dragStart === 0) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - dragStart;
    // Only allow dragging down (positive values)
    const clamped = Math.max(0, Math.min(200, diff));
    setDragOffset(clamped);
  };

  const handleDragEnd = () => {
    if (dragOffset > 100) {
      setIsSellerAdsModalOpen(false);
    }
    setDragStart(0);
    setDragOffset(0);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center max-sm:mb-15 bg-black/40 sm:bg-black/40 max-sm:p-0 p-4 animate-fade-in"
      onClick={() => setIsSellerAdsModalOpen(false)}
    >
      <div
        className="relative bg-white max-sm:w-full max-sm:rounded-t-3xl sm:rounded-2xl p-6 sm:shadow-lg max-h-[85vh] overflow-hidden w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%] max-sm:rounded-b-none max-sm:animate-slide-up-mobile max-sm:max-h-[75vh] transition-transform duration-200 ease-out"
        onClick={(e) => e.stopPropagation()}
        style={
          dragOffset > 0
            ? {
                transform: `translateY(${dragOffset}px)`,
              }
            : undefined
        }
      >
        {/* Mobile drag handle */}
        <div
          className="sm:hidden flex justify-center pb-3 -mx-6 px-6 pt-2 touch-none cursor-grab active:cursor-grabbing"
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        <button
          className="absolute max-sm:hidden z-10 top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={() => setIsSellerAdsModalOpen(false)}
          aria-label="Close seller ads modal"
        >
          ✕
        </button>

        <h2 className="text-xl md:text-2xl font-bold w-full whitespace-nowrap mb-4 pr-8 sticky top-0 bg-white max-sm:pt-0">
          <span className="truncate whitespace-nowrap w-[85%]">{currentAdData?.owner?.business_name || owner?.name || "Seller"}</span>
          's Ads
        </h2>

        {sellerAdsToShow.length > 0 ? (
          <div className="flex flex-col gap-3 overflow-auto max-h-[70vh] no-scrollbar max-lg:pb-20">
            {sellerAdsToShow.map((ad) => (
              <Link
                key={ad.id}
                to={`/ads/${ad.id}`}
                state={{ adData: ad }}
                onClick={() => setIsSellerAdsModalOpen(false)}
                className="flex gap-3 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer border border-gray-200"
              >
                <img
                  src={ad.image || "/no-image.jpeg"}
                  alt={ad.name}
                  className="w-20 h-20 object-cover rounded-lg shrink-0"
                />
                <div className="flex flex-col justify-center flex-1 min-w-0">
                  <h3 className="font-bold text-gray-400 text-sm md:text-base line-clamp-1">
                    {ad.name}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">
                    <img className="inline h-3 w-3" src="/location.svg" alt="" />
                    &nbsp;
                    {(ad.location?.name || "") +
                      (ad.location?.name && ad.location?.region ? ", " : "") +
                      (ad.location?.region || "") || "Unknown"}
                  </p>
                  <p className="text-gray-800 font-semibold text-sm md:text-base mt-1">
                    {ad.price
                      ? `${formatMoney(ad.price)}${ad.type?.toLowerCase() === "rent" ? "/month" : ""}`
                      : "Contact for price"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <img
              src="/nothing-to-show.png"
              className="w-16 h-16"
              alt="no ads"
            />
            <p className="text-gray-500 text-center">
              This seller has no other active ads at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(SellerAdsModal);

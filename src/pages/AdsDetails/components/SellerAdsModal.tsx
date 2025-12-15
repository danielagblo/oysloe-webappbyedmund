import React from "react";
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
  if (!isSellerAdsModalOpen) return null;
  const sellerAdsToShow =
    sellerProducts?.filter((p) => !p.is_taken && p.status === "ACTIVE") ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={() => setIsSellerAdsModalOpen(false)}
    >
      <div
        className="relative bg-white rounded-2xl p-6 shadow-lg max-sm:max-h-[75vh] max-h-[85vh] overflow-auto no-scrollbar w-[90%] sm:w-[70%] md:w-[60%] lg:w-[50%]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={() => setIsSellerAdsModalOpen(false)}
          aria-label="Close seller ads modal"
        >
          ✕
        </button>

        <h2 className="text-xl md:text-2xl font-bold mb-4 pr-8">
          {currentAdData?.owner?.business_name || owner?.name || "Seller"}'s Ads
        </h2>

        {sellerAdsToShow.length > 0 ? (
          <div className="flex flex-col gap-3">
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
                  <h3 className="font-bold text-gray-400 text-sm md:text-base line-clamp-2">
                    {ad.name}
                  </h3>
                  <p className="text-gray-600 text-xs md:text-sm">
                    <img className="inline h-3 w-3" src="/location.svg" alt="" />
                    &nbsp;
                    {(ad.location?.name || "") +
                      (ad.location?.name && ad.location?.region ? ", " : "") +
                      (ad.location?.region || "") || "Unknown location"}
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

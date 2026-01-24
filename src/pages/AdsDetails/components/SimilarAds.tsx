import React from "react";
import { Link, useLocation } from "react-router-dom";
import { formatMoney } from "../../../utils/formatMoney";

interface SimilarAdsProps {
  relatedProducts: any[];
  fallbackStartIndex?: number;
}

const SimilarAds: React.FC<SimilarAdsProps> = ({ 
  relatedProducts, 
  fallbackStartIndex = -1 
}) => {
  const location = useLocation();
  const markReturnTarget = () => {
    // When the user goes back to this ad, scroll to the Similar Ads section.
    sessionStorage.setItem(
      `scroll:popTarget:path:${location.pathname}`,
      "similar-ads",
    );
  };

  return (
  <div className="bg-white sm:bg-(--div-active) max-sm:p-4 sm:py-6 w-screen md:px-12">
    <h2
      className="text-xl font-bold mb-6 px-2 md:px-20 lg:text-2xl"
      data-scroll-target="similar-ads"
    >
      Similar Ads
    </h2>

    <div className="flex flex-wrap gap-2 sm:gap-3 w-full justify-start">
      {(() => {
        const availableAds =
          relatedProducts?.filter((ad) => !ad.is_taken) ?? [];
        
        if (availableAds.length === 0) {
          return (
            <div className="flex items-center flex-col justify-center w-full gap-2">
              <img
                src="/nothing-to-show.png"
                className="w-25 h-25"
                alt="nothing to show"
              />
              <p className="text-gray-500 text-sm sm:text-xl lg:text-[1.2vw] w-full text-center">
                No similar ads to show.
              </p>
            </div>
          );
        }

        return availableAds.map((ad, index) => {
          // Insert "Other ads" label if we've reached the fallback section
          const isFallbackStart = fallbackStartIndex > 0 && index === fallbackStartIndex;
          
          return (
            <React.Fragment key={ad.id}>
              {isFallbackStart && (
                <div className="w-full px-2 md:px-20 mt-4 mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Other ads
                  </h3>
                </div>
              )}
              <Link
                to={`/ads/${ad.id}`}
                state={{ adData: ad }}
                onClick={markReturnTarget}
                className="inline-block rounded-md overflow-hidden shrink-0 w-[38vw] max-sm:min-w-[43.5vw] sm:w-48 md:w-52"
              >
                <img
                  src={ad.image || "/no-image.jpeg"}
                  alt={ad.name.slice(0, 10)}
                  loading="lazy"
                  className="w-full h-[120px] sm:h-48 object-cover rounded-md"
                />
                <div className="flex items-center gap-1 px-2 py-1">
                  <img
                    src="/location.svg"
                    alt=""
                    className="w-3 sm:w-4 h-3 sm:h-4 md:h-[1.2vw] md:w-[1.2vw]"
                  />
                  <p className="text-[10px] sm:text-xs md:text-[0.9vw] text-gray-500 truncate">
                    {ad.location?.name || "Unknown"}
                  </p>
                </div>
                <p className="px-2 text-[11px] sm:text-sm md:text-[1.2vw] line-clamp-1 text-gray-600">
                  {ad.name}
                </p>
                <p className="px-2 text-[11px] sm:text-sm md:text-[1.125vw] font-medium text-gray-800">
                  {formatMoney(ad.price, "GHS")}
                </p>
              </Link>
            </React.Fragment>
          );
        });
      })()}
    </div>
  </div>
  );
};

export default React.memo(SimilarAds);

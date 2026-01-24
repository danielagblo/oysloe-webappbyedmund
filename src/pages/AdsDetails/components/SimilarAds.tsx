import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { formatMoney } from "../../../utils/formatMoney";
import ProgressiveImage from "../../../components/ProgressiveImage";

interface SimilarAdsProps {
  relatedProducts: any[];
  fallbackStartIndex?: number;
  isLoading?: boolean;
}

const SkeletonCard = () => (
  <div className="inline-block rounded-md overflow-hidden shrink-0 w-[38vw] max-sm:min-w-[43.5vw] sm:w-48 md:w-52">
    <div className="w-full h-[120px] sm:h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded-md" />
    <div className="flex items-center gap-1 px-2 py-1">
      <div className="w-3 sm:w-4 h-3 sm:h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
      <div className="h-3 sm:h-3.5 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
    </div>
    <div className="px-2 h-4 sm:h-5 w-4/5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded mt-1" />
    <div className="px-2 h-4 sm:h-5 w-2/5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded mt-1 mb-2" />
  </div>
);

const SimilarAds: React.FC<SimilarAdsProps> = ({ 
  relatedProducts, 
  fallbackStartIndex = -1,
  isLoading = false
}) => {
  const location = useLocation();
  const [displayCount, setDisplayCount] = useState(12); // Show 12 ads initially
  
  const markReturnTarget = () => {
    // When the user goes back to this ad, scroll to the Similar Ads section.
    sessionStorage.setItem(
      `scroll:popTarget:path:${location.pathname}`,
      "similar-ads",
    );
  };

  const availableAds = useMemo(
    () => relatedProducts?.filter((ad) => !ad.is_taken) ?? [],
    [relatedProducts]
  );

  // Calculate how many ads to show initially (before fallback) and from fallback
  const beforeFallbackCount = fallbackStartIndex > 0 ? fallbackStartIndex : availableAds.length;
  
  // Always show all ads before fallback, then paginate fallback section
  const fallbackAds = fallbackStartIndex > 0 ? availableAds.slice(fallbackStartIndex) : [];
  const displayedFallbackCount = Math.min(displayCount, fallbackAds.length);
  
  const displayedAds = useMemo(() => {
    if (fallbackStartIndex <= 0) {
      // No fallback section, just paginate all
      return availableAds.slice(0, displayCount);
    }
    // Show all before fallback + paginated fallback
    return [
      ...availableAds.slice(0, beforeFallbackCount),
      ...fallbackAds.slice(0, displayedFallbackCount)
    ];
  }, [availableAds, beforeFallbackCount, fallbackAds, displayedFallbackCount, displayCount, fallbackStartIndex]);

  const hasMoreFallback = fallbackStartIndex > 0 && displayedFallbackCount < fallbackAds.length;

  return (
  <div className="bg-white sm:bg-(--div-active) max-sm:p-4 sm:py-6 w-screen md:px-12">
    <h2
      className="text-xl font-bold mb-6 px-2 md:px-20 lg:text-2xl"
      data-scroll-target="similar-ads"
    >
      Similar Ads
    </h2>

    {isLoading ? (
      <div className="flex flex-wrap gap-2 sm:gap-3 w-full justify-start">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    ) : availableAds.length === 0 ? (
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
    ) : (
      <>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full justify-start">
          {displayedAds.map((ad, index) => {
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
                  <ProgressiveImage
                    src={ad.image || "/no-image.jpeg"}
                    alt={ad.name.slice(0, 10)}
                    containerClassName="relative w-full h-[120px] sm:h-48"
                    imgClassName="w-full h-full object-cover rounded-md"
                    watermarkBusinessName={ad.owner?.business_name}
                    watermarkSize="sm"
                    onContextMenu={(e) => e.preventDefault()}
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
          })}
        </div>
        
        {hasMoreFallback && (
          <div className="w-full px-2 md:px-20 mt-6">
            <button
              onClick={() => setDisplayCount((prev) => prev + 12)}
              className="w-full py-3 bg-white hover:bg-gray-50 rounded-lg font-medium transition border border-gray-200"
              style={{ color: '#646161' }}
            >
              Load More ({fallbackAds.length - displayedFallbackCount} remaining)
            </button>
          </div>
        )}
      </>
    )}
  </div>
  );
};

export default React.memo(SimilarAds);

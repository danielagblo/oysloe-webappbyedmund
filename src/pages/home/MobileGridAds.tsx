import React, { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ProgressiveImage from "../../components/ProgressiveImage";
import type { Product } from "../../types/Product";
import { formatMoney } from "../../utils/formatMoney";

type Props = {
  products: Product[];
  productsLoading: boolean;
  handleAdClick: (ad: Product, e: React.MouseEvent) => Promise<void> | void;
};

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden w-full">
    <div className="w-full h-[120px] min-[410px]:h-[150px] min-[490px]:h-40 min-[510px]:h-[180px] sm:h-52 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]" />
    <div className="flex items-center gap-2 px-2 py-1">
      <div className="w-3 sm:w-5 h-3 sm:h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
      <div className="h-3 sm:h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded" />
    </div>
    <div className="h-4 sm:h-5 w-5/6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded mx-2 mt-1" />
    <div className="h-4 sm:h-5 w-2/5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded mx-2 mt-1 mb-2" />
  </div>
);

// Memoized ad card to prevent unnecessary re-renders
const LazyAdCard = React.memo(function LazyAdCard({
  ad,
  handleAdClick,
  layout,
}: {
  ad: Product;
  handleAdClick: Props["handleAdClick"];
  layout: "grid" | "mason";
}) {
  return (
    <Link
      to={`/ads/${ad.id}`}
      state={{ adData: ad }}
      onClick={(e) => handleAdClick(ad, e)}
      className={`inline-flex rounded-md overflow-hidden w-full flex-col ${layout === "mason" ? "mb-10" : "mb-2"} items-center justify-center
      }`}
    >
      <ProgressiveImage
        src={ad.image || "/no-image.jpeg"}
        alt={ad.name}
        containerClassName="relative w-full"
        imgClassName={`w-full max-sm:max-h-85 max-w-62 sm:h-52 object-cover rounded-md ${
          layout === "mason" ? "max-sm:break-inside-avoid" : "max-sm:h-52"
        }`}
        watermarkBusinessName={ad.owner?.business_name}
        watermarkSize="md"
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className="w-full mt-1">
        <div className="flex items-center gap-1 px-2 py-0.5">
          <img
            src="/location.svg"
            alt=""
            className="w-3 sm:w-5 h-3 sm:h-5 lg:h-[1vw] lg:w-[1vw]"
          />
          <p className="text-xs sm:text-sm lg:text-[0.9vw] text-gray-500 truncate">
            {ad.location?.name ?? ad.location?.region ?? "Unknown"}
          </p>
        </div>
        <p className="px-2 text-sm sm:text-xl lg:text-[1.2vw] truncate line-clamp-1 text-gray-600">
          {ad.name}
        </p>
        <p className="px-2 text-xs sm:text-base lg:text-[1vw] font-medium text-gray-800">
          {formatMoney(ad.price, "GHS")}
        </p>
      </div>
    </Link>
  );
});

const MobileGridAds = ({ products, productsLoading, handleAdClick }: Props) => {
  // Use ref to preserve displayCount across component remounts
  const displayCountRef = useRef(12);
  const [displayCount, setDisplayCount] = useState(12);
  const [hasHydratedFromAnchor, setHasHydratedFromAnchor] = useState(false);
  const [layout, setLayout] = useState<"grid" | "mason">("grid");

  const parseAdIdFromHref = (href: string) => {
    try {
      const url = new URL(href, typeof window !== "undefined" ? window.location.origin : undefined);
      const segments = url.pathname.split("/").filter(Boolean);
      return segments.pop() ?? null;
    } catch {
      return null;
    }
  };
  
  // Filter active products
  const active = useMemo(
    () => (products || []).filter((p) => p.status === "ACTIVE" && !p.is_taken),
    [products]
  );

  // Ensure we render enough cards to include the last clicked ad (so scroll restoration works after navigating back).
  useEffect(() => {
    if (hasHydratedFromAnchor) return;
    if (typeof window === "undefined") return;

    const href = sessionStorage.getItem(`scroll:anchorHref:path:${window.location.pathname}`);
    if (!href) return;

    const adId = parseAdIdFromHref(href);
    if (!adId) return;

    const targetIndex = active.findIndex(
      (p) => String(p.id) === adId || href.endsWith(`/ads/${p.id}`)
    );
    if (targetIndex === -1) return;

    const neededCount = targetIndex + 1;
    const requiredDisplay = Math.min(active.length, Math.max(displayCount, Math.ceil(neededCount / 12) * 12));

    if (requiredDisplay > displayCount) {
      setDisplayCount(requiredDisplay);
    }

    setHasHydratedFromAnchor(true);
  }, [active, displayCount, hasHydratedFromAnchor]);

  // Paginate displayed products
  const displayedProducts = useMemo(() => active.slice(0, displayCount), [active, displayCount]);

  // If no ads are loaded yet, show skeletons. Otherwise, show ads even while refetching
  if (!displayedProducts || displayedProducts.length === 0) {
    if (productsLoading) {
      // Show a grid of skeletons only when there's truly no data
      return (
        <div className="px-2 py-3">
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      );
    }

    if (!active || active.length === 0) {
      return (
        <div className="text-xl mt-5 w-full flex flex-col items-center justify-center gap-4">
          <img src="/nothing-to-show.png" alt="Nothing to show" className="max-w-[50vw] sm:max-w-50" />
          <p>No ads to show right now.</p>
        </div>
      );
    }
  }

  const hasMore = displayCount < active.length;

  const handleLoadMore = () => {
    const newCount = displayCount + 12;
    displayCountRef.current = newCount;
    setDisplayCount(newCount);
  };

  return (
    <div className="px-2 py-3">
      <div className="flex justify-end items-center p-2">
        <div className="flex justify-end gap-4 mr-2 items-center">
          <button
            onClick={() => setLayout("grid")}
            className={`py-1 rounded`}
          >
            <img className="h-8 w-8" src="/grid-svgrepo-com.svg" alt="grid" />

          </button>
          <button
            onClick={() => setLayout("mason")}
            className={`py-1 rounded`}
          >
            <img className="h-8 w-8" src="/grid-3-svgrepo-com.svg" alt="mason" />

          </button>
        </div>
      </div>
      <div className={`${layout === "grid" ? "grid grid-cols-2" : "columns-2"} gap-2 sm:gap-3`}>
        {displayedProducts.map((ad) => (
          <LazyAdCard key={ad.id} ad={ad} handleAdClick={handleAdClick} layout={layout} />
        ))}
      </div>
      {hasMore && (
        <button
          onClick={handleLoadMore}
          className="w-full mt-4 py-3 bg-white hover:bg-gray-50 rounded-lg font-medium transition border border-gray-200"
          style={{ color: '#646161' }}
        >
          Load More ({active.length - displayCount} remaining)
        </button>
      )}
    </div>
  );
};

export default MobileGridAds;

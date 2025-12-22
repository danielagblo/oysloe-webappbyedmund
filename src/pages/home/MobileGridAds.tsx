import React from "react";
import type { Product } from "../../types/Product";
import { Link } from "react-router-dom";
import { formatMoney } from "../../utils/formatMoney";

type Props = {
  products: Product[];
  productsLoading: boolean;
  handleAdClick: (ad: Product, e: React.MouseEvent) => Promise<void> | void;
};

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden w-full animate-pulse">
    <div className="w-full h-[120px] sm:h-52 bg-gray-200" />
    <div className="flex items-center gap-2 px-2 py-1">
      <div className="w-3 sm:w-5 h-3 sm:h-5 bg-gray-200 rounded" />
      <div className="h-3 sm:h-4 w-24 bg-gray-200 rounded" />
    </div>
    <div className="h-4 sm:h-5 w-5/6 bg-gray-200 rounded mx-2 mt-1" />
    <div className="h-4 sm:h-5 w-2/5 bg-gray-200 rounded mx-2 mt-1 mb-2" />
  </div>
);

function LazyAdCard({ ad, handleAdClick }: { ad: Product; handleAdClick: Props["handleAdClick"] }) {
  return (
    <Link
      key={ad.id}
      to={`/ads/${ad.id}`}
      state={{ adData: ad }}
      onClick={(e) => handleAdClick(ad, e)}
      className="inline-block rounded-2xl overflow-hidden w-full"
    >
      <img
        src={ad.image || "/no-image.jpeg"}
        alt={ad.name}
        loading="lazy"
        className="w-full h-[120px] sm:h-52 object-cover rounded-2xl"
      />
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
    </Link>
  );
}

const MobileGridAds = ({ products, productsLoading, handleAdClick }: Props) => {
  const active = (products || []).filter((p) => p.status === "ACTIVE" && !p.is_taken);

  if (productsLoading) {
    // Show a grid of skeletons while loading
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

  return (
    <div className="px-2 py-3">
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {active.map((ad) => (
          <LazyAdCard key={ad.id} ad={ad} handleAdClick={handleAdClick} />
        ))}
      </div>
    </div>
  );
};

export default MobileGridAds;

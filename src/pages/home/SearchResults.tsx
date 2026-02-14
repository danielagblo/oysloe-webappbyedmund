import React from "react";
import { Link } from "react-router-dom";
import ProgressiveImage from "../../components/ProgressiveImage";
import type { Product } from "../../types/Product";
import { formatMoney } from "../../utils/formatMoney";

type Props = {
  products: Product[];
  applyFilters: (p: Product[]) => Product[];
  handleAdClick: (ad: Product, e: React.MouseEvent) => Promise<void> | void;
};

const SearchResults = ({ products, applyFilters, handleAdClick }: Props) => {
  const results = products.filter((p) => p.status === "ACTIVE");
  const filteredResults = applyFilters(results);

  if (!filteredResults || filteredResults.length === 0) {
    return (
      <div className="bg-(--div-active) w-full flex justify-center -mb-4">
        <div style={{ transform: "scale(0.9)" }} className="w-[95vw] pb-8">
          <p className="text-center text-gray-500">
            No ads found for your search.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-(--div-active) w-full flex justify-center -mb-4">
      <div
        className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 w-[95vw] pb-8 sm:pb-25 lg:pb-8"
      >
        {filteredResults.map((ad) => (
          <div key={ad.id} className="flex flex-col w-full lg:max-w-[18vw] sm:max-w-[30vw] overflow-hidden">
            <Link
              to={`/ads/${ad.id}`}
              state={{ adData: ad }}
              onClick={(e) => handleAdClick(ad, e)}
            >
              <ProgressiveImage
                src={ad.image || "/no-image.jpeg"}
                alt={ad.name}
                containerClassName="relative inline-block w-full"
                imgClassName="w-full h-[120px] sm:h-52 lg:h-[17.5vw] object-cover rounded-2xl lg:rounded-[1vw]"
                watermarkBusinessName={ad.owner?.business_name}
                watermarkSize="sm"
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="flex items-center gap-1 px-2 py-1">
                <img
                  src="/location.svg"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-3 sm:w-5 h-3 sm:h-5 lg:h-[1vw] lg:w-[1vw]"
                />
                <p className="text-xs sm:text-sm lg:text-[0.9vw] text-gray-600 truncate">
                  {
                    ad.location?.name ??
                    ad.location?.region ??
                    "Unknown"
                  }
                </p>
              </div>
              <p className="px-2 text-sm sm:text-xl lg:text-[1.2vw] truncate line-clamp-1 text-gray-600">
                {ad.name}
              </p>
              <p className="px-2 text-xs sm:text-base lg:text-[1vw] font-medium text-gray-800">
                {formatMoney(ad.price, "GHS")}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;

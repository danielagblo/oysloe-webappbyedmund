import React from "react";
import { Link } from "react-router-dom";
import type { Category } from "../../types/Category";
import type { Product } from "../../types/Product";
import { formatMoney } from "../../utils/formatMoney";

type Props = {
  selectedCategory: Category | null;
  productsByCategory: Record<number, Product[]>;
  applyFilters: (p: Product[]) => Product[];
  handleAdClick: (ad: Product, e: React.MouseEvent) => Promise<void> | void;
};

const ConditionalAds = ({
  selectedCategory,
  productsByCategory,
  applyFilters,
  handleAdClick,
}: Props) => {
  const categoryProducts = selectedCategory
    ? productsByCategory[selectedCategory.id] || []
    : [];

  const filteredProducts = applyFilters(categoryProducts);

  return (
    <div className="bg-(--div-active) w-full flex justify-center -mb-4">
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 w-[95vw] pb-45">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((ad) => (
            <div key={ad.id} className="flex flex-col w-full sm:max-w-[18vw] overflow-hidden">
              <Link
                to={`/ads/${ad.id}`}
                state={{ adData: ad }}
                onClick={(e) => handleAdClick(ad, e)}
              >
                <img
                  src={ad.image || "/no-image.jpeg"}
                  alt={ad.name}
                  className="w-full h-[120px] sm:h-52 lg:h-[17.5vw] object-cover rounded-2xl lg:rounded-[1vw]"
                />
                <div className="flex items-center gap-1 px-2 py-1">
                  <img src="/location.svg" alt="" className="w-3 sm:w-5 h-3 sm:h-5 lg:h-[1vw] lg:w-[1vw]" />
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
          ))
        ) : (
          <div className="flex flex-col items-center justify-center col-span-full">
            <img
              src="/nothing-to-show.png"
              alt="nothing to show"
              className="h-10 w-10 lg:h-[10vw] lg:w-[10vw]"
            />
            <p className="px-2 text-sm text-gray-500">No ads to show here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConditionalAds;

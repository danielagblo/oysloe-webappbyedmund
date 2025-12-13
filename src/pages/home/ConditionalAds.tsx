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
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-[95vw] pb-45">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((ad) => (
            <div key={ad.id} className="flex flex-col w-full overflow-hidden">
              <Link
                to={`/ads/${ad.id}`}
                state={{ adData: ad }}
                onClick={(e) => handleAdClick(ad, e)}
              >
                <img
                  src={ad.image || "/no-image.jpeg"}
                  alt={ad.name}
                  className="w-full h-40 sm:h-48 object-cover rounded-2xl"
                />
                <div className="flex items-center gap-1 px-2 py-1">
                  <img src="/location.svg" alt="" className="w-4 h-4" />
                  <p className="text-xs text-gray-500">
                    {ad.location?.name ?? ad.location?.region ?? "Unknown"}
                  </p>
                </div>
                <p className="px-2 text-sm truncate text-gray-500">{ad.name}</p>
                <p className="px-2 text-sm font-light text-gray-500">
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

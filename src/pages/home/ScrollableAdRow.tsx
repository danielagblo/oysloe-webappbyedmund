import React from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/LoadingDots";
import type { Category } from "../../types/Category";
import type { Product } from "../../types/Product";
import { formatMoney } from "../../utils/formatMoney";
import useScrollFade from "./useScrollFade";

type Props = {
  category: Category;
  productsByCategory: Record<number, Product[]>;
  applyFilters: (p: Product[]) => Product[];
  productsLoading: boolean;
  handleArrowClick: (dir: "left" | "right", id: string | number) => void;
  handleAdClick: (ad: Product, e: React.MouseEvent) => Promise<void> | void;
};

const ScrollableAdRow = ({
  category,
  productsByCategory,
  applyFilters,
  productsLoading,
  handleArrowClick,
  handleAdClick,
}: Props) => {
  const containerId = `move-${category.id}`;
  // const maskGradient = useScrollFade(containerId);
  const categoryProducts = productsByCategory[category.id] || [];
  const filteredProducts = applyFilters(categoryProducts);

  if (!categoryProducts || categoryProducts.length === 0) return null;

  return (
    <div
      key={category.id}
      className="flex flex-col w-[95vw] mt-6 mx-auto overflow-hidden text-(--dark-def)"
    >
      <div className="flex items-center gap-3 mb-2 px-2">
        <h2 className="text-base sm:text-xl lg:text-[2vw] font-semibold truncate text-(--dark-def)">
          {category.name}
        </h2>
        <button className="bg-gray-200 px-3 py-1 rounded-full text-xs sm:text-sm lg:text-xl hidden whitespace-nowrap">
          Filter
        </button>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => handleArrowClick("left", category.id)}
            className="bg-gray-200 p-2 rounded-full shrink-0"
          >
            <img src="/arrowleft.svg" alt="Left" className="w-3 sm:w-8" />
          </button>
          <button
            onClick={() => handleArrowClick("right", category.id)}
            className="bg-gray-200 p-2 rounded-full shrink-0"
          >
            <img src="/arrowright.svg" alt="Right" className="w-3 sm:w-8" />
          </button>
        </div>
      </div>

      <div
        id={containerId}
        className="overflow-x-auto no-scrollbar px-1 py-3 sm:px-2"
        // style={{
        //   WebkitMaskImage: maskGradient,
        //   maskImage: maskGradient,
        // }}
      >
        {filteredProducts.length > 0 ? (
          <div className="flex gap-2 sm:gap-3 w-max">
            {productsLoading ? (
              <Loader className={"h-40 my-0"} />
            ) : (
              filteredProducts.map(
                (ad) =>
                  ad.status === "ACTIVE" &&
                  !ad.is_taken && (
                    <Link
                      key={ad.id}
                      to={`/ads/${ad.id}`}
                      state={{ adData: ad }}
                      onClick={(e) => handleAdClick(ad, e)}
                      className="inline-block rounded-2xl overflow-hidden shrink-0 w-[38vw] sm:w-48 md:w-52"
                    >
                      <img
                        src={ad.image || "/no-image.jpeg"}
                        alt={ad.name}
                        className="w-full h-[120px] sm:h-52 object-cover rounded-2xl"
                      />
                      <div className="flex items-center gap-1 px-2 py-1">
                        <img
                          src="/location.svg"
                          alt=""
                          className="w-3 sm:w-5 h-3 sm:h-5"
                        />
                        <p className="text-[10px] sm:text-sm text-gray-500 truncate">
                          {ad.location?.name ??
                            ad.location?.region ??
                            "Unknown"}
                        </p>
                      </div>
                      <p className="px-2 text-[11px] sm:text-xl truncate line-clamp-1 text-gray-600">
                        {ad.name}
                      </p>
                      <p className="px-2 text-[11px] sm:text-base font-medium text-gray-800">
                        {formatMoney(ad.price, "GHS")}
                      </p>
                    </Link>
                  ),
              )
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <img
              src="/nothing-to-show.png"
              alt="nothing to show"
              className="h-7 w-7"
            />
            <p className="px-2 text-sm text-gray-500">No ads to show here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrollableAdRow;

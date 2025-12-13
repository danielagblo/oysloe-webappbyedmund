import React from "react";
import { Link } from "react-router-dom";
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
        style={{ transform: "scale(0.9)" }}
        className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-[95vw] pb-8"
      >
        {filteredResults.map((ad) => (
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
                  {ad.location?.name ?? ad.location?.region ?? ""}
                </p>
              </div>
              <p className="px-2 text-sm truncate text-gray-500">{ad.name}</p>
              <p className="px-2 text-sm font-light text-gray-500">
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

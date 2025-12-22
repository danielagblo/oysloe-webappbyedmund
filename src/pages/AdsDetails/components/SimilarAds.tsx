import React from "react";
import { Link } from "react-router-dom";
import { formatMoney } from "../../../utils/formatMoney";

interface SimilarAdsProps {
  relatedProducts: any[];
}

const SimilarAds: React.FC<SimilarAdsProps> = ({ relatedProducts }) => (
  <div className="bg-white sm:bg-(--div-active) max-sm:p-4 sm:py-6 w-screen md:px-12">
    <h2 className="text-xl font-bold mb-6 px-2 md:px-20 lg:text-2xl">
      Similar Ads
    </h2>

    <div className="flex flex-wrap gap-2 sm:gap-3 w-full justify-start">
      {(() => {
        const availableAds =
          relatedProducts?.filter((ad) => !ad.is_taken) ?? [];
        return availableAds.length > 0 ? (
          availableAds.map((ad) => (
            <Link
              key={ad.id}
              to={`/ads/${ad.id}`}
              state={{ adData: ad }}
              className="inline-block rounded-2xl overflow-hidden shrink-0 w-[38vw] max-sm:min-w-[43.5vw] sm:w-48 md:w-52"
            >
              <img
                src={ad.image || "/no-image.jpeg"}
                alt={ad.name.slice(0, 10)}
                className="w-full h-[120px] sm:h-48 object-cover rounded-2xl"
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
          ))
        ) : (
          <div className="flex items-center flex-col justify-center w-full gap-2">
            <img
              src="/nothing-to-show.png"
              className="w-25 h-25"
              alt="nothing to show"
            />
            <p className="text-gray-500 text-sm md:text-[1.2vw] w-full text-center">
              No similar ads to show.
            </p>
          </div>
        );
      })()}
    </div>
  </div>
);

export default React.memo(SimilarAds);

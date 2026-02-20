import React from "react";
import { formatMoney } from "../../../utils/formatMoney";
import type { Product } from "../../../types/Product";
import { assetUrl } from "../../../assets/publicAssets";

interface TitleAndPriceProps {
  currentAdData?: Product | any;
  currentAdDataFromQuery?: Product | any;
  id: string | undefined;
}

const TitleAndPrice: React.FC<TitleAndPriceProps> = ({
  currentAdData,
  currentAdDataFromQuery,
}) => {
  return (
    <div className="bg-white px-4 sm:px-0 py-2 w-full text-left rounded-lg">
      <div className="flex items-center gap-2">
        <img src={assetUrl("location.svg")} alt="" className="w-3 h-3 sm:w-4 sm:h-4 lg:w-[1.2vw] lg:h-[1.2vw]" />
        <h2 className="text-sm sm:text-5 lg:text-[1.1vw]">
          {currentAdData?.location?.name && currentAdData?.location?.region
            ? `${currentAdData?.location?.name}, ${currentAdData?.location?.region} Region`
            : "Unknown"}
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <h2 className="text-2xl sm:text-5 lg:text-[2vw] font-medium">
          {currentAdData?.name || "Untitled Product"}
        </h2>
        {((currentAdData as any)?.is_taken ||
          (currentAdDataFromQuery as any)?.is_taken) && (
          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
            Taken
          </span>
        )}
      </div>
      <h2 className="text-xl font-medium sm:text-5 lg:text-[1.5vw]">
        {currentAdData?.price
          ? `${formatMoney(currentAdData?.price)}${currentAdData?.type?.toLowerCase() === "rent" ? " per month" : ""}`
          : "Please Contact the Seller for the Price of this Product"}
      </h2>
    </div>
  );
};

export default React.memo(TitleAndPrice);

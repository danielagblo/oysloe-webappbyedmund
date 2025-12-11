import React from "react";
import type { Product } from "../../../types/Product";
import type { ProductFeature } from "../../../types/ProductFeature";

interface AdDetailsProps {
  id: string | undefined;
  currentAdDataFromQuery?: Product | any;
  currentAdData?: Product | any;
}

const AdDetails: React.FC<AdDetailsProps> = ({ id, currentAdDataFromQuery, currentAdData }) => {
  return (
    <div className=" sm:p-6 md:pl-0">
      <h2 className="text-xl md:text-[1.75vw] font-bold mb-2">Ad Details</h2>
      <ul className="list-disc ml-5 md:ml-10 marker:text-black marker:font-extrabold space-y-2 text-sm md:text-[1.125vw]">
        <li>
          <span className="font-bold">Ad ID&nbsp;</span> {id}
        </li>
        {currentAdDataFromQuery?.product_features.map(
          (feat: ProductFeature) => (
            <li key={feat.id}>
              <span className="font-bold">{feat.feature.name}&nbsp;</span>
              <span>{feat.value}</span>
            </li>
          ),
        )}
        {currentAdData?.location?.name && (
          <li>
            <span className="font-bold">Location&nbsp;</span>{" "}
            {currentAdData?.location?.name}
          </li>
        )}
      </ul>
    </div>
  );
};

export default React.memo(AdDetails);

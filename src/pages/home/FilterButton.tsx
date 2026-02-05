import { useState } from "react";
import MobileFilterModal from "./MobileFilterModal";

interface Category {
  id: number;
  name: string;
}

type Props = {
  className?: string;
  handleFilterSettings: () => void;
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
  selectedSubcategoryId: number | "";
  setSelectedSubcategoryId: (id: number | "") => void;
  selectedFeatures: Record<number, string>;
  setSelectedFeatures: (features: Record<number, string>) => void;
  selectedLocation: string | null;
  setSelectedLocation: (location: string | null) => void;
  selectedTimeframe: "newest" | "7days" | "30days" | "anytime";
  setSelectedTimeframe: (
    timeframe: "newest" | "7days" | "30days" | "anytime",
  ) => void;
  selectedAdType?: "SALE" | "RENT" | "PAYLATER" | "all";
  setSelectedAdType?: (adType: "SALE" | "RENT" | "PAYLATER" | "all") => void;
  priceSort: "none" | "low-to-high" | "high-to-low";
  setPriceSort: (sort: "none" | "low-to-high" | "high-to-low") => void;
  timeframeSort: "none" | "newest" | "oldest";
  setTimeframeSort: (sort: "none" | "newest" | "oldest") => void;
  priceFilter: { mode: string };
  setPriceFilter: (filter: any) => void;
  categories: Category[];
  uniqueLocations: string[];
  allProducts?: any[];
  applyFilters?: (products: any[]) => any[];
};

const FilterButton = ({
  className,
  handleFilterSettings,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedSubcategoryId,
  setSelectedSubcategoryId,
  selectedLocation,
  setSelectedLocation,
  selectedTimeframe,
  setSelectedTimeframe,
  selectedAdType = "all",
  setSelectedAdType,
  priceSort,
  setPriceSort,
  timeframeSort,
  setTimeframeSort,
  priceFilter,
  setPriceFilter,
  selectedFeatures,
  setSelectedFeatures,
  categories,
  uniqueLocations,
  allProducts = [],
  applyFilters = (products) => products,
}: Props) => {
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const activeFiltersCount = [
    selectedCategoryId !== null ? 1 : 0,
    selectedSubcategoryId !== "" ? 1 : 0,
    selectedLocation ? 1 : 0,
    selectedTimeframe !== "anytime" ? 1 : 0,
    selectedAdType !== "all" ? 1 : 0,
    priceSort !== "none" ? 1 : 0,
    timeframeSort !== "none" ? 1 : 0,
    priceFilter.mode !== "none" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const handleMobileFilterClick = () => {
    setIsMobileModalOpen(true);
  };

  const handleDesktopFilterClick = () => {
    handleFilterSettings();
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={handleMobileFilterClick}
        className={`${className} z-40 sm:hidden`}
      >
        <div
          className={`bg-gray-100 w-25 h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg cursor-pointer relative`}
        >
          {activeFiltersCount > 0 && (
            <div className="absolute -top-1 right-0 bg-(--dark-def) text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </div>
          )}
          <p className="text-base">Filter</p>
          <img src="/filter-svgrepo.svg" alt="Filter" className="w-7 h-7" />
        </div>
      </button>

      {/* Desktop Filter Button */}
      <button
        onClick={handleDesktopFilterClick}
        className={`${className} hidden z-40 sm:block`}
      >
        <div
          className={`bg-white w-[10vw] h-[3.5vw] max-lg:h-[3.5vh] max-lg:w-[10vh] max-lg:mb-2 rounded-full flex items-center justify-center gap-2 shadow-lg cursor-pointer relative`}
        >
          {activeFiltersCount > 0 && (
            <div className="absolute -top-1 right-0 bg-(--dark-def) text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </div>
          )}
          <p className="text-[1.25vw] max-lg:text-2xl">Filter</p>
          <img
            src="/filter-svgrepo.svg"
            alt="Filter"
            className="w-[2.1vw] h-[2.1vw]"
          />
        </div>
      </button>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        selectedCategoryId={selectedCategoryId}
        setSelectedCategoryId={setSelectedCategoryId}
        selectedSubcategoryId={selectedSubcategoryId}
        setSelectedSubcategoryId={setSelectedSubcategoryId}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
        selectedAdType={selectedAdType}
        setSelectedAdType={setSelectedAdType}
        priceSort={priceSort}
        setPriceSort={setPriceSort}
        timeframeSort={timeframeSort}
        setTimeframeSort={setTimeframeSort}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        selectedFeatures={selectedFeatures}
        setSelectedFeatures={setSelectedFeatures}
        categories={categories}
        uniqueLocations={uniqueLocations}
        allProducts={allProducts}
        applyFilters={applyFilters}
      />
    </>
  );
};

export default FilterButton;

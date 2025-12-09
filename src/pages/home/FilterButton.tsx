
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
    setSelectedTimeframe: (timeframe: "newest" | "7days" | "30days" | "anytime") => void;
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
    selectedLocation, 
    setSelectedLocation,
    selectedTimeframe,
    setSelectedTimeframe,
    priceSort,
    setPriceSort,
    timeframeSort,
    setTimeframeSort,
    priceFilter,
    setPriceFilter,
    categories,
    uniqueLocations,
    allProducts = [],
    applyFilters = (products) => products,
}: Props) => {
    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
    
    const activeFiltersCount = [
        selectedCategoryId !== null ? 1 : 0,
        selectedLocation ? 1 : 0,
        selectedTimeframe !== "anytime" ? 1 : 0,
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
            <button onClick={handleMobileFilterClick} className={`${className} sm:hidden`}>
                <div className={`bg-gray-100 w-30 h-12 rounded-full flex items-center justify-center gap-2 shadow-lg cursor-pointer relative`}>
                    {activeFiltersCount > 0 && (
                        <div className="absolute -top-1 right-0 bg-(--dark-def) text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {activeFiltersCount}
                        </div>
                    )}
                    <img src="/filter-svgrepo.svg" alt="Filter" className="w-7 h-7" />
                    <p className="text-sm">Filter</p>
                </div>
            </button>

            {/* Desktop Filter Button */}
            <button onClick={handleDesktopFilterClick} className={`${className} hidden sm:block`}>
                <div className={`bg-white w-[10vw] h-[3.5vw] rounded-full flex items-center justify-center gap-2 shadow-lg cursor-pointer relative`}>
                    {activeFiltersCount > 0 && (
                        <div className="absolute -top-1 right-0 bg-(--dark-def) text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {activeFiltersCount}
                        </div>
                    )}
                    <img src="/filter-svgrepo.svg" alt="Filter" className="w-[2.1vw] h-[2.1vw]" />
                    <p className="text-[1.25vw]">Filter</p>
                </div>
            </button>

            {/* Mobile Filter Modal */}
            <MobileFilterModal
                isOpen={isMobileModalOpen}
                onClose={() => setIsMobileModalOpen(false)}
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                selectedTimeframe={selectedTimeframe}
                setSelectedTimeframe={setSelectedTimeframe}
                priceSort={priceSort}
                setPriceSort={setPriceSort}
                timeframeSort={timeframeSort}
                setTimeframeSort={setTimeframeSort}
                priceFilter={priceFilter}
                setPriceFilter={setPriceFilter}
                categories={categories}
                uniqueLocations={uniqueLocations}
                allProducts={allProducts}
                applyFilters={applyFilters}
            />
        </>
    );
}

export default FilterButton;

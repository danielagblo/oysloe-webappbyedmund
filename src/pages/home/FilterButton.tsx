
type Props = {
    className?: string;
    handleFilterSettings: () => void;
    selectedCategoryId: number | null;
    selectedSubcategoryId: number | "";
    selectedFeatures: Record<number, string>;
    selectedLocation: string | null;
    selectedTimeframe: "newest" | "7days" | "30days" | "anytime";
    priceSort: "none" | "low-to-high" | "high-to-low";
    timeframeSort: "none" | "newest" | "oldest";
    priceFilter: { mode: string };
};

const FilterButton = ({ className, handleFilterSettings, selectedCategoryId, selectedSubcategoryId, selectedFeatures, selectedLocation, selectedTimeframe, priceSort, timeframeSort, priceFilter }: Props) => {
    const activeFiltersCount = [
        selectedCategoryId !== null ? 1 : 0,
        selectedSubcategoryId !== null && selectedSubcategoryId !== "" ? 1 : 0,
        Object.keys(selectedFeatures).length > 0 ? 1 : 0,
        selectedLocation ? 1 : 0,
        selectedTimeframe !== "anytime" ? 1 : 0,
        priceSort !== "none" ? 1 : 0,
        timeframeSort !== "none" ? 1 : 0,
        priceFilter.mode !== "none" ? 1 : 0,
    ].reduce((a, b) => a + b, 0);

    return (
        <button onClick={handleFilterSettings} className={className}>
            <div className={`bg-gray-100 lg:bg-white w-30 h-12 lg:w-[10vw] lg:h-[3.5vw] rounded-full flex items-center justify-center gap-2 shadow-lg cursor-pointer relative`}>
                {activeFiltersCount > 0 && (
                    <div className="absolute -top-1 right-0 bg-(--dark-def) text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {activeFiltersCount}
                    </div>
                )}
                <img src="/filter-svgrepo.svg" alt="Filter" className="w-7 h-7 lg:w-[2.1vw] lg:h-[2.1vw]" />
                <p className="text-sm lg:text-[1.25vw]">Filter</p>
            </div>
        </button>
    );
}

export default FilterButton;

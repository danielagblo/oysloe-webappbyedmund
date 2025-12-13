import type { Category } from "../../types/Category";

type Props = {
  selectedCategoryId: number | null;
  categories: Category[];
  selectedLocation: string | null;
  setSelectedLocation: (v: string | null) => void;
  selectedTimeframe: "newest" | "7days" | "30days" | "anytime";
  setSelectedTimeframe: (v: "newest" | "7days" | "30days" | "anytime") => void;
  priceSort: "none" | "low-to-high" | "high-to-low";
  setPriceSort: (v: "none" | "low-to-high" | "high-to-low") => void;
  timeframeSort: "none" | "newest" | "oldest";
  setTimeframeSort: (v: "none" | "newest" | "oldest") => void;
  priceFilter: {
    mode: string;
    below?: number;
    above?: number;
    min?: number;
    max?: number;
  };
  setPriceFilter: (p: any) => void;
  handleBackToHome: () => void;
};

const CategoryFilters = ({
  selectedCategoryId,
  categories,
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
  handleBackToHome,
}: Props) => {
  const selectedCategoryName = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId)?.name
    : null;

  const timeframeLabels: Record<string, string> = {
    newest: "Newest (24h)",
    "7days": "Last 7 days",
    "30days": "Last 30 days",
    anytime: "Anytime",
  };

  const priceSortLabels: Record<string, string> = {
    "low-to-high": "Price: Low to High",
    "high-to-low": "Price: High to Low",
  };

  const dateSortLabels: Record<string, string> = {
    newest: "Newest First",
    oldest: "Oldest First",
  };

  const getPriceFilterLabel = () => {
    if (priceFilter.mode === "below") return `Below ₵${priceFilter.below}`;
    if (priceFilter.mode === "above") return `Above ₵${priceFilter.above}`;
    if (priceFilter.mode === "between")
      return `₵${priceFilter.min} - ₵${priceFilter.max}`;
    return null;
  };

  const activeFilters: Array<{
    label: string;
    icon: string;
    onClear?: () => void;
  }> = [];

  if (selectedCategoryName) {
    activeFilters.push({
      label: selectedCategoryName,
      icon: "/cancel.svg",
      onClear: handleBackToHome,
    });
  }
  if (selectedLocation) {
    activeFilters.push({
      label: selectedLocation,
      icon: "/location.svg",
      onClear: () => setSelectedLocation(null),
    });
  }
  if (selectedTimeframe !== "anytime") {
    activeFilters.push({
      label: timeframeLabels[selectedTimeframe],
      icon: "/time-svgrepo-com.svg",
      onClear: () => setSelectedTimeframe("anytime"),
    });
  }
  if (priceSort !== "none") {
    activeFilters.push({
      label: priceSortLabels[priceSort],
      icon: "/price-tag-svgrepo-com.svg",
      onClear: () => setPriceSort("none"),
    });
  }
  if (timeframeSort !== "none") {
    activeFilters.push({
      label: dateSortLabels[timeframeSort],
      icon: "/date-range-svgrepo-com.svg",
      onClear: () => setTimeframeSort("none"),
    });
  }
  const priceFilterLabel = getPriceFilterLabel();
  if (priceFilterLabel)
    activeFilters.push({
      label: priceFilterLabel,
      icon: "/filter-svgrepo.svg",
      onClear: () => setPriceFilter({ mode: "none" }),
    });

  if (activeFilters.length === 0) {
    return (
      <div className="flex flex-wrap justify-center sm:justify-center gap-2 sm:gap-4 mt-4 mb-6 px-3 sm:px-0">
        <button className="bg-white flex-1 sm:flex-none min-w-[140px] max-w-[180px] px-3 sm:px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 opacity-50 cursor-default">
          No active filters
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center sm:justify-center gap-2 sm:gap-4 mt-4 mb-6 px-3 sm:px-0">
      {activeFilters.map((filter, idx) => (
        <button
          key={idx}
          onClick={filter.onClear}
          className="bg-white flex-1 sm:flex-none min-w-[140px] max-w-[200px] px-3 sm:px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
        >
          {filter.label}
          <img src={filter.icon} alt="Clear filter" className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;

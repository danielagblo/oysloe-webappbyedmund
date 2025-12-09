import React, { useState, useRef, useMemo } from "react";
import { categoryOptions } from "../../data/categories";

interface Category {
  id: number;
  name: string;
}

interface MobileFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
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
}

type PanelType = "main" | "categories" | "locations" | "subcategories";

const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
  isOpen,
  onClose,
  selectedCategoryId,
  setSelectedCategoryId,
  selectedLocation,
  setSelectedLocation,
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
}) => {
  const [currentPanel, setCurrentPanel] = useState<PanelType>("main");
  const [tempPriceRange, setTempPriceRange] = useState({
    min: (priceFilter as any)?.min || 0,
    max: (priceFilter as any)?.max || 1000000,
  });
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.TouchEvent) => {
    setDragStart(e.touches[0].clientY);
  };

  const handleDragMove = (e: React.TouchEvent) => {
    if (dragStart === 0) return;
    const currentY = e.touches[0].clientY;
    const diff = Math.max(0, currentY - dragStart);
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (dragOffset > 100) {
      onClose();
    }
    setDragOffset(0);
    setDragStart(0);
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const selectedCategoryName = selectedCategory?.name || "Select Category";
  
  // Get subcategories for selected category
  const currentSubcategories = selectedCategory 
    ? categoryOptions[selectedCategory.name] || [] 
    : [];

  // Calculate filtered count
  const filteredProductsCount = useMemo(() => {
    return applyFilters(allProducts).length;
  }, [allProducts, applyFilters]);

  const handleClearAll = () => {
    setSelectedCategoryId(null);
    setSelectedLocation(null);
    setSelectedTimeframe("anytime");
    setPriceSort("none");
    setTimeframeSort("none");
    setPriceFilter({ mode: "none" });
    setSelectedSubcategoryId(null);
    setTempPriceRange({ min: 0, max: 1000000 });
    setCurrentPanel("main");
  };

  const handleViewAll = () => {
    // Apply price filter if set
    if (tempPriceRange.min > 0 || tempPriceRange.max < 1000000) {
      setPriceFilter({
        mode: "between",
        min: tempPriceRange.min,
        max: tempPriceRange.max,
      });
    }
    onClose();
  };

  const getCategoryIcon = (categoryName: string) => {
    const cleanName = categoryName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    return `/${cleanName}.png`;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-998 sm:hidden"
        onClick={onClose}
      />

      {/* Bottom Sheet Modal */}
      <div
        ref={modalRef}
        className={`fixed bottom-0 left-0 right-0 bg-(--div-active) rounded-t-3xl z-999 sm:hidden max-h-[85vh] overflow-hidden flex flex-col ${
          isOpen 
            ? "translate-y-0 transition-transform duration-500 ease-out" 
            : "translate-y-full"
        }`}
        style={{
          transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : undefined,
        }}
      >
        {/* Header - White background with drag indicator */}
        <div 
          className="bg-white rounded-t-3xl p-4 flex flex-col items-center cursor-grab active:cursor-grabbing touch-none"
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {/* Drag indicator */}
          <div className="w-12 h-1 bg-gray-300 rounded-full mb-3" />
          <span className="text-lg font-semibold text-gray-900">Filter</span>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
          {/* Main Panel */}
          {currentPanel === "main" && (
            <div className="space-y-4">
              {/* Category & Location Section */}
              <div className="bg-white rounded-3xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Category</span>
                  <button
                    onClick={() => setCurrentPanel("categories")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <span className="text-sm text-gray-800 truncate max-w-[120px]">
                      {selectedCategoryName}
                    </span>
                    <span className="text-gray-400 shrink-0">→</span>
                  </button>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Location</span>
                  <button
                    onClick={() => setCurrentPanel("locations")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <span className="text-sm text-gray-800 truncate max-w-[120px]">
                      {selectedLocation || "Select Location"}
                    </span>
                    <span className="text-gray-400 shrink-0">→</span>
                  </button>
                </div>
              </div>

              {/* Subcategories Section - Show if category selected */}
              {selectedCategoryId && currentSubcategories.length > 0 && (
                <div className="bg-white rounded-3xl p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Subcategories</h3>
                  <button
                    onClick={() => setCurrentPanel("subcategories")}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-200"
                  >
                    <span className="text-sm text-gray-700">
                      {selectedSubcategoryId ? currentSubcategories.find(s => s === selectedSubcategoryId) : "Select Subcategory"}
                    </span>
                    <span className="text-gray-400">→</span>
                  </button>
                </div>
              )}

              {/* Price Section */}
              <div className="bg-white rounded-3xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Price Range</h3>
                <div className="flex gap-2 items-center w-full overflow-hidden">
                  <input
                    type="number"
                    placeholder="Min"
                    value={tempPriceRange.min}
                    onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: Number(e.target.value) || 0 })}
                    className="min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <span className="text-gray-400 font-light shrink-0">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={tempPriceRange.max}
                    onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: Number(e.target.value) || 1000000 })}
                    className="min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Sorting Section */}
              <div className="bg-white rounded-3xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Sort by Price</span>
                  <select
                    value={priceSort}
                    onChange={(e) => setPriceSort(e.target.value as "none" | "low-to-high" | "high-to-low")}
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                  >
                    <option value="none">None</option>
                    <option value="low-to-high">Low to High</option>
                    <option value="high-to-low">High to Low</option>
                  </select>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Sort by Date</span>
                  <select
                    value={timeframeSort}
                    onChange={(e) => setTimeframeSort(e.target.value as "none" | "newest" | "oldest")}
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                  >
                    <option value="none">None</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Categories Panel */}
          {currentPanel === "categories" && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <button
                  onClick={() => setCurrentPanel("main")}
                  className="flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900"
                >
                  <span>←</span>
                  <span className="text-sm">Back</span>
                </button>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategoryId(category.id);
                        setCurrentPanel("main");
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                        selectedCategoryId === category.id
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <img
                        src={getCategoryIcon(category.name)}
                        alt={category.name}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      <span className="flex-1 text-left text-gray-800 text-sm">{category.name}</span>
                      {selectedCategoryId === category.id && (
                        <span className="text-blue-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subcategories Panel */}
          {currentPanel === "subcategories" && currentSubcategories.length > 0 && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <button
                  onClick={() => setCurrentPanel("main")}
                  className="flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900"
                >
                  <span>←</span>
                  <span className="text-sm">Back to Main</span>
                </button>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Subcategories</h3>
                <div className="space-y-2">
                  {currentSubcategories.map((subcategory) => (
                    <button
                      key={subcategory}
                      onClick={() => {
                        setSelectedSubcategoryId(selectedSubcategoryId === subcategory ? null : subcategory);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                        selectedSubcategoryId === subcategory
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-gray-800 text-sm">{subcategory}</span>
                      {selectedSubcategoryId === subcategory && (
                        <span className="text-blue-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Locations Panel */}
          {currentPanel === "locations" && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <button
                  onClick={() => setCurrentPanel("main")}
                  className="flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900"
                >
                  <span>←</span>
                  <span className="text-sm">Back</span>
                </button>
                <div className="space-y-2">
                  {uniqueLocations.map((location) => (
                    <button
                      key={location}
                      onClick={() => {
                        setSelectedLocation(selectedLocation === location ? null : location);
                        setCurrentPanel("main");
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                        selectedLocation === location
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-gray-800 text-sm">{location}</span>
                      {selectedLocation === location && (
                        <span className="text-blue-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Always visible */}
        <div className="fixed bottom-0 left-0 right-0 p-4 flex gap-3 bg-white rounded-b-3xl sm:hidden border-t border-gray-200">
          <button
            onClick={handleClearAll}
            className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-full font-medium hover:bg-gray-200 transition"
          >
            Clear all
          </button>
          <button
            onClick={handleViewAll}
            className="flex-1 py-3 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition"
          >
            View all ({filteredProductsCount.toLocaleString()})
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileFilterModal;

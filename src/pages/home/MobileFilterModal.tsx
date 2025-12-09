import React, { useState, useRef, useMemo } from "react";
import { categoryOptions } from "../../data/categories";
import useLocations from "../../features/locations/useLocations";

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
  selectedFeatures: Record<number, string>;
  setSelectedFeatures: (features: Record<number, string>) => void;
  categories: Category[];
  uniqueLocations: string[];
  allProducts?: any[];
  applyFilters?: (products: any[]) => any[];
}

type PanelType = "main" | "categories" | "regions" | "locations" | "subcategories";

const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
  isOpen,
  onClose,
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
  selectedFeatures,
  setSelectedFeatures,
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
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
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

  // Get available features for selected subcategories
  const availableFeatures = useMemo(() => {
    if (!selectedSubcategoryIds || selectedSubcategoryIds.length === 0) return [];
    
    const featuresMap = new Map<number, Set<string>>();
    allProducts.forEach((product: any) => {
      if (!product.product_features) return;
      product.product_features.forEach((pf: any) => {
        if (pf.feature?.subcategory && selectedSubcategoryIds.includes(pf.feature.subcategory.toString())) {
          const featureId = pf.feature.id;
          if (!featuresMap.has(featureId)) {
            featuresMap.set(featureId, new Set());
          }
          if (pf.value) {
            featuresMap.get(featureId)?.add(pf.value);
          }
        }
      });
    });
    
    return Array.from(featuresMap.entries()).map(([id, values]) => ({
      id,
      values: Array.from(values).sort(),
    }));
  }, [selectedSubcategoryIds, allProducts]);
  // Get regions and locations from the hook
  const { groupedLocations: regionsData } = useLocations();

  const handleClearAll = () => {
    setSelectedCategoryId(null);
    setSelectedLocation(null);
    setSelectedRegion(null);
    setSelectedLocationIds([]);
    setSelectedTimeframe("anytime");
    setPriceSort("none");
    setTimeframeSort("none");
    setPriceFilter({ mode: "none" });
    setSelectedSubcategoryIds([]);
    setSelectedFeatures({});
    setTempPriceRange({ min: 0, max: 1000000 });
  };

  const handleViewAll = () => {
    // Apply selected locations to parent state
    if (selectedLocationIds.length > 0) {
      // Store as comma-separated string to maintain single selectedLocation prop
      setSelectedLocation(selectedLocationIds.join(","));
    } else {
      setSelectedLocation(null);
    }
    
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
        className={`fixed bottom-15 left-0 right-0 bg-(--div-active) rounded-t-3xl z-999 sm:hidden max-h-[85vh] overflow-hidden flex flex-col ${
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
                    <img src="/arrowright.svg" alt="open" className="w-4 h-4 shrink-0" />
                  </button>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Location</span>
                  <button
                    onClick={() => setCurrentPanel("regions")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <span className="text-sm text-gray-800 truncate max-w-[120px]">
                      {selectedLocationIds.length > 0 
                        ? `${selectedLocationIds.length} selected` 
                        : "Select Location"}
                    </span>
                    <img src="/arrowright.svg" alt="open" className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </div>

              {/* Subcategories Section - Show if category selected */}
              {selectedCategoryId && currentSubcategories.length > 0 && (
                <div className="bg-white rounded-3xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700">Subcategory</span>
                    <button
                      onClick={() => setCurrentPanel("subcategories")}
                      className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                    >
                      <span className="text-sm text-gray-800 truncate max-w-[120px]">
                        {selectedSubcategoryIds.length > 0 
                          ? `${selectedSubcategoryIds.length} selected` 
                          : "Select Subcategory"}
                      </span>
                      <img src="/arrowright.svg" alt="open" className="w-4 h-4 shrink-0" />
                    </button>
                  </div>

                  {/* Features Section - Show if subcategories selected */}
                  {selectedSubcategoryIds.length > 0 && availableFeatures.length > 0 && (
                    <>
                      <div className="border-t border-gray-200" />
                      <div className="space-y-2">
                        {availableFeatures.map((feature) => (
                          <select
                            key={feature.id}
                            value={selectedFeatures[feature.id] || ""}
                            onChange={(e) => {
                              if (e.target.value) {
                                setSelectedFeatures({
                                  ...selectedFeatures,
                                  [feature.id]: e.target.value,
                                });
                              } else {
                                const updated = { ...selectedFeatures };
                                delete updated[feature.id];
                                setSelectedFeatures(updated);
                              }
                            }}
                            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2"
                          >
                            <option value="">Feature {feature.id}</option>
                            {feature.values.map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Timeframe Filter Section */}
              <div className="bg-white rounded-3xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Posted</span>
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value as "newest" | "7days" | "30days" | "anytime")}
                    className="text-sm border border-gray-300 rounded-lg px-2 py-1"
                  >
                    <option value="anytime">Anytime</option>
                    <option value="newest">Newest</option>
                    <option value="7days">Last 7 days</option>
                    <option value="30days">Last 30 days</option>
                  </select>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-white rounded-3xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Price Range</h3>
                <div className="flex gap-2 items-center w-full overflow-hidden">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    value={tempPriceRange.min}
                    onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: Number(e.target.value) || 0 })}
                    className="min-w-0 flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <span className="text-gray-400 font-light shrink-0">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
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
            <div className="w-screen -mx-4">
              <div className="bg-white p-4">
                <button
                  onClick={() => setCurrentPanel("main")}
                  className="flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900"
                >
                  <span>←</span>
                  <span className="text-sm">Back</span>
                </button>
                <div>
                  {categories.map((category, index) => (
                    <div key={category.id}>
                      <button
                        onClick={() => {
                          if (selectedCategoryId === category.id) {
                            setSelectedCategoryId(null);
                          } else {
                            setSelectedCategoryId(category.id);
                          }
                          setCurrentPanel("main");
                        }}
                        className={`w-full flex items-center gap-3 p-3 transition ${
                          selectedCategoryId === category.id
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
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
                      {index < categories.length - 1 && (
                        <div className="border-t border-gray-100" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subcategories Panel */}
          {currentPanel === "subcategories" && currentSubcategories.length > 0 && (
            <div className="w-screen -mx-4">
              <div className="bg-white p-4">
                <button
                  onClick={() => setCurrentPanel("main")}
                  className="flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900"
                >
                  <span>←</span>
                  <span className="text-sm">Back to Main</span>
                </button>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Select Subcategories</h3>
                <div>
                  {currentSubcategories.map((subcategory, index) => (
                    <div key={subcategory}>
                      <button
                        onClick={() => {
                          setSelectedSubcategoryIds(
                            selectedSubcategoryIds.includes(subcategory)
                              ? selectedSubcategoryIds.filter(s => s !== subcategory)
                              : [...selectedSubcategoryIds, subcategory]
                          );
                        }}
                        className={`w-full flex items-center gap-3 p-3 transition ${
                          selectedSubcategoryIds.includes(subcategory)
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSubcategoryIds.includes(subcategory)}
                          onChange={() => {}}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-gray-800 text-sm flex-1">{subcategory}</span>
                      </button>
                      {index < currentSubcategories.length - 1 && (
                        <div className="border-t border-gray-100" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Regions Panel */}
          {currentPanel === "regions" && (
            <div className="w-screen -mx-4">
              <div className="bg-white p-4">
                <button
                  onClick={() => setCurrentPanel("main")}
                  className="flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900"
                >
                  <span>←</span>
                  <span className="text-sm">Back</span>
                </button>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Select Region</h3>
                <div>
                  {Object.keys(regionsData).map((region, index) => (
                    <div key={region}>
                      <button
                        onClick={() => {
                          setSelectedRegion(region);
                          setCurrentPanel("locations");
                        }}
                        className={`w-full flex items-center justify-between p-3 transition ${
                          selectedRegion === region
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-gray-800 text-sm">{region}</span>
                        <img src="/arrowright.svg" alt="open" className="w-4 h-4 shrink-0" />
                      </button>
                      {index < Object.keys(regionsData).length - 1 && (
                        <div className="border-t border-gray-100" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Locations Panel */}
          {currentPanel === "locations" && selectedRegion && (
            <div className="w-screen -mx-4">
              <div className="bg-white p-4">
                <button
                  onClick={() => {
                    setCurrentPanel("regions");
                    setSelectedRegion(null);
                  }}
                  className="flex items-center gap-2 text-gray-600 mb-4 hover:text-gray-900"
                >
                  <span>←</span>
                  <span className="text-sm">Back</span>
                </button>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">Select Locations in {selectedRegion}</h3>
                <div>
                  {/* All Locations Option */}
                  <div>
                    <button
                      onClick={() => {
                        const allLocationsKey = `All - ${selectedRegion}`;
                        setSelectedLocationIds(
                          selectedLocationIds.includes(allLocationsKey)
                            ? selectedLocationIds.filter(id => id !== allLocationsKey && !regionsData[selectedRegion]?.includes(id))
                            : [allLocationsKey, ...(regionsData[selectedRegion] || [])]
                        );
                      }}
                      className={`w-full flex items-center gap-3 p-3 transition ${
                        selectedLocationIds.includes(`All - ${selectedRegion}`)
                          ? "bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLocationIds.includes(`All - ${selectedRegion}`)}
                        onChange={() => {}}
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span className="text-gray-800 text-sm font-semibold flex-1">All locations in {selectedRegion}</span>
                    </button>
                    <div className="border-t border-gray-100" />
                  </div>

                  {/* Individual Locations */}
                  {regionsData[selectedRegion]?.map((location, index) => (
                    <div key={location}>
                      <button
                        onClick={() => {
                          setSelectedLocationIds(
                            selectedLocationIds.includes(location)
                              ? selectedLocationIds.filter(id => id !== location)
                              : [...selectedLocationIds, location]
                          );
                        }}
                        className={`w-full flex items-center gap-3 p-3 transition ${
                          selectedLocationIds.includes(location)
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedLocationIds.includes(location)}
                          onChange={() => {}}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <span className="text-gray-800 text-sm flex-1">{location}</span>
                      </button>
                      {index < (regionsData[selectedRegion]?.length || 0) - 1 && (
                        <div className="border-t border-gray-100" />
                      )}
                    </div>
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
            View all
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileFilterModal;

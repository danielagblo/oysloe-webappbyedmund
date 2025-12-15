import React, { useState, useRef, useMemo, useEffect } from "react";
import useLocations from "../../features/locations/useLocations";
import { getSubcategories } from "../../services/subcategoryService";
import {
  getFeatures,
  getPossibleFeatureValues,
} from "../../services/featureService";
import normalizePossibleFeatureValues from "../../hooks/normalizearrayfeatures";
import Loader from "../../components/LoadingDots";

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
  selectedFeatures: Record<number, string>;
  setSelectedFeatures: (features: Record<number, string>) => void;
  categories: Category[];
  uniqueLocations: string[];
  allProducts?: any[];
  applyFilters?: (products: any[]) => any[];
}

type PanelType =
  | "main"
  | "categories"
  | "regions"
  | "locations"
  | "subcategories";

const MobileFilterModal: React.FC<MobileFilterModalProps> = ({
  isOpen,
  onClose,
  selectedCategoryId,
  setSelectedCategoryId,
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
}) => {
  const [currentPanel, setCurrentPanel] = useState<PanelType>("main");
  const [tempPriceRange, setTempPriceRange] = useState({
    min: (priceFilter as any)?.min || "",
    max: (priceFilter as any)?.max || "",
  });
  const [tempSelectedAdType, setTempSelectedAdType] = useState<
    "SALE" | "RENT" | "PAYLATER" | "all"
  >(selectedAdType);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<
    string[]
  >([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [featureDefinitions, setFeatureDefinitions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [possibleFeatureValues, setPossibleFeatureValues] = useState<
    Record<number, string[]>
  >({});
  const [featuresLoading, setFeaturesLoading] = useState(false);
  const [isFeaturesExpanded, setIsFeaturesExpanded] = useState(true);
  const [subcategorySearch, setSubcategorySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
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

  // Clear search inputs when panel changes
  useEffect(() => {
    if (currentPanel !== "subcategories") {
      setSubcategorySearch("");
    }
    if (currentPanel !== "locations") {
      setLocationSearch("");
    }
  }, [currentPanel]);

  // Clear selected subcategories when category changes
  useEffect(() => {
    setSelectedSubcategoryIds([]);
  }, [selectedCategoryId]);

  // Fetch subcategories when category changes
  useEffect(() => {
    let mounted = true;
    setSubcategoriesLoading(true);
    (async () => {
      try {
        if (
          typeof selectedCategoryId === "number" &&
          !isNaN(selectedCategoryId)
        ) {
          let subs = (await getSubcategories({
            category: selectedCategoryId,
          })) as any;
          if (!mounted) return;
          if (!Array.isArray(subs) && subs && Array.isArray(subs.results))
            subs = subs.results;
          const mapped = (subs || []).map((s: any) => ({
            id: s.id,
            name: s.name ?? s.title ?? s.display_name ?? s.label ?? "",
          }));
          setSubcategories(mapped);
        } else {
          setSubcategories([]);
        }
      } catch (e) {
        console.warn("Failed to fetch subcategories", e);
        setSubcategories([]);
      } finally {
        setSubcategoriesLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedCategoryId]);

  // Fetch feature definitions and their possible values when subcategories are selected
  useEffect(() => {
    let mounted = true;
    setFeaturesLoading(true);

    (async () => {
      try {
        if (selectedSubcategoryIds.length === 0) {
          setFeatureDefinitions([]);
          setPossibleFeatureValues({});
          setFeaturesLoading(false);
          return;
        }

        // Fetch features for all selected subcategories
        const featurePromises = selectedSubcategoryIds.map((subIdStr) => {
          const subId = parseInt(subIdStr, 10);
          return getFeatures({ subcategory: subId })
            .then((res) => res)
            .catch((err) => {
              console.warn(`Failed to fetch features for subcategory ${subId}`, err);
              return [];
            });
        });

        const allFeaturesResults = await Promise.all(featurePromises);

        if (!mounted) return;

        // Combine all features and deduplicate by ID
        const featureMap = new Map<number, any>();
        allFeaturesResults.forEach((featuresResult: any) => {
          let features = featuresResult;
          if (
            !Array.isArray(features) &&
            features &&
            Array.isArray(features.results)
          ) {
            features = features.results;
          }

          (features || []).forEach((f: any) => {
            const id = Number(f.id);
            if (!featureMap.has(id)) {
              featureMap.set(id, f);
            }
          });
        });

        const defs = Array.from(featureMap.values()).map((f: any) => ({
          id: Number(f.id),
          name: String(f.name ?? f.display_name ?? f.title ?? ""),
        }));

        if (!mounted) return;
        setFeatureDefinitions(defs);

        // Fetch possible values for the features
        if (defs.length > 0) {
          const perFeaturePromises = defs.map((fd: { id: number; name: string }) =>
            getPossibleFeatureValues({ feature: fd.id })
              .then((res) => ({ fid: fd.id, res }))
              .catch((err) => {
                console.warn(`Failed fetch for feature ${fd.id}`, err);
                return { fid: fd.id, res: null };
              }),
          );

          const perFeatureResults = await Promise.all(perFeaturePromises);
          const normalized: Record<number, string[]> = {};
          perFeatureResults.forEach(({ fid, res }) => {
            const values = normalizePossibleFeatureValues(res, fid);
            if (values.length > 0) normalized[fid] = values;
          });

          if (mounted) setPossibleFeatureValues(normalized);
        } else {
          setPossibleFeatureValues({});
        }
      } catch (e) {
        console.warn("Failed to fetch feature definitions for subcategories", e);
        if (mounted) {
          setFeatureDefinitions([]);
          setPossibleFeatureValues({});
        }
      } finally {
        if (mounted) setFeaturesLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [selectedSubcategoryIds]);

  // Use subcategories from API
  const currentSubcategories = subcategories;

  // Fetch possible values for feature definitions
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (featureDefinitions.length === 0) {
          setPossibleFeatureValues({});
          return;
        }

        const perFeaturePromises = featureDefinitions.map((fd) =>
          getPossibleFeatureValues({ feature: fd.id })
            .then((res) => ({ fid: fd.id, res }))
            .catch((err) => {
              console.warn(`Failed fetch for feature ${fd.id}`, err);
              return { fid: fd.id, res: null };
            }),
        );

        const perFeatureResults = await Promise.all(perFeaturePromises);

        const normalized: Record<number, string[]> = {};
        perFeatureResults.forEach(({ fid, res }) => {
          const values = normalizePossibleFeatureValues(res, fid);
          if (values.length > 0) normalized[fid] = values;
        });

        if (mounted) setPossibleFeatureValues(normalized);
      } catch (e) {
        console.warn("Failed to fetch possible feature values", e);
        if (mounted) setPossibleFeatureValues({});
      }
    })();

    return () => {
      mounted = false;
    };
  }, [featureDefinitions]);

  // Get regions and locations from the hook
  const { groupedLocations: regionsData } = useLocations();

  // Filter subcategories based on search
  const filteredSubcategories = useMemo(() => {
    if (!subcategorySearch.trim()) return currentSubcategories;
    const search = subcategorySearch.toLowerCase();
    return currentSubcategories.filter((sub) =>
      sub.name.toLowerCase().includes(search),
    );
  }, [currentSubcategories, subcategorySearch]);

  // Filter locations based on search
  const filteredLocations = useMemo(() => {
    if (!selectedRegion || !locationSearch.trim())
      return regionsData[selectedRegion || ""] || [];
    const search = locationSearch.toLowerCase();
    return (regionsData[selectedRegion] || []).filter((location) =>
      location.toLowerCase().includes(search),
    );
  }, [regionsData, selectedRegion, locationSearch]);

  const handleClearAll = () => {
    setCurrentPanel("main");
    setSelectedCategoryId(null);
    setSelectedLocation(null);
    setSelectedRegion(null);
    setSelectedLocationIds([]);
    setSelectedTimeframe("anytime");
    setTempSelectedAdType("all");
    setPriceSort("none");
    setTimeframeSort("none");
    setPriceFilter({ mode: "none" });
    setSelectedSubcategoryIds([]);
    setSelectedFeatures({});
    setTempPriceRange({ min: "", max: "" });
  };

  const handleViewAll = () => {
    // Apply selected locations to parent state
    if (selectedLocationIds.length > 0) {
      // Store as comma-separated string to maintain single selectedLocation prop
      setSelectedLocation(selectedLocationIds.join(","));
    } else {
      setSelectedLocation(null);
    }

    // Apply ad type filter
    if (setSelectedAdType) {
      setSelectedAdType(tempSelectedAdType);
    }

    // Apply price filter if set
    const minVal =
      typeof tempPriceRange.min === "number" ? tempPriceRange.min : 0;
    const maxVal =
      typeof tempPriceRange.max === "number" ? tempPriceRange.max : 1000000;
    if (minVal > 0 || maxVal < 1000000) {
      setPriceFilter({
        mode: "between",
        min: minVal,
        max: maxVal,
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
        className={`fixed bottom-15 left-0 right-0 bg-(--div-active) rounded-t-3xl z-999 sm:hidden max-h-[77.5vh] overflow-hidden flex flex-col transition-transform duration-400 ease-out ${
          isOpen
            ? "translate-y-0"
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

          {/* Dynamic header with back button or title */}
          {currentPanel === "main" ? (
            <span className="text-lg font-semibold text-gray-900 w-full text-left pl-2">
              Filter
            </span>
          ) : currentPanel === "categories" ? (
            <button
              onClick={() => setCurrentPanel("main")}
              className="flex items-center gap-2 text-gray-900 w-full text-left pl-2"
            >
              <img src="/arrowleft.svg" alt="<" className="w-5 h-5" />
              <span className="text-lg font-semibold">Category</span>
            </button>
          ) : currentPanel === "subcategories" ? (
            <button
              onClick={() => setCurrentPanel("main")}
              className="flex items-center gap-2 text-gray-900 w-full text-left pl-2"
            >
              <img src="/arrowleft.svg" alt="<" className="w-5 h-5" />
              <span className="text-lg font-semibold">
                {selectedCategoryName}
              </span>
            </button>
          ) : currentPanel === "regions" ? (
            <button
              onClick={() => setCurrentPanel("main")}
              className="flex items-center gap-2 text-gray-900 w-full text-left pl-2"
            >
              <img src="/arrowleft.svg" alt="<" className="w-5 h-5" />
              <span className="text-lg font-semibold">Select Region</span>
            </button>
          ) : currentPanel === "locations" && selectedRegion ? (
            <button
              onClick={() => setCurrentPanel("main")}
              className="flex items-center gap-2 text-gray-900 w-full text-left pl-2"
            >
              <img src="/arrowleft.svg" alt="<" className="w-5 h-5" />
              <span className="text-lg font-semibold">{selectedRegion}</span>
            </button>
          ) : null}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-20 pt-3">
          {/* Main Panel */}
          {currentPanel === "main" && (
            <div className="space-y-4">
              {/* Category & Location Section */}
              <div className="bg-white rounded-3xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Category
                  </span>
                  <button
                    onClick={() => setCurrentPanel("categories")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <span className="text-sm text-gray-800 truncate max-w-[120px]">
                      {selectedCategoryName}
                    </span>
                    <img
                      src="/arrowright.svg"
                      alt="open"
                      className="w-4 h-4 shrink-0"
                    />
                  </button>
                </div>
                <div className="border-t border-gray-200" />
                {/* Subcategories Section - Show if category selected */}
                {selectedCategoryId &&
                  (subcategoriesLoading ? (
                    <div>
                      <Loader className="h-10" />
                      <span className="text-sm text-gray-600">
                        Loading subcategories...
                      </span>
                    </div>
                  ) : currentSubcategories.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">
                          Subcategory
                        </span>
                        <button
                          onClick={() => setCurrentPanel("subcategories")}
                          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                          <span className="text-sm text-gray-800">
                            {selectedSubcategoryIds.length === 1
                              ? currentSubcategories.find(
                                  (sub) => sub.id === parseInt(selectedSubcategoryIds[0], 10)
                                )?.name || "Select Subcategory"
                              : selectedSubcategoryIds.length > 1
                                ? `${selectedSubcategoryIds.length} selected`
                                : "Select Subcategory"}
                          </span>
                          <img
                            src="/arrowright.svg"
                            alt="open"
                            className="w-4 h-4 shrink-0"
                          />
                        </button>
                      </div>
                      <div className="border-t border-gray-200" />
                    </div>
                  ) : null)}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Location
                  </span>
                  <button
                    onClick={() => setCurrentPanel("regions")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  >
                    <span className="text-sm text-gray-800">
                      {selectedLocationIds.length > 0
                        ? selectedLocationIds.some((id) =>
                            id.startsWith("All -"),
                          )
                          ? selectedLocationIds
                              .find((id) => id.startsWith("All -"))
                              ?.replace("All - ", "") || "Select Location"
                          : selectedLocationIds.length === 1
                            ? `${selectedLocationIds[0]}, ${selectedRegion || ""}`
                            : `${selectedLocationIds.length} places in ${selectedRegion || ""}`
                        : selectedRegion
                          ? selectedRegion
                          : "Select Location"}
                    </span>
                    <img
                      src="/arrowright.svg"
                      alt="open"
                      className="w-4 h-4 shrink-0"
                    />
                  </button>
                </div>
              </div>

              {/* Features Section - Show if subcategories selected and features exist */}
              {selectedSubcategoryIds.length > 0 &&
                featureDefinitions.length > 0 &&
                !featuresLoading && (
                  <div className="bg-white rounded-3xl p-4 space-y-3">
                    <button
                      onClick={() => setIsFeaturesExpanded(!isFeaturesExpanded)}
                      className="flex items-center justify-between w-full"
                    >
                      <h3 className="text-sm font-semibold text-gray-700">
                        Features
                      </h3>
                      <img
                        src="/arrowright.svg"
                        alt="toggle"
                        className={`w-4 h-4 shrink-0 transition-transform ${
                          isFeaturesExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                    {isFeaturesExpanded && (
                      <>
                        {featuresLoading ? (
                          <div className="text-center">
                            <span className="text-sm text-gray-600">
                              Loading features...
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {featureDefinitions.map((feature, idx) => (
                              <div key={feature.id}>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-gray-700">
                                    {feature.name}
                                  </span>
                                  <select
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
                                    className="text-sm text-right rounded-lg px-2 py-1 outline-0"
                                  >
                                    <option value="">Select</option>
                                    {(possibleFeatureValues[feature.id] || []).map(
                                      (value) => (
                                        <option key={value} value={value}>
                                          {value}
                                        </option>
                                      ),
                                    )}
                                  </select>
                                </div>
                                {idx < featureDefinitions.length - 1 && (
                                  <div className="border-t border-gray-200 mt-3" />
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

              {/* Ad Type & Timeframe Filter Section - Stacked */}
              <div className="bg-white rounded-3xl p-4 mb-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Ad Type
                  </span>
                  <select
                    value={tempSelectedAdType}
                    onChange={(e) =>
                      setTempSelectedAdType(
                        e.target.value as "all" | "SALE" | "RENT",
                      )
                    }
                    className="text-sm text-right rounded-lg px-2 py-1 outline-0"
                  >
                    <option value="all">All Types</option>
                    <option value="SALE">For Sale</option>
                    <option value="RENT">For Rent</option>
                  </select>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Timeframe
                  </span>
                  <select
                    value={selectedTimeframe}
                    onChange={(e) =>
                      setSelectedTimeframe(
                        e.target.value as
                          | "newest"
                          | "7days"
                          | "30days"
                          | "anytime",
                      )
                    }
                    className="text-sm text-right rounded-lg px-2 py-1 outline-0"
                  >
                    <option value="anytime">Anytime</option>
                    <option value="newest">Newest</option>
                    <option value="7days">Last 7 days</option>
                    <option value="30days">Last 30 days</option>
                  </select>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Price Range
                </h3>
                <div className="flex gap-2 items-center w-full overflow-hidden">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      placeholder="Min"
                      min="0"
                      value={tempPriceRange.min}
                      onChange={(e) =>
                        setTempPriceRange({
                          ...tempPriceRange,
                          min: e.target.value ? Number(e.target.value) : "",
                        })
                      }
                      className="min-w-0 w-full px-3 pl-6 py-2 border outline-0 border-gray-300 rounded-lg text-sm"
                    />
                    <p
                      className={`absolute left-2 top-1.5 ${!tempPriceRange?.min && "hidden"}`}
                    >
                      ₵
                    </p>
                  </div>
                  <span className="text-gray-400 font-light shrink-0">-</span>
                  <div className="relative flex-1 ">
                    <input
                      type="number"
                      placeholder="Max"
                      min="0"
                      value={tempPriceRange.max}
                      onChange={(e) =>
                        setTempPriceRange({
                          ...tempPriceRange,
                          max: e.target.value ? Number(e.target.value) : "",
                        })
                      }
                      className="min-w-0 w-full px-3 py-2 pl-6 border border-gray-300 rounded-lg text-sm"
                    />
                    <p
                      className={`absolute left-2 top-1.5 ${!tempPriceRange?.max && "hidden"}`}
                    >
                      ₵
                    </p>
                  </div>
                </div>
              </div>

              {/* Sorting Section */}
              <div className="bg-white rounded-3xl p-4 mb-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Sort by Price
                  </span>
                  <select
                    value={priceSort}
                    onChange={(e) =>
                      setPriceSort(
                        e.target.value as
                          | "none"
                          | "low-to-high"
                          | "high-to-low",
                      )
                    }
                    className="text-sm text-right rounded-lg outline-0 px-2 py-1"
                  >
                    <option value="none">None</option>
                    <option value="low-to-high">Low to High</option>
                    <option value="high-to-low">High to Low</option>
                  </select>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Sort by Date
                  </span>
                  <select
                    value={timeframeSort}
                    onChange={(e) =>
                      setTimeframeSort(
                        e.target.value as "none" | "newest" | "oldest",
                      )
                    }
                    className="text-sm text-right outline-0 rounded-lg px-2 py-1"
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
            <div className="w-screen -mx-4 flex flex-col">
              <div className="bg-white p-4">
                <div>
                  {categories.map((category, index) => (
                    <div key={category.id}>
                      <button
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          setCurrentPanel("subcategories");
                        }}
                        className="w-full flex items-center gap-3 p-3 transition hover:bg-gray-50"
                      >
                        <img
                          src={getCategoryIcon(category.name)}
                          alt={category.name}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                        <span className="flex-1 text-left text-gray-800 text-sm">
                          {category.name}
                        </span>
                        <img
                          src="/arrowright.svg"
                          alt="open"
                          className="w-4 h-4 shrink-0"
                        />
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
          {currentPanel === "subcategories" && (
            <div className="w-screen -mx-4 flex flex-col">
              <div className="bg-white p-4">
                {currentSubcategories.length > 0 ? (
                  <>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Select Subcategories
                    </h3>

                    {/* Search Bar */}
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Search subcategories..."
                        value={subcategorySearch}
                        onChange={(e) => setSubcategorySearch(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      {filteredSubcategories.length === 0 ? (
                        <div className="text-center py-8">
                          <span className="text-sm text-gray-600">
                            No subcategories found
                          </span>
                        </div>
                      ) : (
                        <>
                          {/* All Subcategories Option - only show when not searching */}
                          {!subcategorySearch.trim() && (
                            <>
                              <button
                                onClick={() => {
                                  const subIds = currentSubcategories.map((s) =>
                                    s.id.toString(),
                                  );
                                  const allSelected = subIds.every((id) =>
                                    selectedSubcategoryIds.includes(id),
                                  );
                                  if (allSelected) {
                                    setSelectedSubcategoryIds(
                                      selectedSubcategoryIds.filter(
                                        (id) => !subIds.includes(id),
                                      ),
                                    );
                                  } else {
                                    setSelectedSubcategoryIds([
                                      ...new Set([
                                        ...selectedSubcategoryIds,
                                        ...subIds,
                                      ]),
                                    ]);
                                  }
                                }}
                                className={`w-full flex items-center gap-3 p-3 transition ${
                                  currentSubcategories.length > 0 &&
                                  currentSubcategories
                                    .map((s) => s.id.toString())
                                    .every((id) =>
                                      selectedSubcategoryIds.includes(id),
                                    )
                                    ? "bg-blue-50"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    currentSubcategories.length > 0 &&
                                    currentSubcategories
                                      .map((s) => s.id.toString())
                                      .every((id) =>
                                        selectedSubcategoryIds.includes(id),
                                      )
                                  }
                                  onChange={() => {}}
                                  className="w-4 h-4 cursor-pointer"
                                />
                                <span className="text-gray-800 text-sm flex-1 text-left pl-4 font-semibold">
                                  All Subcategories
                                </span>
                              </button>
                              <div className="border-t border-gray-100 my-2" />
                            </>
                          )}

                          {filteredSubcategories.map((subcategory, index) => {
                            const subId = subcategory.id.toString();
                            return (
                              <div key={subcategory.id}>
                                <button
                                  onClick={() => {
                                    setSelectedSubcategoryIds(
                                      selectedSubcategoryIds.includes(subId)
                                        ? selectedSubcategoryIds.filter(
                                            (s) => s !== subId,
                                          )
                                        : [...selectedSubcategoryIds, subId],
                                    );
                                  }}
                                  className={`w-full flex items-center gap-3 p-3 transition ${
                                    selectedSubcategoryIds.includes(subId)
                                      ? "bg-blue-50"
                                      : "hover:bg-gray-50"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedSubcategoryIds.includes(
                                      subId,
                                    )}
                                    onChange={() => {}}
                                    className="w-4 h-4 cursor-pointer"
                                  />
                                  <span className="text-gray-800 text-sm flex-1 text-left pl-4">
                                    {subcategory.name}
                                  </span>
                                </button>
                                {index < filteredSubcategories.length - 1 && (
                                  <div className="border-t border-gray-100" />
                                )}
                              </div>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <img
                      src="/nothing-to-show.png"
                      alt="Nothing to show"
                      className="w-24 h-24 mb-3"
                    />
                    <span className="text-gray-600 text-sm">
                      Nothing to show
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Regions Panel */}
          {currentPanel === "regions" && (
            <div className="w-screen -mx-4 flex flex-col">
              <div className="bg-white p-4">
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
                        <img
                          src="/arrowright.svg"
                          alt="open"
                          className="w-4 h-4 shrink-0"
                        />
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
            <div className="w-screen -mx-4 flex flex-col">
              <div className="bg-white p-4">
                {/* Search Bar */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  {filteredLocations.length === 0 && locationSearch.trim() ? (
                    <div className="text-center py-8">
                      <span className="text-sm text-gray-600">
                        No locations found
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* All Locations Option - only show when not searching */}
                      {!locationSearch.trim() && (
                        <div>
                          <button
                            onClick={() => {
                              const allLocationsKey = `All - ${selectedRegion}`;
                              setSelectedLocationIds(
                                selectedLocationIds.includes(allLocationsKey)
                                  ? selectedLocationIds.filter(
                                      (id) =>
                                        id !== allLocationsKey &&
                                        !regionsData[selectedRegion]?.includes(
                                          id,
                                        ),
                                    )
                                  : [
                                      allLocationsKey,
                                      ...(regionsData[selectedRegion] || []),
                                    ],
                              );
                            }}
                            className={`w-full flex items-center gap-3 p-3 transition ${
                              selectedLocationIds.includes(
                                `All - ${selectedRegion}`,
                              )
                                ? "bg-blue-50"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedLocationIds.includes(
                                `All - ${selectedRegion}`,
                              )}
                              onChange={() => {}}
                              className="w-4 h-4 cursor-pointer"
                            />
                            <span className="text-gray-800 text-left pl-4 text-sm font-semibold flex-1">
                              All locations in {selectedRegion}
                            </span>
                          </button>
                          <div className="border-t border-gray-100" />
                        </div>
                      )}

                      {/* Individual Locations */}
                      {filteredLocations.map((location, index) => (
                        <div key={location}>
                          <button
                            onClick={() => {
                              setSelectedLocationIds(
                                selectedLocationIds.includes(location)
                                  ? selectedLocationIds.filter(
                                      (id) => id !== location,
                                    )
                                  : [...selectedLocationIds, location],
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
                            <span className="text-gray-800 text-left pl-4 text-sm flex-1">
                              {location}
                            </span>
                          </button>
                          {index < filteredLocations.length - 1 && (
                            <div className="border-t border-gray-100" />
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Always visible */}
        <div className="fixed bottom-0 left-0 right-0 p-4 flex gap-3 bg-white sm:hidden border-gray-200">
          <button
            onClick={handleClearAll}
            className="flex-1 py-3 bg-gray-100 text-gray-800 rounded-2xl font-medium hover:bg-gray-200 transition"
          >
            Clear all
          </button>
          <button
            onClick={handleViewAll}
            className="flex-1 py-3 bg-gray-900 text-white rounded-2xl font-medium hover:bg-gray-800 transition"
          >
            View all
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileFilterModal;

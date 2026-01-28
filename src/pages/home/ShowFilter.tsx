import { useEffect, useState } from "react";
import normalizePossibleFeatureValues from "../../hooks/normalizearrayfeatures";
import {
  getFeatures,
  getPossibleFeatureValues,
} from "../../services/featureService";
import { getSubcategories } from "../../services/subcategoryService";
import useLocations from "../../features/locations/useLocations";
import type { Category } from "../../types/Category";

type Props = {
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
  selectedSubcategoryId: number | "";
  setSelectedSubcategoryId: (id: number | "") => void;
  selectedFeatures: Record<number, string>;
  setSelectedFeatures: (features: Record<number, string>) => void;

  priceFilter: {
    mode: "none" | "below" | "above" | "between";
    below?: number;
    above?: number;
    min?: number;
    max?: number;
  };
  setPriceFilter: (p: any) => void;

  selectedLocation: string | null;
  setSelectedLocation: (v: string | null) => void;

  selectedTimeframe: "newest" | "7days" | "30days" | "anytime";
  setSelectedTimeframe: (v: "newest" | "7days" | "30days" | "anytime") => void;

  selectedAdType: "SALE" | "RENT" | "PAYLATER" | "all";
  setSelectedAdType: (v: "SALE" | "RENT" | "PAYLATER" | "all") => void;

  priceSort: "none" | "low-to-high" | "high-to-low";
  setPriceSort: (v: "none" | "low-to-high" | "high-to-low") => void;

  timeframeSort: "none" | "newest" | "oldest";
  setTimeframeSort: (v: "none" | "newest" | "oldest") => void;

  closeFilterPopup: () => void;
  categories: Category[];
  uniqueLocations: string[];
};

const ShowFilter = ({
  selectedCategoryId: propSelectedCategoryId,
  setSelectedCategoryId: propSetSelectedCategoryId,
  selectedSubcategoryId: propSelectedSubcategoryId,
  setSelectedSubcategoryId: propSetSelectedSubcategoryId,
  selectedFeatures: propSelectedFeatures,
  setSelectedFeatures: propSetSelectedFeatures,

  priceFilter,
  setPriceFilter,

  selectedLocation,
  setSelectedLocation,

  selectedTimeframe,
  setSelectedTimeframe,

  selectedAdType,
  setSelectedAdType,

  priceSort,
  setPriceSort,

  timeframeSort,
  setTimeframeSort,

  closeFilterPopup,
  categories,
}: Props) => {
  // Get locations from API hook
  const { groupedLocations: regionsData } = useLocations();

  // Local states for batch apply pattern
  const [localPriceMin, setLocalPriceMin] = useState<string>(
    priceFilter.mode === "above"
      ? priceFilter.above?.toString() || ""
      : priceFilter.mode === "between"
        ? priceFilter.min?.toString() || ""
        : "",
  );
  const [localPriceMax, setLocalPriceMax] = useState<string>(
    priceFilter.mode === "below"
      ? priceFilter.below?.toString() || ""
      : priceFilter.mode === "between"
        ? priceFilter.max?.toString() || ""
        : "",
  );
  const [localSelectedLocationIds, setLocalSelectedLocationIds] = useState<
    string[]
  >(selectedLocation ? selectedLocation.split(",") : []);
  const [localSelectedTimeframe, setLocalSelectedTimeframe] = useState<
    "newest" | "7days" | "30days" | "anytime"
  >(selectedTimeframe);
  const [localAdType, setLocalAdType] = useState<
    "SALE" | "RENT" | "PAYLATER" | "all"
  >(selectedAdType);
  const [localPriceSort, setLocalPriceSort] = useState<
    "none" | "low-to-high" | "high-to-low"
  >(priceSort);
  const [localTimeframeSort, setLocalTimeframeSort] = useState<
    "none" | "newest" | "oldest"
  >(timeframeSort);
  const [localSelectedCategoryId, setLocalSelectedCategoryId] = useState<
    number | null
  >(propSelectedCategoryId);
  const [localSelectedSubcategoryIds, setLocalSelectedSubcategoryIds] =
    useState<number[]>(
      propSelectedSubcategoryId ? [propSelectedSubcategoryId as number] : [],
    );
  const [localSelectedFeatures, setLocalSelectedFeatures] =
    useState<Record<number, string>>(propSelectedFeatures);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [showRegionSelector, setShowRegionSelector] = useState<boolean>(false);
  const [pendingRegionSwitch, setPendingRegionSwitch] = useState<string | null>(
    null,
  );
  const [pendingCategorySwitch, setPendingCategorySwitch] = useState<
    number | null
  >(null);
  const [showSubcategoryModal, setShowSubcategoryModal] =
    useState<boolean>(false);
  const [subcategorySearch, setSubcategorySearch] = useState<string>("");
  const [showFeaturesSection, setShowFeaturesSection] = useState<boolean>(true);

  // Subcategories and features state
  const [subcategories, setSubcategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [featureDefinitions, setFeatureDefinitions] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [possibleFeatureValues, setPossibleFeatureValues] = useState<
    Record<number, string[]>
  >({});

  // Fetch subcategories when category changes
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (
          typeof localSelectedCategoryId === "number" &&
          !isNaN(localSelectedCategoryId)
        ) {
          let subs = (await getSubcategories({
            category: localSelectedCategoryId,
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
      }
    })();
    return () => {
      mounted = false;
    };
  }, [localSelectedCategoryId]);

  // Fetch features when subcategories change
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        if (localSelectedSubcategoryIds.length > 0) {
          const allFeaturesMap = new Map<number, string>();

          for (const subId of localSelectedSubcategoryIds) {
            let features = (await getFeatures({ subcategory: subId })) as any;
            if (!mounted) return;
            if (
              !Array.isArray(features) &&
              features &&
              Array.isArray(features.results)
            )
              features = features.results;
            (features || []).forEach((f: any) => {
              allFeaturesMap.set(
                Number(f.id),
                String(f.name ?? f.display_name ?? f.title ?? ""),
              );
            });
          }

          const defs = Array.from(allFeaturesMap.entries()).map(
            ([id, name]) => ({ id, name }),
          );
          setFeatureDefinitions(defs);
        } else {
          setFeatureDefinitions([]);
        }
      } catch (e) {
        console.warn(
          "Failed to fetch feature definitions for subcategories",
          e,
        );
        if (mounted) setFeatureDefinitions([]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [localSelectedSubcategoryIds]);

  // Fetch possible feature values when feature definitions change
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const perFeaturePromises = (featureDefinitions || []).map((fd) =>
          getPossibleFeatureValues({ feature: fd.id })
            .then((res) => ({ fid: fd.id, res }))
            .catch(() => {
              return { fid: fd.id, res: null };
            }),
        );

        if (perFeaturePromises.length === 0) {
          if (mounted) setPossibleFeatureValues({});
          return;
        }

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

  const handleApplyFilters = () => {
    // Apply all local state changes to parent state at once
    propSetSelectedCategoryId(localSelectedCategoryId);
    propSetSelectedSubcategoryId(
      localSelectedSubcategoryIds.length > 0
        ? localSelectedSubcategoryIds[0]
        : "",
    );
    propSetSelectedFeatures(localSelectedFeatures);
    setSelectedLocation(
      localSelectedLocationIds.length > 0
        ? localSelectedLocationIds.join(",")
        : null,
    );
    setSelectedTimeframe(localSelectedTimeframe);
    setSelectedAdType(localAdType);
    setPriceSort(localPriceSort);
    setTimeframeSort(localTimeframeSort);

    if (localPriceMin && localPriceMax) {
      setPriceFilter({
        mode: "between",
        min: Number(localPriceMin),
        max: Number(localPriceMax),
      });
    } else if (localPriceMin) {
      setPriceFilter({ mode: "above", above: Number(localPriceMin) });
    } else if (localPriceMax) {
      setPriceFilter({ mode: "below", below: Number(localPriceMax) });
    } else {
      setPriceFilter({ mode: "none" });
    }

    closeFilterPopup();
  };

  const handleClearAllFilters = () => {
    setLocalSelectedCategoryId(null);
    setLocalSelectedSubcategoryIds([]);
    setLocalSelectedFeatures({});
    setLocalSelectedLocationIds([]);
    setSelectedRegion(null);
    setPendingRegionSwitch(null);
    setPendingCategorySwitch(null);
    setShowSubcategoryModal(false);
    setSubcategorySearch("");
    setLocalSelectedTimeframe("anytime");
    setLocalAdType("all");
    setLocalPriceSort("none");
    setLocalTimeframeSort("none");
    setLocalTimeframeSort("none");
    setLocalPriceMin("");
    setLocalPriceMax("");
  };

  return (
    <div className="fixed inset-0 bg-[#4c4a4ab8] flex items-center justify-center z-50 px-3 sm:px-0">
      <div className="relative pt-15 bg-white rounded-[30px] z-50 sm:rounded-[60px] w-[95vw] sm:w-[70vw] lg:w-[50vw] max-h-[90vh] overflow-y-auto no-scrollbar shadow-lg">
        <div className="absolute top-0 right-0 p-4 sm:p-6">
          <button onClick={closeFilterPopup} className="block mb-3">
            <svg
              width="55"
              height="55"
              viewBox="0 0 85 86"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.6479 60.2642L60.1816 17.9453L67.363 25.1631L24.8293 67.482L17.6479 60.2642ZM17.7371 25.0375L24.9549 17.8561L67.2738 60.3898L60.056 67.5712L17.7371 25.0375Z"
                fill="#374957"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6">
            Filter & Sort Ads
          </h2>

          {/* Category Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3H9V9H3V3ZM11 3H17V9H11V3ZM3 11H9V17H3V11ZM11 11H17V17H11V11Z"
                  fill="#374957"
                />
              </svg>
              Category
            </h3>
            <select
              value={localSelectedCategoryId || ""}
              onChange={(e) => {
                const val = e.target.value;
                const newCategoryId = val ? Number(val) : null;

                // Mark that user is switching categories if they had subcategories selected
                if (
                  localSelectedSubcategoryIds.length > 0 &&
                  newCategoryId !== localSelectedCategoryId
                ) {
                  setPendingCategorySwitch(localSelectedCategoryId);
                }

                setLocalSelectedCategoryId(newCategoryId);
                setLocalSelectedFeatures({});

                // Open subcategory modal if a category is selected
                if (newCategoryId !== null) {
                  setShowSubcategoryModal(true);
                }
              }}
              className="w-full p-2 sm:p-3 border border-(--div-border) rounded-lg text-sm sm:text-base"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Selector - Only show if category selected */}
          {localSelectedCategoryId !== null && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 5H16V7H4V5ZM6 10H14V12H6V10ZM8 15H12V17H8V15Z"
                    fill="#374957"
                  />
                </svg>
                Subcategory (Optional)
              </h3>
              <button
                onClick={() => setShowSubcategoryModal(true)}
                className="w-full p-2 sm:p-3 border border-(--div-border) rounded-lg text-sm sm:text-base text-left flex items-center justify-between bg-white hover:bg-gray-50"
              >
                <span
                  className={
                    localSelectedSubcategoryIds.length > 0
                      ? "text-gray-900"
                      : "text-gray-500"
                  }
                >
                  {localSelectedSubcategoryIds.length > 0
                    ? localSelectedSubcategoryIds.length === 1
                      ? subcategories.find(
                          (s) => s.id === localSelectedSubcategoryIds[0],
                        )?.name
                      : `${localSelectedSubcategoryIds.length} subcategories selected`
                    : localSelectedCategoryId !== null
                      ? "All Subcategories"
                      : "Select a Category First"}
                </span>
                <img
                  src="/arrowright.svg"
                  alt=">"
                  className="w-4 h-4 rotate-90"
                />
              </button>

              {/* Subcategory Modal */}
              {showSubcategoryModal && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  style={{ background: "transparent" }}
                >
                  <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-lg">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                      <h4 className="font-semibold text-gray-900">
                        {subcategories.length > 0
                          ? "Select Subcategories"
                          : "No Subcategories Available"}
                      </h4>
                    </div>

                    {subcategories.length > 0 ? (
                      <>
                        {/* Search bar */}
                        <div className="p-4 border-b border-gray-200">
                          <input
                            type="text"
                            placeholder="Search subcategories..."
                            value={subcategorySearch}
                            onChange={(e) =>
                              setSubcategorySearch(e.target.value)
                            }
                            className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>

                        {/* Subcategories list */}
                        <div className="flex-1 overflow-y-auto p-4">
                          <div className="flex flex-col gap-2">
                            {/* All subcategories option */}
                            <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded">
                              <input
                                type="checkbox"
                                checked={
                                  localSelectedSubcategoryIds.length === 0
                                }
                                onChange={() => {
                                  // Always set to empty array to represent "All"
                                  setLocalSelectedSubcategoryIds([]);
                                }}
                                className="cursor-pointer"
                              />
                              <span className="font-semibold text-sm">
                                All subcategories
                              </span>
                            </label>
                            {/* Individual subcategories filtered by search */}
                            {subcategories
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .filter((sub) =>
                                sub.name
                                  .toLowerCase()
                                  .includes(subcategorySearch.toLowerCase()),
                              )
                              .map((sub) => (
                                <label
                                  key={sub.id}
                                  className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded"
                                >
                                  <input
                                    type="checkbox"
                                    checked={localSelectedSubcategoryIds.includes(
                                      sub.id,
                                    )}
                                    onChange={() => {
                                      // If switching categories and user starts selecting, clear old selections
                                      if (
                                        pendingCategorySwitch &&
                                        pendingCategorySwitch !==
                                          localSelectedCategoryId
                                      ) {
                                        setLocalSelectedSubcategoryIds([
                                          sub.id,
                                        ]);
                                        setPendingCategorySwitch(null);
                                      } else {
                                        // Normal toggle within same category
                                        setLocalSelectedSubcategoryIds(
                                          localSelectedSubcategoryIds.includes(
                                            sub.id,
                                          )
                                            ? localSelectedSubcategoryIds.filter(
                                                (id) => id !== sub.id,
                                              )
                                            : [
                                                ...localSelectedSubcategoryIds,
                                                sub.id,
                                              ],
                                        );
                                      }
                                    }}
                                    className="cursor-pointer"
                                  />
                                  <span className="text-sm">{sub.name}</span>
                                </label>
                              ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex-1 flex items-center justify-center p-4">
                        <p className="text-gray-500 text-sm">
                          This category has no subcategories
                        </p>
                      </div>
                    )}

                    {/* Done button */}
                    <div className="p-4 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowSubcategoryModal(false);
                          setSubcategorySearch("");
                          setLocalSelectedFeatures({});
                        }}
                        className="w-full py-2 px-6 bg-(--dark-def) text-white rounded-lg font-medium hover:opacity-90 transition text-base"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Features Section - Only show if features exist for selected subcategory */}
          {featureDefinitions.length > 0 && (
            <div className="mb-8">
              <button
                onClick={() => setShowFeaturesSection(!showFeaturesSection)}
                className="w-full flex items-center gap-2 text-lg font-semibold mb-3 hover:opacity-70 transition"
              >
                <img
                  src="/circle-quarter-svgrepo-com.svg"
                  alt="Features"
                  className="h-5 w-5"
                />
                Features
                <img
                  src="/arrowright.svg"
                  alt="toggle"
                  className={`w-4 h-4 ml-auto transition-transform ${showFeaturesSection ? "rotate-90" : ""}`}
                />
              </button>
              {showFeaturesSection && (
                <div className="flex flex-col gap-3">
                  {featureDefinitions.map((fd) => {
                    const values = possibleFeatureValues[fd.id] ?? [];
                    return (
                      <div
                        key={`def-${fd.id}`}
                        className="grid grid-cols-1 sm:grid-cols-[auto,1fr] items-start gap-2 sm:gap-3 min-w-0"
                      >
                        <label className="text-sm sm:text-base font-medium text-gray-700 wrap-break-word sm:pr-2">
                          {fd.name}
                        </label>
                        <div className="w-full min-w-0">
                          <select
                            value={localSelectedFeatures[fd.id] ?? ""}
                            onChange={(e) =>
                              setLocalSelectedFeatures((prev) => ({
                                ...prev,
                                [fd.id]: e.target.value,
                              }))
                            }
                            className="w-full min-w-0 p-2 sm:p-3 border border-(--div-border) rounded-lg text-sm sm:text-base truncate"
                          >
                            <option value="">Select {fd.name}</option>
                            {values.map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Location Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <img src="/location.svg" alt="Location" className="w-5 h-5" />
              Location
            </h3>
            <button
              onClick={() => {
                // If already have selections, go directly to that region's places
                if (localSelectedLocationIds.length > 0) {
                  const currentRegion = Object.keys(regionsData).find((r) =>
                    (regionsData[r] || []).some((loc) =>
                      localSelectedLocationIds.includes(loc),
                    ),
                  );
                  if (currentRegion) {
                    setSelectedRegion(currentRegion);
                  }
                } else {
                  // Otherwise ask for region first
                  setShowRegionSelector(true);
                }
              }}
              className="w-full p-2 sm:p-3 border border-(--div-border) rounded-lg text-sm sm:text-base text-left flex items-center justify-between bg-white hover:bg-gray-50"
            >
              <span>
                {localSelectedLocationIds.length > 0
                  ? (() => {
                      const selectedRegion = Object.keys(regionsData).find(
                        (r) =>
                          (regionsData[r] || []).some((loc) =>
                            localSelectedLocationIds.includes(loc),
                          ),
                      );
                      const regionLocations = selectedRegion
                        ? regionsData[selectedRegion] || []
                        : [];
                      const allSelected =
                        regionLocations.length > 0 &&
                        regionLocations.every((loc) =>
                          localSelectedLocationIds.includes(loc),
                        );

                      if (allSelected) {
                        return selectedRegion;
                      } else if (localSelectedLocationIds.length === 1) {
                        return `${localSelectedLocationIds[0]}, ${selectedRegion}`;
                      } else {
                        return `${localSelectedLocationIds.length} places selected in ${selectedRegion}`;
                      }
                    })()
                  : "Select a Region"}
              </span>
              <img
                src="/arrowright.svg"
                alt=">"
                className="w-4 h-4 rotate-90"
              />
            </button>

            {/* Region Selector Modal */}
            {showRegionSelector && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: "transparent" }}
              >
                <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-lg">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900">
                      Select a Region
                    </h4>
                  </div>

                  {/* Regions list */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex flex-col gap-2">
                      {Object.keys(regionsData).map((region) => (
                        <button
                          key={region}
                          onClick={() => {
                            // Mark that user is switching regions, but don't clear selections yet
                            const currentRegion = Object.keys(regionsData).find(
                              (r) =>
                                (regionsData[r] || []).some((loc) =>
                                  localSelectedLocationIds.includes(loc),
                                ),
                            );
                            if (
                              currentRegion &&
                              currentRegion !== region &&
                              localSelectedLocationIds.length > 0
                            ) {
                              setPendingRegionSwitch(currentRegion);
                            }
                            setSelectedRegion(region);
                            setShowRegionSelector(false);
                          }}
                          className="text-left p-3 hover:bg-gray-100 rounded text-sm"
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Close button */}
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowRegionSelector(false)}
                      className="w-full py-2 px-6 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Location Selection Modal */}
            {selectedRegion && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: "transparent" }}
              >
                <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-lg">
                  {/* Header with back button */}
                  <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                    <button
                      onClick={() => {
                        // Going back without selecting - don't clear anything
                        setSelectedRegion(null);
                        setLocationSearch("");
                        setPendingRegionSwitch(null);
                        setShowRegionSelector(true);
                      }}
                      className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
                    >
                      <img
                        src="/arrowright.svg"
                        alt="<"
                        className="w-4 h-4 rotate-180"
                      />
                      {selectedRegion}
                    </button>
                  </div>

                  {/* Search bar */}
                  <div className="p-4 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Search locations..."
                      value={locationSearch}
                      onChange={(e) => {
                        setLocationSearch(e.target.value);
                        // If user is switching regions and starts interacting, clear old selections
                        if (
                          pendingRegionSwitch &&
                          pendingRegionSwitch !== selectedRegion
                        ) {
                          setLocalSelectedLocationIds([]);
                          setPendingRegionSwitch(null);
                        }
                      }}
                      className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* Locations list */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex flex-col gap-2">
                      {/* All locations option */}
                      <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded">
                        <input
                          type="checkbox"
                          checked={
                            (regionsData[selectedRegion] || []).length > 0 &&
                            (regionsData[selectedRegion] || []).every((loc) =>
                              localSelectedLocationIds.includes(loc),
                            )
                          }
                          onChange={() => {
                            // If switching regions and user starts selecting, clear old selections
                            if (
                              pendingRegionSwitch &&
                              pendingRegionSwitch !== selectedRegion
                            ) {
                              const regionLocations =
                                regionsData[selectedRegion] || [];
                              setLocalSelectedLocationIds(regionLocations);
                              setPendingRegionSwitch(null);
                            } else {
                              // Normal toggle within same region
                              const regionLocations =
                                regionsData[selectedRegion] || [];
                              const allSelected = regionLocations.every((loc) =>
                                localSelectedLocationIds.includes(loc),
                              );
                              if (allSelected) {
                                setLocalSelectedLocationIds([]);
                              } else {
                                setLocalSelectedLocationIds(regionLocations);
                              }
                            }
                          }}
                          className="cursor-pointer"
                        />
                        <span className="font-semibold text-sm">
                          All locations
                        </span>
                      </label>
                      {/* Individual locations filtered by search */}
                      {(regionsData[selectedRegion] || [])
                        .sort()
                        .filter((location) =>
                          location
                            .toLowerCase()
                            .includes(locationSearch.toLowerCase()),
                        )
                        .map((location) => {
                          return (
                            <label
                              key={location}
                              className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded"
                            >
                              <input
                                type="checkbox"
                                checked={localSelectedLocationIds.includes(
                                  location,
                                )}
                                onChange={() => {
                                  // If switching regions and user starts selecting, clear old selections
                                  if (
                                    pendingRegionSwitch &&
                                    pendingRegionSwitch !== selectedRegion
                                  ) {
                                    setLocalSelectedLocationIds([location]);
                                    setPendingRegionSwitch(null);
                                  } else {
                                    // Normal toggle within same region
                                    setLocalSelectedLocationIds(
                                      localSelectedLocationIds.includes(
                                        location,
                                      )
                                        ? localSelectedLocationIds.filter(
                                            (id) => id !== location,
                                          )
                                        : [
                                            ...localSelectedLocationIds,
                                            location,
                                          ],
                                    );
                                  }
                                }}
                                className="cursor-pointer"
                              />
                              <span className="text-sm">{location}</span>
                            </label>
                          );
                        })}
                    </div>
                  </div>

                  {/* Done button */}
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setSelectedRegion(null);
                        setLocationSearch("");
                        setPendingRegionSwitch(null);
                      }}
                      className="w-full py-2 px-6 bg-(--dark-def) text-white rounded-lg font-medium hover:opacity-90 transition text-base"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ad Type Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <img
                src="/boxes-svgrepo-com.svg"
                alt="Ad Type"
                className="w-5 h-5"
              />
              Ad Type
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all" as const, label: "All Types" },
                { value: "SALE" as const, label: "For Sale" },
                { value: "RENT" as const, label: "For Rent" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLocalAdType(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm sm:text-base transition-colors ${
                    localAdType === option.value
                      ? "bg-(--dark-def) text-white"
                      : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeframe Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <img
                src="/time-svgrepo-com.svg"
                alt="Timeframe"
                className="w-5 h-5"
              />
              Timeframe
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "newest" as const, label: "Newest (24h)" },
                { value: "7days" as const, label: "Last 7 days" },
                { value: "30days" as const, label: "Last 30 days" },
                { value: "anytime" as const, label: "Anytime" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLocalSelectedTimeframe(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm sm:text-base transition-colors ${
                    localSelectedTimeframe === option.value
                      ? "bg-(--dark-def) text-white"
                      : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Sort Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <img
                src="/price-tag-svgrepo-com.svg"
                alt="Price Sort"
                className="w-5 h-5"
              />
              Sort by Price
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "none" as const, label: "No Sort" },
                { value: "low-to-high" as const, label: "Low to High" },
                { value: "high-to-low" as const, label: "High to Low" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLocalPriceSort(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm sm:text-base transition-colors ${
                    localPriceSort === option.value
                      ? "bg-(--dark-def) text-white"
                      : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Timeframe Sort Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <img
                src="/date-range-svgrepo-com.svg"
                alt="Timeframe Sort"
                className="w-5 h-5"
              />
              Sort by Date
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "none" as const, label: "No Sort" },
                { value: "newest" as const, label: "Newest First" },
                { value: "oldest" as const, label: "Oldest First" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLocalTimeframeSort(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm sm:text-base transition-colors ${
                    localTimeframeSort === option.value
                      ? "bg-(--dark-def) text-white"
                      : "bg-gray-100 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <img
                src="/filter-svgrepo.svg"
                alt="Price Filter"
                className="w-5 h-5"
              />
              Filter by Price
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                {localPriceMin && (
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg font-medium pointer-events-none">
                    ₵
                  </span>
                )}
                <input
                  type="number"
                  placeholder="Min"
                  value={localPriceMin}
                  onChange={(e) => setLocalPriceMin(e.target.value)}
                  className="w-full p-3 sm:p-4 border border-(--div-border) rounded-lg text-base sm:text-lg"
                  style={{ paddingLeft: localPriceMin ? "1.75rem" : "1rem" }}
                />
              </div>
              <span className="text-gray-400 text-2xl">-</span>
              <div className="flex-1 relative">
                {localPriceMax && (
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg font-medium pointer-events-none">
                    ₵
                  </span>
                )}
                <input
                  type="number"
                  placeholder="Max"
                  value={localPriceMax}
                  onChange={(e) => setLocalPriceMax(e.target.value)}
                  className="w-full p-3 sm:p-4 border border-(--div-border) rounded-lg text-base sm:text-lg"
                  style={{ paddingLeft: localPriceMax ? "1.75rem" : "1rem" }}
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center mt-8 pb-4">
            <button
              onClick={handleClearAllFilters}
              className="px-6 sm:px-10 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 text-sm sm:text-base font-medium"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-6 sm:px-10 py-3 bg-(--dark-def) text-white rounded-lg hover:bg-gray-800 text-sm sm:text-base font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowFilter;

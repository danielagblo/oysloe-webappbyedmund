import { useEffect, useState } from "react";
import normalizePossibleFeatureValues from "../../hooks/normalizearrayfeatures";
import { getFeatures, getPossibleFeatureValues } from "../../services/featureService";
import { getSubcategories } from "../../services/subcategoryService";
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

    priceSort,
    setPriceSort,

    timeframeSort,
    setTimeframeSort,

    closeFilterPopup,
    categories,
    uniqueLocations,
}: Props) => {
    // Local states for batch apply pattern
    const [localPriceMin, setLocalPriceMin] = useState<string>(priceFilter.min?.toString() || "");
    const [localPriceMax, setLocalPriceMax] = useState<string>(priceFilter.max?.toString() || "");
    const [localPriceBelow, setLocalPriceBelow] = useState<string>(priceFilter.below?.toString() || "");
    const [localPriceAbove, setLocalPriceAbove] = useState<string>(priceFilter.above?.toString() || "");
    const [localPriceMode, setLocalPriceMode] = useState<"none" | "below" | "above" | "between">(priceFilter.mode);
    const [localSelectedLocation, setLocalSelectedLocation] = useState<string | null>(selectedLocation);
    const [localSelectedTimeframe, setLocalSelectedTimeframe] = useState<"newest" | "7days" | "30days" | "anytime">(selectedTimeframe);
    const [localPriceSort, setLocalPriceSort] = useState<"none" | "low-to-high" | "high-to-low">(priceSort);
    const [localTimeframeSort, setLocalTimeframeSort] = useState<"none" | "newest" | "oldest">(timeframeSort);
    const [localSelectedCategoryId, setLocalSelectedCategoryId] = useState<number | null>(propSelectedCategoryId);
    const [localSelectedSubcategoryId, setLocalSelectedSubcategoryId] = useState<number | "">(propSelectedSubcategoryId);
    const [localSelectedFeatures, setLocalSelectedFeatures] = useState<Record<number, string>>(propSelectedFeatures);

    // Subcategories and features state
    const [subcategories, setSubcategories] = useState<Array<{ id: number; name: string }>>([]);
    const [featureDefinitions, setFeatureDefinitions] = useState<Array<{ id: number; name: string }>>([]);
    const [possibleFeatureValues, setPossibleFeatureValues] = useState<Record<number, string[]>>({});

    // Fetch subcategories when category changes
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                if (typeof localSelectedCategoryId === "number" && !isNaN(localSelectedCategoryId)) {
                    let subs = await getSubcategories({ category: localSelectedCategoryId }) as any;
                    if (!mounted) return;
                    if (!Array.isArray(subs) && subs && Array.isArray(subs.results)) subs = subs.results;
                    const mapped = (subs || []).map((s: any) => ({ id: s.id, name: s.name ?? s.title ?? s.display_name ?? s.label ?? "" }));
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

    // Fetch features when subcategory changes
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                if (typeof localSelectedSubcategoryId === "number" && !isNaN(localSelectedSubcategoryId)) {
                    let features = await getFeatures({ subcategory: localSelectedSubcategoryId }) as any;
                    if (!mounted) return;
                    if (!Array.isArray(features) && features && Array.isArray(features.results)) features = features.results;
                    const defs = (features || []).map((f: any) => ({ id: Number(f.id), name: String(f.name ?? f.display_name ?? f.title ?? "") }));
                    setFeatureDefinitions(defs);
                } else {
                    setFeatureDefinitions([]);
                }
            } catch (e) {
                console.warn("Failed to fetch feature definitions for subcategory", e);
                if (mounted) setFeatureDefinitions([]);
            }
        })();

        return () => { mounted = false };
    }, [localSelectedSubcategoryId]);

    // Fetch possible feature values when feature definitions change
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                const perFeaturePromises = (featureDefinitions || []).map((fd) =>
                    getPossibleFeatureValues({ feature: fd.id })
                        .then((res) => ({ fid: fd.id, res }))
                        .catch(() => {
                            return ({ fid: fd.id, res: null });
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
        propSetSelectedSubcategoryId(localSelectedSubcategoryId);
        propSetSelectedFeatures(localSelectedFeatures);
        setSelectedLocation(localSelectedLocation);
        setSelectedTimeframe(localSelectedTimeframe);
        setPriceSort(localPriceSort);
        setTimeframeSort(localTimeframeSort);

        if (localPriceMode === "below" && localPriceBelow) {
            setPriceFilter({ mode: "below", below: Number(localPriceBelow) });
        } else if (localPriceMode === "above" && localPriceAbove) {
            setPriceFilter({ mode: "above", above: Number(localPriceAbove) });
        } else if (localPriceMode === "between" && localPriceMin && localPriceMax) {
            setPriceFilter({ mode: "between", min: Number(localPriceMin), max: Number(localPriceMax) });
        } else {
            setPriceFilter({ mode: "none" });
        }

        closeFilterPopup();
    };

    const handleClearAllFilters = () => {
        setLocalSelectedCategoryId(null);
        setLocalSelectedSubcategoryId("");
        setLocalSelectedFeatures({});
        setLocalSelectedLocation(null);
        setLocalSelectedTimeframe("anytime");
        setLocalPriceSort("none");
        setLocalTimeframeSort("none");
        setLocalPriceMode("none");
        setLocalPriceMin("");
        setLocalPriceMax("");
        setLocalPriceBelow("");
        setLocalPriceAbove("");
    };

    return (
        <div className="fixed inset-0 bg-[#4c4a4ab8] flex items-center justify-center z-50 px-3 sm:px-0">
            <div className="relative pt-15 bg-white rounded-[30px] sm:rounded-[60px] w-[95vw] sm:w-[70vw] md:w-[50vw] max-h-[90vh] overflow-y-auto no-scrollbar shadow-lg">

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
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Filter & Sort Ads</h2>

                    {/* Category Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 3H9V9H3V3ZM11 3H17V9H11V3ZM3 11H9V17H3V11ZM11 11H17V17H11V11Z" fill="#374957" />
                            </svg>
                            Category
                        </h3>
                        <select
                            value={localSelectedCategoryId || ""}
                            onChange={(e) => {
                                const val = e.target.value;
                                setLocalSelectedCategoryId(val ? Number(val) : null);
                                setLocalSelectedSubcategoryId("");
                                setLocalSelectedFeatures({});
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

                    {/* Subcategory Section - Only show if category selected */}
                    {localSelectedCategoryId !== null && subcategories.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 5H16V7H4V5ZM6 10H14V12H6V10ZM8 15H12V17H8V15Z" fill="#374957" />
                                </svg>
                                Subcategory (Optional)
                            </h3>
                            <select
                                value={localSelectedSubcategoryId || ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setLocalSelectedSubcategoryId(val ? Number(val) : "");
                                    setLocalSelectedFeatures({});
                                }}
                                className="w-full p-2 sm:p-3 border border-(--div-border) rounded-lg text-sm sm:text-base"
                            >
                                <option value="">All Subcategories</option>
                                {subcategories.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Features Section - Only show if features exist for selected subcategory */}
                    {featureDefinitions.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <img src="/circle-quarter-svgrepo-com.svg" alt="Features" className="h-5 w-5" />
                                Features
                            </h3>
                            <div className="flex flex-col gap-2">
                                {featureDefinitions.map((fd) => {
                                    const values = possibleFeatureValues[fd.id] ?? [];
                                    return (
                                        <div key={`def-${fd.id}`} className="flex items-center gap-2">
                                            <div className="w-1/3 text-sm font-medium">{fd.name}</div>
                                            {values && values.length > 0 ? (
                                                <div className="flex-1">
                                                    <input
                                                        list={`feature-values-${fd.id}`}
                                                        placeholder={`Select ${fd.name}`}
                                                        value={localSelectedFeatures[fd.id] ?? ""}
                                                        onChange={(e) => setLocalSelectedFeatures((prev) => ({ ...prev, [fd.id]: e.target.value }))}
                                                        className="w-full p-2 border rounded-lg border-(--div-border) text-sm"
                                                    />
                                                    <datalist id={`feature-values-${fd.id}`}>
                                                        {values.map((v) => (
                                                            <option key={v} value={v} />
                                                        ))}
                                                    </datalist>
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    placeholder={`Value for ${fd.name}`}
                                                    value={localSelectedFeatures[fd.id] ?? ""}
                                                    onChange={(e) => setLocalSelectedFeatures((prev) => ({ ...prev, [fd.id]: e.target.value }))}
                                                    className="flex-1 p-2 border rounded-lg border-(--div-border) text-sm"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Location Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <img src="/location.svg" alt="Location" className="w-5 h-5" />
                            Location
                        </h3>
                        <select
                            value={localSelectedLocation || ""}
                            onChange={(e) => setLocalSelectedLocation(e.target.value || null)}
                            className="w-full p-2 sm:p-3 border border-(--div-border) rounded-lg text-sm sm:text-base"
                        >
                            <option value="">All Locations</option>
                            {uniqueLocations.map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Timeframe Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <img src="/time-svgrepo-com.svg" alt="Timeframe" className="w-5 h-5" />
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
                                    className={`px-4 py-2 rounded-lg text-sm sm:text-base transition-colors ${localSelectedTimeframe === option.value
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
                            <img src="/price-tag-svgrepo-com.svg" alt="Price Sort" className="w-5 h-5" />
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
                                    className={`px-4 py-2 rounded-lg text-sm sm:text-base transition-colors ${localPriceSort === option.value
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
                            <img src="/date-range-svgrepo-com.svg" alt="Timeframe Sort" className="w-5 h-5" />
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
                                    className={`px-4 py-2 rounded-lg text-sm sm:text-base transition-colors ${localTimeframeSort === option.value
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
                            <img src="/filter-svgrepo.svg" alt="Price Filter" className="w-5 h-5" />
                            Filter by Price
                        </h3><div className="space-y-3">
                            {[
                                { value: "none" as const, label: "No Filter" },
                                { value: "below" as const, label: "Below a certain price" },
                                { value: "above" as const, label: "Above a certain price" },
                                { value: "between" as const, label: "Between two prices" },
                            ].map((option) => (
                                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="price-filter"
                                        checked={localPriceMode === option.value}
                                        onChange={() => setLocalPriceMode(option.value)}
                                        className="w-4 h-4 focus:ring-(--dark-def)"
                                    />
                                    <span className="text-sm sm:text-base">{option.label}</span>
                                </label>
                            ))}
                        </div>

                        {/* Price input fields */}
                        {localPriceMode === "below" && (
                            <div className="mt-3">
                                <input
                                    type="number"
                                    placeholder="Max price"
                                    value={localPriceBelow}
                                    onChange={(e) => setLocalPriceBelow(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                        )}

                        {localPriceMode === "above" && (
                            <div className="mt-3">
                                <input
                                    type="number"
                                    placeholder="Min price"
                                    value={localPriceAbove}
                                    onChange={(e) => setLocalPriceAbove(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                        )}

                        {localPriceMode === "between" && (
                            <div className="mt-3 space-y-2">
                                <input
                                    type="number"
                                    placeholder="Min price"
                                    value={localPriceMin}
                                    onChange={(e) => setLocalPriceMin(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Max price"
                                    value={localPriceMax}
                                    onChange={(e) => setLocalPriceMax(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                        )}
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

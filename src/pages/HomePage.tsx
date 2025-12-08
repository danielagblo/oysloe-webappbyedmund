import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import MenuButton from "../components/MenuButton";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import "../App.css";

import useCategories from "../features/categories/useCategories";
import { useProducts } from "../features/products/useProducts";
import normalizePossibleFeatureValues from "../hooks/normalizearrayfeatures";
import { getFeatures, getPossibleFeatureValues } from "../services/featureService";
import { getSubcategories } from "../services/subcategoryService";
import type { Category } from "../types/Category";
import type { Product } from "../types/Product";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AdLoadingOverlay from "../components/AdLoadingOverlay";
import Loader from "../components/LoadingDots";
import { formatCount } from "../utils/formatCount";
import { formatMoney } from "../utils/formatMoney";

type HomePageHeaderProps = {
  searchValue: string;
  setSearchValue: (v: string) => void;
};

// Hook to manage dynamic scroll fade effect
const useScrollFade = (containerId: string) => {
  const [maskStyle, setMaskStyle] = useState<string>(
    "linear-gradient(to right, black 100%)"
  );

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const updateMask = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;

      // Check if content is scrollable
      if (maxScroll <= 0) {
        setMaskStyle("linear-gradient(to right, black 100%)");
        return;
      }

      const atStart = scrollLeft <= 5;
      const atEnd = scrollLeft >= maxScroll - 5;

      let gradient = "";
      if (atStart && !atEnd) {
        // Only fade on right
        gradient = "linear-gradient(to right, black 0%, black 92%, transparent 100%)";
      } else if (atEnd && !atStart) {
        // Only fade on left
        gradient = "linear-gradient(to right, transparent 0%, black 8%, black 100%)";
      } else if (!atStart && !atEnd) {
        // Fade on both sides
        gradient = "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)";
      } else {
        // No fade needed (shouldn't happen but safety)
        gradient = "linear-gradient(to right, black 100%)";
      }

      setMaskStyle(gradient);
    };

    // Initial check
    updateMask();

    // Listen to scroll events
    container.addEventListener("scroll", updateMask, { passive: true });
    // Also update on resize in case content changes
    window.addEventListener("resize", updateMask, { passive: true });

    return () => {
      container.removeEventListener("scroll", updateMask);
      window.removeEventListener("resize", updateMask);
    };
  }, [containerId]);

  return maskStyle;
};

export const HomePageHeader = ({
  searchValue,
  setSearchValue,
}: HomePageHeaderProps) => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isCondensed, setIsCondensed] = useState(false);

  // check screen size
  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth <= 640);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  // detect scroll to toggle condensed mode
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsCondensed(scrollTop > 50); // triggers once you scroll down a bit
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={headerRef}
      className={`w-full left-0 z-40 transition-all duration-300 ${isSmallScreen && isCondensed
        ? "fixed top-0 bg-white/90 backdrop-blur-sm shadow-sm"
        : "relative"
        }`}
    >
      <div
        className={`flex items-center max-sm:mt-7.5 transition-all duration-300 ${isSmallScreen && isCondensed
          ? "justify-between px-4 py-2 gap-3"
          : "flex-col items-center justify-center gap-8 mt-30"
          }`}
      >
        <h2
          className={`${isSmallScreen && isCondensed ? "text-lg" : "text-4xl sm:text-[4vw]"
            } font-medium text-(--dark-def) whitespace-nowrap`}
        >
          Oysloe
        </h2>

        <div className="flex w-full px-200">
          <div
            className={`relative flex items-center ${isSmallScreen && isCondensed
              ? "justify-end flex-1"
              : "justify-center w-full max-w-[520px]"
              }`}
          >
            <div className="rotating-bg" aria-hidden="true" />
            <div className="rotating-bg-inner" aria-hidden="true" />

            <div className="relative flex">
              <input
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search anything up for good"
                className={`search-input ${isSmallScreen && isCondensed
                  ? "text-[16px]"
                  : "text-2xl sm:text-2xl"
                  } px-4 py-3 h-12 sm:h-14 max-w-[70vw] rounded-full outline-0 bg-white text-center`}
              />

              <img
                src="/search.svg"
                className="absolute flex top-3.5 md:top-4.5 -left-3 max-md:left-2.5 w-5 h-5 z-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const [isAdLoading, setIsAdLoading] = useState(false);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"newest" | "7days" | "30days" | "anytime">("anytime");
  const [priceSort, setPriceSort] = useState<"none" | "low-to-high" | "high-to-low">("none");
  const [timeframeSort, setTimeframeSort] = useState<"none" | "newest" | "oldest">("none");
  const [priceFilter, setPriceFilter] = useState<{
    mode: "none" | "below" | "above" | "between";
    below?: number;
    above?: number;
    min?: number;
    max?: number;
  }>({ mode: "none" });
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | "">("");
  const [selectedFeatures, setSelectedFeatures] = useState<Record<number, string>>({});

  const handleAdClick = async (ad: Product, e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdLoading(true);
    // Small delay to ensure overlay renders
    await new Promise(resolve => setTimeout(resolve, 100));
    navigate(`/ads/${ad.id}`, { state: { adData: ad } });
    // Reset after navigation (component will unmount but just in case)
    setTimeout(() => setIsAdLoading(false), 500);
  };

  const handleCategoryClick = (name: string) => {
    const category = categories.find((c) => c.name === name) || null;
    setSelectedCategory(category);
  };
  const handleFilterSettings = () => setShowFilterPopup(true);
  const closeFilterPopup = () => setShowFilterPopup(false);

  if (categoriesError)
    console.error("Failed to load categories:", categoriesError);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // debounce searchTerm -> debouncedSearch
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const { data: products = [], isLoading: productsLoading } = useProducts({
    search: debouncedSearch || undefined,
  });

  const categoriesWithCounts = categories.map((cat) => {
    const count = products.filter((p) => p.category === cat.id).length;
    return {
      ...cat,
      adsCount: count,
    };
  });

  const totalProducts = products.length;

  const productsByCategory = categories.reduce(
    (acc, category) => {
      const categoryProducts =
        products?.filter((p) => p.category === category.id) || [];

      if (categoryProducts.length > 0) {
        acc[category.id] = categoryProducts;
      } else {
        acc[category.id] = [];
      }
      return acc;
    },
    {} as Record<number, Product[]>,
  );

  /* API BIT ENDS HERE */
  if (categoriesLoading) console.log("Loading up categories...");

  // Filter utility functions
  const applyFilters = (productsToFilter: Product[]) => {
    let filtered = [...productsToFilter];

    // Apply category filter
    if (selectedCategoryId !== null) {
      filtered = filtered.filter((p) => p.category === selectedCategoryId);
    }

    // Apply subcategory filter
    if (selectedSubcategoryId !== null && selectedSubcategoryId !== "") {
      filtered = filtered.filter((p) => {
        // Check if product has product_features with matching subcategory
        return p.product_features?.some((pf: any) => pf.feature?.subcategory === selectedSubcategoryId);
      });
    }

    // Apply features filter
    if (Object.keys(selectedFeatures).length > 0) {
      filtered = filtered.filter((p) => {
        // All selected features must be present in the product with matching values
        return Object.entries(selectedFeatures).every(([featureId, featureValue]) => {
          const fId = Number(featureId);
          return p.product_features?.some((pf: any) => pf.feature?.id === fId && pf.value === featureValue);
        });
      });
    }

    // Apply location filter
    if (selectedLocation) {
      filtered = filtered.filter(
        (p) => p.location?.name === selectedLocation || p.location?.region === selectedLocation
      );
    }

    // Apply timeframe filter
    if (selectedTimeframe !== "anytime") {
      const filterDate = new Date();

      if (selectedTimeframe === "7days") {
        filterDate.setDate(filterDate.getDate() - 7);
      } else if (selectedTimeframe === "30days") {
        filterDate.setDate(filterDate.getDate() - 30);
      } else if (selectedTimeframe === "newest") {
        filterDate.setDate(filterDate.getDate() - 1); // Last 24 hours
      }

      filtered = filtered.filter((p) => {
        if (!p.created_at) return true; // If no created_at, include the product
        try {
          const productDate = new Date(p.created_at);
          return productDate >= filterDate;
        } catch {
          return true; // If date parsing fails, include the product
        }
      });
    }

    // Apply price filter
    if (priceFilter.mode !== "none") {
      filtered = filtered.filter((p) => {
        const price = typeof p.price === "number" ? p.price : Number(p.price) || 0;
        if (priceFilter.mode === "below" && priceFilter.below !== undefined) {
          return price <= priceFilter.below;
        }
        if (priceFilter.mode === "above" && priceFilter.above !== undefined) {
          return price >= priceFilter.above;
        }
        if (priceFilter.mode === "between" && priceFilter.min !== undefined && priceFilter.max !== undefined) {
          return price >= priceFilter.min && price <= priceFilter.max;
        }
        return true;
      });
    }

    // Apply price sort
    if (priceSort === "low-to-high") {
      filtered.sort((a, b) => {
        const priceA = typeof a.price === "number" ? a.price : Number(a.price) || 0;
        const priceB = typeof b.price === "number" ? b.price : Number(b.price) || 0;
        return priceA - priceB;
      });
    } else if (priceSort === "high-to-low") {
      filtered.sort((a, b) => {
        const priceA = typeof a.price === "number" ? a.price : Number(a.price) || 0;
        const priceB = typeof b.price === "number" ? b.price : Number(b.price) || 0;
        return priceB - priceA;
      });
    }

    // Apply timeframe sort
    if (timeframeSort === "newest") {
      filtered.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA; // Newest first
      });
    } else if (timeframeSort === "oldest") {
      filtered.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB; // Oldest first
      });
    }

    return filtered;
  };

  // Get all unique locations from products
  const uniqueLocations = Array.from(
    new Set(
      products
        .flatMap((p) => [p.location?.name, p.location?.region])
        .filter((loc): loc is string => !!loc)
    )
  ).sort();

  const handleArrowClick = (
    direction: "left" | "right",
    id: string | number,
  ) => {
    const container = document.querySelector(
      `#move-${id}`,
    ) as HTMLElement | null;
    if (container) {
      const scrollAmount = container.clientWidth;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleBackToHome = () => setSelectedCategory(null);

  // Header condensed state for small screens: when true the header becomes fixed and inline
  const [isCondensed, setIsCondensed] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // detect small screen (Tailwind sm is 640px min, so small screens are <640)
    const mq = window.matchMedia("(max-width:639px)");
    const setMatch = (e?: MediaQueryListEvent) => {
      setIsSmallScreen(e ? e.matches : mq.matches);
      // reset condensed when leaving small screen
      if (e && !e.matches) setIsCondensed(false);
    };
    setMatch();

    // modern API
    mq.addEventListener("change", setMatch);
    return () => mq.removeEventListener("change", setMatch);
  }, []);

  useEffect(() => {
    if (!isSmallScreen) {
      setIsCondensed(false);
      document.body.style.paddingTop = "";
      return;
    }

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // if scrolling down and past a small threshold, condense
      if (delta > 5 && currentY > 40) {
        if (!isCondensed) setIsCondensed(true);
      } else if (delta < -5) {
        // scrolling up — expand
        if (isCondensed) setIsCondensed(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isSmallScreen, isCondensed]);

  // Manage body padding to avoid layout jump when header becomes fixed
  useEffect(() => {
    if (isCondensed && headerRef.current && isSmallScreen) {
      const h = headerRef.current.getBoundingClientRect().height;
      document.body.style.paddingTop = `${h}px`;
    } else {
      document.body.style.paddingTop = "";
    }
  }, [isCondensed, isSmallScreen]);

  const ShowFilter = ({
    selectedCategoryId: propSelectedCategoryId,
    setSelectedCategoryId: propSetSelectedCategoryId,
    selectedSubcategoryId: propSelectedSubcategoryId,
    setSelectedSubcategoryId: propSetSelectedSubcategoryId,
    selectedFeatures: propSelectedFeatures,
    setSelectedFeatures: propSetSelectedFeatures,
  }: {
    selectedCategoryId: number | null;
    setSelectedCategoryId: (id: number | null) => void;
    selectedSubcategoryId: number | "";
    setSelectedSubcategoryId: (id: number | "") => void;
    selectedFeatures: Record<number, string>;
    setSelectedFeatures: (features: Record<number, string>) => void;
  }) => {
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
              .catch((err) => {
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

  const SelectACategory = ({
    categories,
    onCategoryClick,
  }: {
    categories: Category[];
    onCategoryClick: (name: string) => void;
  }) => {
    if (categoriesLoading) {

      return (
        <div className="w-[94vw] sm:max-w-[98vw] mt-3 mx-auto sm:flex sm:justify-center">
          <div
            className="grid grid-cols-5 gap-2 sm:gap-4 place-items-center justify-items-center max-w-full w-full sm:max-w-4/5 max-sm:flex max-sm:flex-wrap max-sm:w-screen max-sm:items-center max-sm:justify-center"
            style={{ gridAutoRows: "1fr" }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="
                  flex flex-col items-center justify-center
                  w-[12vw] h-[12vw] min-h-[75px] min-w-[75px]
                  bg-gray-200 rounded-lg 
                  p-0 sm:p-3 cursor-progress animate-pulse
                  max-sm:w-[20vw] max-sm:h-[20vw]
                  max-sm:min-w-[75px] max-sm:min-h-[75px]
                "
              >
                <div className="w-[8vw] h-[8vw] max-sm:w-[12vw] max-sm:h-[12vw] min-h-[45px] min-w-[45px] relative rounded-full bg-white">
                  <div className="h-[45px] w-[45px] sm:h-20 sm:w-20 rounded-full bg-white" />

                </div>
                <h3 className="mt-2 truncate bg-gray-300 rounded-full w-3/5 text-left h-2.5" />
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (categoriesError || !categories || categories.length === 0) {
      if (categoriesError) console.log("Failed to load categories.", categoriesError);
      if (!categories || categories.length === 0) console.log("No categories were found.");

      return (
        <div className="w-[94vw] sm:max-w-[80vw] mt-3 mx-auto">
          <div
            className="
              grid 
              grid-cols-5 
              gap-2 sm:gap-4 
              place-items-center
              justify-items-center
              max-w-full
          "
            style={{
              gridAutoRows: "1fr",
            }}
          >
            {[
              "Cosmetics",
              "Electronics",
              "Fashion",
              "Furniture",
              "Games",
              "Grocery",
              "Industry",
              "Property",
              "Services",
              "Vehicle",
            ].slice(0, 10).map((category, ix) => (
              <div
                key={ix}
                onClick={() => toast("Data is currently unavailable for " + category)}
                className="
                      flex flex-col items-center justify-center
                      w-[12vw] h-[12vw] min-h-[75px] min-w-[75px] 
                      bg-(--div-active) rounded-lg 
                      p-2 sm:p-3 cursor-pointer 
                      hover:bg-gray-300
                  "
              >
                <div className="w-[8vw] h-[8vw] min-h-[45px] min-w-[45px] sm:h-20 sm:w-20 relative rounded-full bg-white">
                  <img
                    src={`/${category.toLowerCase()}.png`}
                    alt={category}
                    className="absolute bottom-1 sm:bottom-3 w-[7vw] h-[7vw] min-w-[85%] min-h-[85%] object-contain left-1/2 -translate-x-1/2"
                  />
                </div>
                <h3 className="text-center  text-xs sm:text-[1.25vw] mt-1 truncate">
                  {category}
                </h3>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="w-[94vw] sm:max-w-[98vw] mt-3 mx-auto sm:flex sm:justify-center">
        <div
          className="
            grid 
            grid-cols-5 
            gap-2 sm:gap-4 
            place-items-center
            justify-items-center
            max-w-full w-full sm:max-w-4/5

            max-sm:flex max-sm:flex-wrap max-sm:w-screen
            max-sm:items-center max-sm:justify-center
        "
          style={{
            gridAutoRows: "1fr",
          }}
        >
          {categories.slice(0, 10).map((category) => (
            <div
              key={category.id}
              onClick={() => {
                if (category.name.toUpperCase() === "SERVICES") {
                  navigate("/apply");
                  return;
                }
                onCategoryClick(category.name)
              }}
              className="
                    flex flex-col items-center justify-center
                    w-[12vw] h-[12vw] min-h-[75px] min-w-[75px]
                    bg-(--div-active) rounded-lg 
                    p-0 sm:p-3 cursor-pointer 
                    hover:bg-gray-300

                    max-sm:w-[20vw] max-sm:h-[20vw]
                    max-sm:min-w-[75px] max-sm:min-h-[75px]
                "
            >
              <div className="w-[8vw] h-[8vw] max-sm:w-[12vw] max-sm:h-[12vw] min-h-[45px] min-w-[45px] relative rounded-full bg-white">
                <img
                  src={`/${category.name.toLowerCase()}.png`}
                  alt={category.name}
                  className="absolute bottom-1 sm:bottom-3 w-[7vw] h-[7vw] max-sm:w-[8vw] max-sm:h-[8vw] min-w-[85%] min-h-[85%] object-contain left-1/2 -translate-x-1/2"
                />
              </div>
              <h3 className="text-center flex items-center justify-center text-xs sm:text-[1.25vw] mt-1 truncate">
                {category.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const CategoryFilters = () => (
    <div className="flex flex-wrap justify-center sm:justify-center gap-2 sm:gap-4 mt-4 mb-6 px-3 sm:px-0">
      <button
        onClick={handleFilterSettings}
        className="bg-white flex-1 sm:flex-none min-w-[140px] max-w-[180px] px-3 sm:px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
      >
        Categories
        <img
          onClick={(e) => {
            e.stopPropagation();
            handleBackToHome();
          }}
          src="/cancel.svg"
          alt=""
          className="w-4 h-4"
        />
      </button>

      <button className="bg-white flex-1 sm:flex-none min-w-[140px] max-w-[180px] px-3 sm:px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
        Locations <img src="/location.svg" alt="" className="w-4 h-4" />
      </button>

      <button className="bg-white flex-1 sm:flex-none min-w-[140px] max-w-[180px] px-3 sm:px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
        Ad Purpose <img src="/tag.svg" alt="" className="w-4 h-4" />
      </button>

      <button className="bg-white flex-1 sm:flex-none min-w-[140px] max-w-[180px] px-3 sm:px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
        Highlight <img src="/highlight.svg" alt="" className="w-4 h-4" />
      </button>
    </div>
  );

  const CircularSummaries = ({
    categories,
    total,
  }: {
    categories: (Category & { adsCount: number })[];
    total: number;
  }) => {

    if (categoriesLoading) {
      return (
        <div className="flex flex-col items-center mt-12">
          <p className="loading-dots">Loading ad counts</p>
          <Loader className={"h-40 -mt-12"} />
        </div>
      );
    }
    if (categoriesError || !categories || categories.length === 0) {
      console.log("No categories available to be summarised.");
      return <p className="text-xl py-17 text-center">Ad count summaries are currently unavailiable.</p>
    }

    return (
      <div className=" text-(--dark-def) flex items-center justify-center w-full overflow-hidden my-12 lg:h-50 h-25">
        <div className="justify-center max-md:gap-2 items-center flex-nowrap grid grid-cols-5 sm:w-3/5 gap-2 max-sm:px-3">

          {categories
            .sort((a, b) => b.adsCount - a.adsCount)
            .filter((cat) => cat.adsCount > 0)
            .slice(0, 5)
            .concat(categories.filter((cat) => cat.adsCount === 0))
            .slice(0, 5)
            .map((category) => {
              const percentage = ((category.adsCount || 0) / total) * 100;
              return (
                <div
                  key={category.id}
                  className="relative w-auto h-17 lg:w-4/5 flex items-center justify-center"
                >
                  <CircularProgressbar
                    value={percentage}
                    styles={{
                      path: {
                        stroke: "var(--dark-def)",
                        strokeLinecap: "round",
                      },
                    }}
                  />
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-[2.5vw] md:text-xs lg:text-[1.2vw] min-w-[60px]">
                      {category.name}
                    </span>
                    <span className="text-xs md:text-xl lg:text-2xl font-bold text-(--accent-color)">
                      {formatCount(category.adsCount)}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    )
  };

  // Component for individual scrollable ad row with dynamic fade
  const ScrollableAdRow = ({ category }: { category: Category }) => {
    const containerId = `move-${category.id}`;
    const maskGradient = useScrollFade(containerId);
    const categoryProducts = productsByCategory[category.id] || [];
    const filteredProducts = applyFilters(categoryProducts);

    if (!categoryProducts || categoryProducts.length === 0) return null;

    return (
      <div
        key={category.id}
        className="flex flex-col w-[95vw] mt-6 mx-auto overflow-hidden text-(--dark-def)"
      >
        <div className="flex items-center gap-3 mb-2 px-2">
          <h2 className="text-base sm:text-xl lg:text-[2vw] font-semibold truncate text-(--dark-def)">
            {category.name}
          </h2>
          <button className="bg-gray-200 px-3 py-1 rounded-full text-xs sm:text-sm lg:text-xl hidden whitespace-nowrap">
            Filter
          </button>
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => handleArrowClick("left", category.id)}
              className="bg-gray-200 p-2 rounded-full shrink-0"
            >
              <img src="/arrowleft.svg" alt="Left" className="w-3 sm:w-8" />
            </button>
            <button
              onClick={() => handleArrowClick("right", category.id)}
              className="bg-gray-200 p-2 rounded-full shrink-0"
            >
              <img src="/arrowright.svg" alt="Right" className="w-3 sm:w-8" />
            </button>
          </div>
        </div>

        <div
          id={containerId}
          className="overflow-x-auto no-scrollbar px-1 py-3 sm:px-2"
          style={{
            WebkitMaskImage: maskGradient,
            maskImage: maskGradient,
          }}
        >
          {filteredProducts.length > 0 ? (
            <div className="flex gap-2 sm:gap-3 w-max">
              {productsLoading
                ? <Loader className={"h-40 my-0"} />
                : filteredProducts.map(
                  (ad) =>
                    (ad.status === "ACTIVE" && !ad.is_taken) && (
                      <Link
                        key={ad.id}
                        to={`/ads/${ad.id}`}
                        state={{ adData: ad }}
                        onClick={(e) => handleAdClick(ad, e)}
                        className="inline-block rounded-2xl overflow-hidden shrink-0 w-[38vw] sm:w-48 md:w-52"
                      >
                        <img
                          src={ad.image || "/no-image.jpeg"}
                          alt={ad.name}
                          className="w-full h-[120px] sm:h-52 object-cover rounded-2xl"
                        />
                        <div className="flex items-center gap-1 px-2 py-1">
                          <img
                            src="/location.svg"
                            alt=""
                            className="w-3 sm:w-5 h-3 sm:h-5"
                          />
                          <p className="text-[10px] sm:text-sm text-gray-500 truncate">
                            {ad.location?.name ?? ad.location?.region ?? "Unknown"}
                          </p>
                        </div>
                        <p className="px-2 text-[11px] sm:text-xl truncate line-clamp-1 text-gray-600">
                          {ad.name}
                        </p>
                        <p className="px-2 text-[11px] sm:text-base font-medium text-gray-800">
                          {formatMoney(ad.price, "GHS")}
                        </p>
                      </Link>
                    ),
                )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <img src="/nothing-to-show.png" alt="nothing to show" className="h-7 w-7" />
              <p className="px-2 text-sm text-gray-500">
                No ads to show here...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ScrollableAds = () => {
    if (!categories || categories.length === 0) {
      return (
        <div className="text-xl mt-5 w-full flex flex-col items-center justify-center gap-4">
          <img
            src="/nothing-to-show.png"
            alt="Nothing to show"
            className="max-w-[50vw] sm:max-w-50"
          />
          <p>No ad categories are available at this time.</p>
        </div>
      )
    }

    // Filter out categories that have no filtered products
    const categoriesWithAds = categories.filter((category) => {
      const categoryProducts = productsByCategory[category.id] || [];
      const filteredProducts = applyFilters(categoryProducts);
      return filteredProducts.length > 0;
    });

    if (categoriesWithAds.length === 0) {
      return (
        <div className="text-xl mt-5 w-full flex flex-col items-center justify-center gap-4">
          <img
            src="/nothing-to-show.png"
            alt="Nothing to show"
            className="max-w-[50vw] sm:max-w-50"
          />
          <p>No ads match your filters.</p>
        </div>
      )
    }

    return categoriesWithAds.map((category) => (
      <ScrollableAdRow key={category.id} category={category} />
    ));
  };

  const ConditionalAds = () => {
    // Find the selected category's products
    const categoryProducts = selectedCategory
      ? productsByCategory[selectedCategory.id] || []
      : [];

    const filteredProducts = applyFilters(categoryProducts);

    return (
      <div className="bg-(--div-active) w-full flex justify-center -mb-4">
        <div
          className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-[95vw] pb-45"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((ad) => (
              <div key={ad.id} className="flex flex-col w-full overflow-hidden">
                <Link to={`/ads/${ad.id}`} state={{ adData: ad }} onClick={(e) => handleAdClick(ad, e)}>
                  <img
                    src={ad.image || "/no-image.jpeg"}
                    alt={ad.name}
                    className="w-full h-40 sm:h-48 object-cover rounded-2xl"
                  />
                  <div className="flex items-center gap-1 px-2 py-1">
                    <img src="/location.svg" alt="" className="w-4 h-4" />
                    <p className="text-xs text-gray-500">
                      {ad.location?.name ?? ad.location?.region ?? "Unknown"}
                    </p>
                  </div>
                  <p className="px-2 text-sm truncate text-gray-500">
                    {ad.name}
                  </p>
                  <p className="px-2 text-sm font-light text-gray-500">
                    {formatMoney(ad.price, "GHS")}
                  </p>
                </Link>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center col-span-full">
              <img src="/nothing-to-show.png" alt="nothing to show" className="h-10 w-10 lg:h-[10vw] lg:w-[10vw]" />
              <p className="px-2 text-sm text-gray-500">
                No ads to show here...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const SearchResults = () => {
    const results = products.filter((p) => p.status === "ACTIVE");
    const filteredResults = applyFilters(results);

    if (!filteredResults || filteredResults.length === 0) {
      return (
        <div className="bg-(--div-active) w-full flex justify-center -mb-4">
          <div style={{ transform: "scale(0.9)" }} className="w-[95vw] pb-8">
            <p className="text-center text-gray-500">
              No ads found for your search.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-(--div-active) w-full flex justify-center -mb-4">
        <div
          style={{ transform: "scale(0.9)" }}
          className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-[95vw] pb-8"
        >
          {filteredResults.map((ad) => (
            <div key={ad.id} className="flex flex-col w-full overflow-hidden">
              <Link to={`/ads/${ad.id}`} state={{ adData: ad }} onClick={(e) => handleAdClick(ad, e)}>
                <img
                  src={ad.image || "/no-image.jpeg"}
                  alt={ad.name}
                  className="w-full h-40 sm:h-48 object-cover rounded-2xl"
                />
                <div className="flex items-center gap-1 px-2 py-1">
                  <img src="/location.svg" alt="" className="w-4 h-4" />
                  <p className="text-xs text-gray-500">
                    {ad.location?.name ?? ad.location?.region ?? ""}
                  </p>
                </div>
                <p className="px-2 text-sm truncate text-gray-500">{ad.name}</p>
                <p className="px-2 text-sm font-light text-gray-500">
                  {formatMoney(ad.price, "GHS")}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const FilterButton = ({ className }: { className?: string }) => {
    // Calculate active filter count
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

  return (
    <div className="flex flex-col items-center w-screen min-h-screen gap-6 sm:gap-12 overflow-x-hidden px-3 sm:px-4 min-w-[250px]">
      <AdLoadingOverlay isVisible={isAdLoading} />
      <HomePageHeader searchValue={searchTerm} setSearchValue={setSearchTerm} />
      <div className="flex flex-col items-center justify-center">
        <div className="bg-(--div-active) w-screen">
          {selectedCategory && <CategoryFilters />}
        </div>
        {showFilterPopup && (
          <ShowFilter
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            selectedSubcategoryId={selectedSubcategoryId}
            setSelectedSubcategoryId={setSelectedSubcategoryId}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
          />
        )}

        {selectedCategory ? (
          <ConditionalAds />
        ) : debouncedSearch ? (
          <SearchResults />
        ) : (
          <>
            <div>
              <SelectACategory
                categories={categories}
                onCategoryClick={handleCategoryClick}
              />
              <CircularSummaries
                categories={categoriesWithCounts}
                total={totalProducts}
              />
            </div>

            <div className="bg-(--div-active) w-screen">
              <ScrollableAds />
              <div className="h-35 lg:h-35" />
            </div>
          </>
        )}
        <div className="fixed w-full bottom-20 lg:bottom-21 left-0 flex items-center justify-center" >
          <FilterButton />
        </div>
        <MenuButton />
      </div>
    </div>
  );
};

export default HomePage;

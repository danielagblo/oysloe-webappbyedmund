import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import "../App.css";

import AdLoadingOverlay from "../components/AdLoadingOverlay";
import MenuButton from "../components/MenuButton";

import useCategories from "../features/categories/useCategories";
import { useProducts } from "../features/products/useProducts";

import type { Category } from "../types/Category";
import type { Product } from "../types/Product";

import useIsSmallScreen from "../hooks/useIsSmallScreen";
import CategoryFilters from "./home/CategoryFilters";
import CircularSummaries from "./home/CircularSummaries";
import ConditionalAds from "./home/ConditionalAds";
import FilterButton from "./home/FilterButton";
import HomePageHeader from "./home/HomePageHeader";
import MobileGridAds from "./home/MobileGridAds";
import ScrollableAds from "./home/ScrollableAds";
import SearchResults from "./home/SearchResults";
import SelectACategory from "./home/SelectACategory";
import ShowFilter from "./home/ShowFilter";

// Note: header and scroll-fade behavior are handled in the extracted components.

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
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "newest" | "7days" | "30days" | "anytime"
  >("anytime");
  const [selectedAdType, setSelectedAdType] = useState<
    "SALE" | "RENT" | "PAYLATER" | "all"
  >("all");
  const [priceSort, setPriceSort] = useState<
    "none" | "low-to-high" | "high-to-low"
  >("none");
  const [timeframeSort, setTimeframeSort] = useState<
    "none" | "newest" | "oldest"
  >("none");
  const [priceFilter, setPriceFilter] = useState<{
    mode: "none" | "below" | "above" | "between";
    below?: number;
    above?: number;
    min?: number;
    max?: number;
  }>({ mode: "none" });
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    number | ""
  >("");
  const [selectedFeatures, setSelectedFeatures] = useState<
    Record<number, string>
  >({});

  const handleAdClick = async (ad: Product, e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdLoading(true);
    // Small delay to ensure overlay renders
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate(`/ads/${ad.id}`, { state: { adData: ad }, replace: false });
    // Reset after navigation (component will unmount but just in case)
    setTimeout(() => setIsAdLoading(false), 500);
  };

  const handleCategoryClick = (name: string) => {
    const category = categories.find((c) => c.name === name) || null;
    if (isSmall) {
      // On mobile: apply category as a filter in-place by setting the ID
      // and ensure `selectedCategory` remains null so we don't render
      // the ConditionalAds screen.
      setSelectedCategory(null);
      setSelectedCategoryId(category ? category.id : null);
    } else {
      // On desktop: preserve existing behavior (open ConditionalAds)
      setSelectedCategory(category);
    }
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

  const { data: products = [], isLoading, isPlaceholderData } = useProducts({
    search: debouncedSearch || undefined,
  });
  
  // Only show loading state when we have no data at all (not when using placeholder data)
  const productsLoading = isLoading && !isPlaceholderData;

  // Mobile-only breakpoint detection (<= 640px)
  const isSmall = useIsSmallScreen(640);

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

  // helper values and functions used by extracted components
  const uniqueLocations: string[] = Array.from(
    new Set(
      products
        .map((p: Product) => p.location?.name ?? p.location?.region ?? "")
        .filter(Boolean),
    ),
  );

  const handleBackToHome = () => {
    setSelectedCategory(null);
    setSelectedCategoryId(null);
    setSelectedSubcategoryId("");
    setSelectedFeatures({});
  };

  const handleArrowClick = (dir: "left" | "right", id: string | number) => {
    const el = document.getElementById(`move-${id}`);
    if (!el) return;
    const distance = Math.max(200, Math.floor(el.clientWidth * 0.6));
    el.scrollBy({
      left: dir === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  const applyFilters = (items: Product[]) => {
    // Check if any filters are active (not at defaults)
    const hasActiveFilters =
      selectedLocation ||
      selectedTimeframe !== "anytime" ||
      selectedAdType !== "all" ||
      priceSort !== "none" ||
      timeframeSort !== "none" ||
      priceFilter.mode !== "none" ||
      selectedCategoryId !== null ||
      selectedSubcategoryId !== "" ||
      Object.keys(selectedFeatures).length > 0;

    // If no filters are active, return all items as-is
    if (!hasActiveFilters) {
      return (items || []).filter((p) => p.status === "ACTIVE" && !p.is_taken);
    }

    let out = (items || []).filter((p) => p.status === "ACTIVE" && !p.is_taken);

    // Category/subcategory filtering
    if (selectedCategoryId !== null) {
      out = out.filter((p) => p.category === selectedCategoryId);
    }
    if (selectedSubcategoryId !== null && selectedSubcategoryId !== "") {
      out = out.filter((p) =>
        p.product_features.some(
          (pf: { feature?: { subcategory?: string | number } }) =>
            pf.feature?.subcategory === selectedSubcategoryId,
        ),
      );
    }

    // Feature filtering (best effort - match string values)
    if (selectedFeatures && Object.keys(selectedFeatures).length > 0) {
      out = out.filter((p) => {
        try {
          const serialized = JSON.stringify(p).toLowerCase();
          return Object.entries(selectedFeatures).every(([, val]) => {
            if (!val) return true;
            return serialized.includes(String(val).toLowerCase());
          });
        } catch {
          return true;
        }
      });
    }

    // Location
    if (selectedLocation) {
      const selectedLocations = selectedLocation.split(",");
      out = out.filter((p) => {
        const loc = p.location?.name ?? p.location?.region ?? "";
        return selectedLocations.some((sel) => {
          // Check if it's "All - Region" format
          if (sel.startsWith("All - ")) {
            const region = sel.replace("All - ", "");
            return p.location?.region === region;
          }
          // Otherwise check if it's an exact location name match
          return loc === sel;
        });
      });
    }

    // Timeframe filter (approximate using created_at or createdAt)
    if (selectedTimeframe && selectedTimeframe !== "anytime") {
      const now = Date.now();
      const cutoff =
        selectedTimeframe === "newest"
          ? 1000 * 60 * 60 * 24
          : selectedTimeframe === "7days"
            ? 1000 * 60 * 60 * 24 * 7
            : selectedTimeframe === "30days"
              ? 1000 * 60 * 60 * 24 * 30
              : null;
      if (cutoff) {
        out = out.filter((p) => {
          const created =
            (p as unknown as { created_at?: string; createdAt?: string })
              .created_at ||
            (p as unknown as { created_at?: string; createdAt?: string })
              .createdAt;
          const t = created ? Date.parse(created as string) : null;
          if (!t) return true; // Keep products without dates
          return now - t <= cutoff;
        });
      }
    }

    // Ad Type filter
    if (selectedAdType && selectedAdType !== "all") {
      out = out.filter((p) => p.type === selectedAdType);
    }

    // Price filter
    if (
      priceFilter?.mode === "below" &&
      typeof priceFilter.below === "number"
    ) {
      out = out.filter((p) => Number(p.price) <= priceFilter.below!);
    } else if (
      priceFilter?.mode === "above" &&
      typeof priceFilter.above === "number"
    ) {
      out = out.filter((p) => Number(p.price) >= priceFilter.above!);
    } else if (
      priceFilter?.mode === "between" &&
      typeof priceFilter.min === "number" &&
      typeof priceFilter.max === "number"
    ) {
      out = out.filter(
        (p) =>
          Number(p.price) >= priceFilter.min! &&
          Number(p.price) <= priceFilter.max!,
      );
    }

    // Sorting
    if (priceSort === "low-to-high") {
      out = out.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (priceSort === "high-to-low") {
      out = out.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (timeframeSort === "newest" || timeframeSort === "oldest") {
      out = out.sort((a, b) => {
        const ta = Date.parse(
          (a as unknown as { created_at?: string; createdAt?: string })
            .created_at ||
          (a as unknown as { created_at?: string; createdAt?: string })
            .createdAt ||
          "",
        );
        const tb = Date.parse(
          (b as unknown as { created_at?: string; createdAt?: string })
            .created_at ||
          (b as unknown as { created_at?: string; createdAt?: string })
            .createdAt ||
          "",
        );
        if (!ta || !tb) return 0;
        return timeframeSort === "newest" ? tb - ta : ta - tb;
      });
    }

    if (hasActiveFilters) {
      const filteredAds = out.map((p) => {
        const subcategories = Array.from(
          new Set(
            (p.product_features || [])
              .map((pf) => pf?.feature?.subcategory)
              .filter((v): v is number => typeof v === "number"),
          ),
        );
        return {
          id: p.id,
          name: p.name,
          subcategories,
        };
      });
      console.log("[filters] matched ads & subcategories", filteredAds);
    }

    return out;
  };

  return (
    <div className="flex flex-col items-center w-screen min-h-screen gap-6 sm:gap-12 overflow-x-hidden px-3 sm:px-4 min-w-[250px]">
      <Helmet>
        <title>OYSLOE | Ghana's Safest Online Marketplace</title>
        <meta
          name="description"
          content="OYSLOE is Ghana's leading online marketplace connecting verified buyers and sellers for safe, secure, and reliable buying and selling."
        />
        <link rel="canonical" href="https://oysloe.com/" />

        {/* Open Graph */}
        <meta property="og:title" content="OYSLOE | Ghana's Safest Online Marketplace" />
        <meta
          property="og:description"
          content="Ghana's safest online marketplace for verified buyers and sellers."
        />
        <meta property="og:url" content="https://oysloe.com/" />
      </Helmet>

      <AdLoadingOverlay isVisible={isAdLoading} />
      <HomePageHeader searchValue={searchTerm} setSearchValue={setSearchTerm} />
      <div className="flex flex-col items-center justify-center">
        <div className="bg-(--div-active) w-screen">
          {selectedCategory && (
            <CategoryFilters
              selectedCategoryId={selectedCategoryId}
              categories={categories}
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
              handleBackToHome={handleBackToHome}
            />
          )}
        </div>
        {showFilterPopup && (
          <ShowFilter
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            selectedSubcategoryId={selectedSubcategoryId}
            setSelectedSubcategoryId={setSelectedSubcategoryId}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
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
            closeFilterPopup={closeFilterPopup}
            categories={categories}
            uniqueLocations={uniqueLocations}
          />
        )}

        {selectedCategory ? (
          <ConditionalAds
            selectedCategory={selectedCategory}
            productsByCategory={productsByCategory}
            applyFilters={applyFilters}
            handleAdClick={handleAdClick}
          />
        ) : debouncedSearch ? (
          <SearchResults
            products={products}
            applyFilters={applyFilters}
            handleAdClick={handleAdClick}
          />
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
                categoriesLoading={categoriesLoading}
                categoriesError={categoriesError}
              />
            </div>

            <div className="bg-(--div-active) w-screen">
              {isSmall ? (
                <MobileGridAds
                  products={applyFilters(products)}
                  productsLoading={productsLoading}
                  handleAdClick={handleAdClick}
                />
              ) : (
                <ScrollableAds
                  categories={categories}
                  productsByCategory={productsByCategory}
                  applyFilters={applyFilters}
                  productsLoading={productsLoading}
                  handleArrowClick={handleArrowClick}
                  handleAdClick={handleAdClick}
                />
              )}
              <div className="h-35 lg:h-35" />
            </div>
          </>
        )}
        <div className="fixed w-full bottom-20 lg:bottom-21 left-0 flex items-center justify-center z-50">
          <FilterButton
            handleFilterSettings={handleFilterSettings}
            selectedCategoryId={selectedCategoryId}
            setSelectedCategoryId={setSelectedCategoryId}
            selectedSubcategoryId={selectedSubcategoryId}
            setSelectedSubcategoryId={setSelectedSubcategoryId}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
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
            categories={categories}
            uniqueLocations={uniqueLocations}
            allProducts={products}
            applyFilters={applyFilters}
          />
        </div>
        <MenuButton />
      </div>
    </div>
  );
};

export default HomePage;

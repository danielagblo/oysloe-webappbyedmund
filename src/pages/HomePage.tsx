import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import MenuButton from "../components/MenuButton";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import "../App.css";

import useCategories from "../features/categories/useCategories";
import { useProducts } from "../features/products/useProducts";
import type { Category } from "../types/Category";
import type { Product } from "../types/Product";

import { toast } from "sonner";
import Loader from "../components/LoadingDots";
import { formatCount } from "../utils/formatCount";
import { formatMoney } from "../utils/formatMoney";
import AdLoadingOverlay from "../components/AdLoadingOverlay";
import { useNavigate } from "react-router-dom";

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
        className={`flex items-center transition-all duration-300 ${isSmallScreen && isCondensed
            ? "justify-between px-4 py-2 gap-3"
            : "flex-col items-center justify-center gap-8 mt-40"
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
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search anything up for good"
                className={`search-input ${isSmallScreen && isCondensed
                    ? "text-[16px]"
                    : "text-2xl sm:text-2xl"
                  } px-4 py-3 h-12 sm:h-14 max-sm: max-w-[70vw] rounded-full outline-0 bg-white text-center`}
              />

              <img
                src="/search.svg"
                className="absolute flex top-3.5 md:top-4.5 -left-3 max-md:left-1.5 w-5 h-5 z-10"
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

  /* HomePageHeader moved to module scope to avoid remounting on each render */

  const ShowFilter = () => (
    <div className="fixed inset-0 bg-[#4c4a4ab8] flex items-center justify-center z-50 px-3 sm:px-0">
      <div className="relative pt-30 bg-white rounded-[30px] sm:rounded-[60px] w-[95vw] sm:w-[70vw] md:w-[50vw] max-h-[90vh] overflow-y-auto no-scrollbar shadow-lg">
        {/* Close button */}
        <div className="absolute top-0 left-0 p-4 sm:p-6">
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

          {/* Header */}
          <p className="bg-(--div-active) px-4 py-2 rounded-lg text-sm inline-flex items-center gap-3">
            <span className="text-length:--font-size)">Category</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 31 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="15.5" cy="15.5" r="15.5" fill="#374957" />
              <path
                d="M7.67394 21.4473L19.8827 10.8223L21.292 12.4935L9.08324 23.1184L7.67394 21.4473ZM8.44226 11.4926L10.0817 10.0658L20.5236 22.4482L18.8842 23.8749L8.44226 11.4926Z"
                fill="white"
              />
            </svg>
          </p>
        </div>

        {/* Categories list */}
        <div className="category-list relative">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3 p-4 sm:p-6">
            {categories.map((category) => (
              <label
                key={category.id}
                className="text-(length:--font-size) flex items-center gap-2 sm:gap-3 p-2 sm:p-3 w-fit border border-(--div-border) rounded-lg hover:bg-gray-200 cursor-pointer text-sm sm:text-base"
              >
                <input
                  type="radio"
                  name="category"
                  value={category.name}
                  checked={selectedCategory?.id === category.id}
                  onChange={() => setSelectedCategory(category)}
                  className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-400 checked:bg-[url('/check.svg')] checked:bg-center checked:bg-no-repeat checked:bg-size-[18px_18px]"
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Search button */}
        <div className="flex justify-center mb-6 mt-8">
          <button className="px-10 sm:px-20 py-3 sm:py-4 bg-(--div-active) rounded-lg hover:bg-gray-200 text-xl sm:text-2xl">
            Search
          </button>
        </div>
      </div>
    </div>
  );

  const SelectACategory = ({
    categories,
    onCategoryClick,
  }: {
    categories: Category[];
    onCategoryClick: (name: string) => void;
  }) => {
    if (categoriesLoading) {

      return (
        <div className="w-[94vw] sm:max-w-[80vw] mt-3 mx-auto">
          <div
            className="grid grid-cols-5 gap-2 sm:gap-4 place-items-center justify-items-center max-w-full"
            style={{ gridAutoRows: "1fr" }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="
                  flex flex-col items-center justify-center
                  w-[12vw] h-[12vw] min-h-[75px] min-w-[75px]
                  bg-gray-200 rounded-lg 
                  p-2 sm:p-3 cursor-progress animate-pulse
                "
              >
                <div className="w-[8vw] h-[8vw]  min-h-[45px] min-w-[45px] sm:h-20 sm:w-20 relative rounded-full bg-white">
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
                    className="absolute bottom-1 sm:bottom-3 w-[7vw] h-[7vw] min-w-[85%] min-h-[85%]object-contain left-1/2 -translate-x-1/2"
                  />
                </div>
                <h3 className="text-center text-[10px] sm:text-(length:--font-size) mt-1 truncate">
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
              onClick={() => onCategoryClick(category.name)}
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


          {/* crazy filter below makes sure it always shows the top 5 non-zero count categories */}
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
                    <span className="text-[10px] md:text-xs lg:text-sm min-w-[60px]">
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
          {categoryProducts.length > 0 ? (
            <div className="flex gap-2 sm:gap-3 w-max">
              {productsLoading
                ? <Loader className={"h-40 my-0"} />
                : categoryProducts.map(
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
            <p className="px-2 text-sm text-gray-500">
              No ads to show here...
            </p>
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

    return categories.map((category) => (
      <ScrollableAdRow key={category.id} category={category} />
    ));
  };

  const ConditionalAds = () => {
    // Find the selected category's products
    const categoryProducts = selectedCategory
      ? productsByCategory[selectedCategory.id] || []
      : [];

    return (
      <div className="bg-(--div-active) w-full flex justify-center -mb-4">
        <div
          className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-[95vw] pb-8"
        >
          {categoryProducts.length > 0 ? (
            categoryProducts.map((ad) => (
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
            <p className="text-center text-gray-500 col-span-full">
              No ads to show here...
            </p>
          )}
        </div>
      </div>
    );
  };

  const SearchResults = () => {
    const results = products.filter((p) => p.status === "ACTIVE");

    if (!results || results.length === 0) {
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
          {results.map((ad) => (
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

  return (
    <div className="flex flex-col items-center w-screen min-h-screen gap-6 sm:gap-12 overflow-x-hidden px-3 sm:px-4 min-w-[250px]">
      <AdLoadingOverlay isVisible={isAdLoading} />
      <HomePageHeader searchValue={searchTerm} setSearchValue={setSearchTerm} />
      <div className="flex flex-col items-center justify-center">
        <div className="bg-(--div-active) w-screen">
          {selectedCategory && <CategoryFilters />}
        </div>
        {showFilterPopup && <ShowFilter />}

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
              <div className="h-26" />
            </div>
          </>
        )}
        <MenuButton />
      </div>
    </div>
  );
};

export default HomePage;

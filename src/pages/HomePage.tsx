import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import MenuButton from "../components/MenuButton";

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import "../App.css";



const HomePage = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showFilterPopup, setShowFilterPopup] = useState(false);

    const categories = [
        { id: 1, name: "Electronics", icon: "electronics.png", adsCount: 120 },
        { id: 2, name: "Furniture", icon: "furniture.png", adsCount: 80 },
        { id: 3, name: "Vehicles", icon: "vehicle.png", adsCount: 60 },
        { id: 4, name: "Industry", icon: "industrial.png", adsCount: 40 },
        { id: 5, name: "Fashion", icon: "fashion.png", adsCount: 100 },
        { id: 6, name: "Grocery", icon: "grocery.png", adsCount: 90 },
        { id: 7, name: "Games", icon: "games.png", adsCount: 70 },
        { id: 8, name: "Cosmetics", icon: "cosmetics.png", adsCount: 50 },
        { id: 9, name: "Property", icon: "property.png", adsCount: 30 },
        { id: 10, name: "Services", icon: "services.png", adsCount: 20 },
    ];

    const categ = categories.slice(0, 5);

    const pics: string[] = Array.from({ length: 10 }, () => "https://picsum.photos/200");

    const ads = [
        { id: 1, location: "Accra", title: "Smartphone for sale", price: "GHc 500" },
        { id: 2, location: "Kumasi", title: "Car", price: "GHc 300 for 6days" },
        { id: 3, location: "Takoradi", title: "Laptop", price: "GHc 800" },
        { id: 4, location: "Cape Coast", title: "Bike", price: "GHc 150 for 3days" },
        { id: 5, location: "Tamale", title: "Headphones", price: "GHc 200" },
        { id: 6, location: "Ho", title: "Tablet", price: "GHc 400" },
        { id: 7, location: "Tema", title: "Camera", price: "GHc 600" },
        { id: 8, location: "Obuasi", title: "Smartwatch", price: "GHc 250" },
        { id: 9, location: "Sunyani", title: "Printer", price: "GHc 250" },
        { id: 10, location: "Wa", title: "Monitor", price: "GHc 450" },
    ];

    const sum = categories.reduce((acc, c) => acc + c.adsCount, 0);

    const handleArrowClick = (direction: "left" | "right", id: string) => {
        const container = document.querySelector(`#move-${id}`) as HTMLElement | null;
        if (container) {
            const scrollAmount = container.clientWidth;
            container.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const handleCategoryClick = (categoryName: string) => setSelectedCategory(categoryName);
    const handleBackToHome = () => setSelectedCategory(null);
    const handleFilterSettings = () => setShowFilterPopup(true);
    const closeFilterPopup = () => setShowFilterPopup(false);

    // Header condensed state for small screens: when true the header becomes fixed and inline
    const [isCondensed, setIsCondensed] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const lastScrollY = useRef(0);
    const headerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // detect small screen (Tailwind sm is 640px min, so small screens are <640)
        const mq = window.matchMedia('(max-width:639px)');
        const setMatch = (e?: MediaQueryListEvent) => {
            setIsSmallScreen(e ? e.matches : mq.matches);
            // reset condensed when leaving small screen
            if (e && !e.matches) setIsCondensed(false);
        };
        setMatch();

        // modern API
        mq.addEventListener('change', setMatch);
        return () => mq.removeEventListener('change', setMatch);
    }, []);

    useEffect(() => {
        if (!isSmallScreen) {
            setIsCondensed(false);
            document.body.style.paddingTop = '';
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

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [isSmallScreen, isCondensed]);

    // Manage body padding to avoid layout jump when header becomes fixed
    useEffect(() => {
        if (isCondensed && headerRef.current && isSmallScreen) {
            const h = headerRef.current.getBoundingClientRect().height;
            document.body.style.paddingTop = `${h}px`;
        } else {
            document.body.style.paddingTop = '';
        }
    }, [isCondensed, isSmallScreen]);


    const HomePageHeader = () => {
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
            className={`w-full left-0 z-40 transition-all duration-300 ${
                isSmallScreen && isCondensed
                ? "fixed top-0 bg-white/90 backdrop-blur-sm shadow-sm"
                : "relative"
            }`}
            >
            <div
                className={`flex items-center transition-all duration-300 ${
                isSmallScreen && isCondensed
                    ? "justify-between px-4 py-2 gap-3"
                    : "flex-col items-center justify-center gap-8 mt-40"
                }`}
            >
                <h2
                className={`${
                    isSmallScreen && isCondensed ? "text-lg" : "text-4xl sm:text-6xl"
                } font-medium text-[var(--dark-def)] whitespace-nowrap`}
                >
                Oysloe
                </h2>

                <div
                className={`relative flex items-center ${
                    isSmallScreen && isCondensed
                    ? "justify-end flex-1"
                    : "justify-center w-full max-w-[520px]"
                }`}
                >
                <div className="rotating-bg" aria-hidden="true" />
                <div className="rotating-bg-inner" aria-hidden="true" />

                <input
                    type="text"
                    placeholder="Search anything up for good"
                    className={`search-input ${
                    isSmallScreen && isCondensed
                        ? "text-[16px]"
                        : "text-2xl sm:text-2xl"
                    } px-4 py-3 h-12 sm:h-14 rounded-full outline-0 bg-white text-center`}
                />

                <img
                    src="/search.svg"
                    className="absolute top-1/2 left-[25px] -translate-y-1/2 w-5 h-5 z-10"
                />
                </div>
            </div>
            </div>
        );
    };

    const ShowFilter = () => (
        <div className="fixed inset-0 bg-[#4c4a4ab8] flex items-center justify-center z-50 px-3 sm:px-0">
            <div className="bg-white rounded-[30px] sm:rounded-[60px] w-[95vw] sm:w-[70vw] md:w-[50vw] max-h-[90vh] overflow-y-auto shadow-lg">
            {/* Close button */}
            <div className="p-4 sm:p-6">
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
                <p className="bg-[var(--div-active)] px-4 py-2 rounded-lg text-sm inline-flex items-center gap-3">
                <span className="text-[length:var(--font-size)]">Category</span>
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
                    className="text-[length:var(--font-size)] flex items-center gap-2 sm:gap-3 p-2 sm:p-3 w-fit border border-[var(--div-border)] rounded-lg hover:bg-gray-200 cursor-pointer text-sm sm:text-base"
                    >
                    <input
                        type="radio"
                        name="category"
                        value={category.name}
                        checked={selectedCategory === category.name}
                        onChange={() => setSelectedCategory(category.name)}
                        className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-400 checked:bg-[url('/check.svg')] checked:bg-center checked:bg-no-repeat checked:bg-[length:18px_18px]"
                    />
                    <span>{category.name}</span>
                    </label>
                ))}
                </div>
            </div>

            {/* Search button */}
            <div className="flex justify-center mb-6 mt-8">
                <button className="px-10 sm:px-20 py-3 sm:py-4 bg-[var(--div-active)] rounded-lg hover:bg-gray-200 text-xl sm:text-2xl">
                Search
                </button>
            </div>
            </div>
        </div>
    );
    const SelectACategory = () => (
    <div className="w-[94vw] sm:w-3/4 max-w-6xl mt-3 mx-auto">
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
        {categories.slice(0, 10).map((category) => (
            <div
                key={category.id}
                onClick={() => handleCategoryClick(category.name)}
                className="
                    flex flex-col items-center justify-center
                    w-[70px] h-[80px] sm:w-[120px] sm:h-[130px]
                    bg-[var(--div-active)] rounded-lg 
                    p-2 sm:p-3 cursor-pointer 
                    hover:bg-gray-300
                "
            >
            <div className="h-[45px] w-[45px] sm:h-[80px] sm:w-[80px] relative rounded-full bg-white">
                <img
                src={category.icon}
                alt={category.name}
                className="absolute bottom-1 sm:bottom-3 w-[85%] h-[85%] object-contain left-1/2 -translate-x-1/2"
                />
            </div>
            <h3 className="text-center text-[10px] sm:text-[length:var(--font-size)] mt-1 truncate">
                {category.name}
            </h3>
            </div>
        ))}
        </div>
    </div>
    );
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
    )
    const CircularSummaries = () => (
        <div className="flex items-center justify-center w-full overflow-hidden my-[3rem]">
            <div className="flex flex-row gap-2 sm:gap-10 justify-center items-center flex-nowrap">
            {categ.map((category) => {
                const percentage = (category.adsCount / sum) * 100;
                return (
                <div
                    key={category.id}
                    className="relative w-17 h-17 sm:w-24 sm:h-24 flex items-center justify-center"
                >
                    <CircularProgressbar
                    value={percentage}
                    styles={{
                        path: {
                            stroke: "var(--dark-def)",
                            strokeLinecap: "round",
                        }
                    }}
                    />
                    {/* Overlayed custom text */}
                    <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-[8px] sm:text-xs w-[60px]">
                        {category.name}
                    </span>
                    <span className="text-[10px] sm:text-sm font-bold text-[var(--accent-color)]">
                        {category.adsCount}+
                    </span>
                    </div>
                </div>
                );
            })}
            </div>
        </div>
    );
    const ScrollableAds = () => (
        [
            "Electronics",
            "Furniture",
            "Vehicles",
            "Industry",
            "Fashion",
            "Grocery",
            "Games",
            "Cosmetics",
            "Property",
        ].map((section) => (
            <div
                key={section}
                
                className="flex flex-col w-[95vw] max-w-6xl mt-6 mx-auto overflow-hidden"
            >
            <div className="flex items-center gap-3 mb-2 px-2">
                <h2 className="text-base sm:text-xl font-semibold truncate">{section}</h2>
                <button className="bg-gray-200 px-3 py-1 rounded-full text-xs sm:text-sm whitespace-nowrap">
                Show All
                </button>
                <div className="flex gap-2 ml-auto">
                <button
                    onClick={() => handleArrowClick("left", section.toLowerCase())}
                    className="bg-gray-200 p-2 rounded-full flex-shrink-0"
                >
                    <img src="/arrowleft.svg" alt="Left" className="w-3 sm:w-4" />
                </button>
                <button
                    onClick={() => handleArrowClick("right", section.toLowerCase())}
                    className="bg-gray-200 p-2 rounded-full flex-shrink-0"
                >
                    <img src="/arrowright.svg" alt="Right" className="w-3 sm:w-4" />
                </button>
                </div>
            </div>

            <div
                id={`move-${section.toLowerCase()}`}
                className="overflow-x-auto no-scrollbar px-1 py-3 sm:px-2"
            >
                <div className="flex gap-2 sm:gap-3 w-max">
                {pics.map((pic, index) => (
                    <Link
                    key={index}
                    to={`/ads/${ads[index].id}`}
                    state={{ adData: ads[index] }}
                    className="inline-block rounded-2xl overflow-hidden flex-shrink-0 w-[38vw] sm:w-48 md:w-52"
                    >
                    <img
                        src={pic}
                        alt={`${section} ${index}`}
                        className="w-full h-[120px] sm:h-48 object-cover rounded-2xl"
                    />
                    <div className="flex items-center gap-1 px-2 py-1">
                        <img src="/location.svg" alt="" className="w-3 sm:w-4 h-3 sm:h-4" />
                        <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                        {ads[index].location}
                        </p>
                    </div>
                    <p className="px-2 text-[11px] sm:text-sm line-clamp-1 text-gray-600">
                        {ads[index].title}
                    </p>
                    <p className="px-2 text-[11px] sm:text-sm font-medium text-gray-800">
                        {ads[index].price}
                    </p>
                    </Link>
                ))}
                </div>
            </div>
            </div>
        ))
    );
    const ConditionalAds = () => (
        <div  className="bg-[var(--div-active)] w-full flex justify-center -mb-4">  
            <div style={{ transform: "scale(0.9)" }} className="grid grid-cols-2 sm:grid-cols-5 gap-4 w-[95vw]  pb-[2rem]">
                {pics.map((pic, index) => (
                    <div key={index} className="flex flex-col w-[100%] overflow-hidden">
                        <Link to={`/ads/${ads[index].id}`} state={{ adData: ads[index] }}>
                            <img
                                src={pic}
                                alt={`${selectedCategory} ${index}`}
                                className="w-full h-40 sm:h-48 object-cover rounded-2xl"
                            />
                            <div className="flex items-center gap-1 px-2 py-1">
                                <img src="/location.svg" alt="" className="w-4 h-4" />
                                <p className="text-xs text-gray-500">{ads[index].location}</p>
                            </div>
                            <p className="px-2 text-sm truncate text-gray-500">{ads[index].title}</p>
                            <p className="px-2 text-sm font-light text-gray-500">{ads[index].price}</p>
                        </Link>
                    </div>
                ))}
                <div className="h-10" />
            </div>
        </div>
    )


    return (
        <div className="flex flex-col items-center w-screen min-h-screen gap-6 sm:gap-12 overflow-x-hidden px-3 sm:px-4 min-w-[250px]">
            <HomePageHeader />
            <div className="flex flex-col items-center justify-center">
                <div className="bg-[var(--div-active)] w-[100vw]">  
                    {selectedCategory && ( <CategoryFilters /> )}
                </div>
                {showFilterPopup && ( <ShowFilter /> )}

                {/* Conditional Content */}
                {selectedCategory ? (
                    <ConditionalAds />
                ) : (
                    <>
                        <div className="transform scale-80">
                            {/* Categories Grid */}
                            <SelectACategory />

                            {/* Circular category summaries */}
                            <CircularSummaries />
                        </div>

                        {/* === Scrollable Ad Sections === */}
                        <div className="bg-[var(--div-active)] w-[100vw]">  
                            {<ScrollableAds />}
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
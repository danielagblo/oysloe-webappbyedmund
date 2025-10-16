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


    const ShowFilter = () => (
        <div className="fixed inset-0 bg-[#4c4a4ab8] flex items-center justify-center z-50">
            <div className="bg-white rounded-[60px] w-5/10 lg:w-5/10 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <button onClick={closeFilterPopup} className="block mb-3">
                        <svg width="50" height="50" viewBox="0 0 85 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.6479 60.2642L60.1816 17.9453L67.363 25.1631L24.8293 67.482L17.6479 60.2642ZM17.7371 25.0375L24.9549 17.8561L67.2738 60.3898L60.056 67.5712L17.7371 25.0375Z" fill="#374957" />
                        </svg>
                    </button>
                    <p className="bg-[var(--div-active)] px-4 py-2 rounded-lg text-sm inline-flex items-center gap-4 space-x-0.8">
                        <span className="text-[length:var(--font-size)]">Category</span>
                        {/* <span className="bg-[var(--dark-def)] text-white rounded-full w-4 h-4 rotate-[-45.15deg] text-[20px]"> + </span> */}
                        <svg width="20" height="20" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="15.5" cy="15.5" r="15.5" fill="#374957" />
                            <path d="M7.67394 21.4473L19.8827 10.8223L21.292 12.4935L9.08324 23.1184L7.67394 21.4473ZM8.44226 11.4926L10.0817 10.0658L20.5236 22.4482L18.8842 23.8749L8.44226 11.4926Z" fill="white" />
                        </svg>

                    </p>
                </div>
                <div className="category-list relative">
                    <div  className="flex p-6 flex-wrap gap-3">
                        {categories.map((category) => (
                            <label
                                key={category.id}
                                className="text-[length:var(--font-size)] flex items-center gap-3 p-3 w-fit border-[1px] border-[var(--div-border)] rounded-lg hover:bg-gray-200 cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name="category"
                                    value={category.name}
                                    checked={selectedCategory === category.name}
                                    onChange={() => setSelectedCategory(category.name)}
                                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-400 checked:bg-[url('/check.svg')] checked:bg-center checked:bg-no-repeat checked:bg-[length:18px_18px]"
                                />
                                <span className="ml-2">{category.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center mb-5 mt-10">
                    <button className="px-30 py-4 bg-[var(--div-active)] rounded-lg hover:bg-gray-200 text-4xl">
                        Search
                    </button>
                </div>
            </div>
        </div>
    )

    const SelectACategory = () => (

        <div className="w-3/4 max-w-6xl mt-3">
            <div className="grid grid-cols-2 place-items-center  sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => handleCategoryClick(category.name)}
                        className="flex flex-col items-center justify-center sm:w-[100%] h-38 sm:h-40 gap-1 bg-[var(--div-active)] rounded-lg p-2 sm:p-3 cursor-pointer hover:bg-gray-300"
                    >
                        <div className="h-[90px] w-[90px] relative rounded-full bg-white ">
                            <img
                                src={category.icon}
                                alt={category.name}
                                className="absolute bottom-3 w-35 h-25 sm:w-[100%] sm:h-[95%] object-contain"
                            />
                        </div>
                        <h3 className="text-center text-xs sm:text-[length:var(--font-size)] mt-1 truncate">
                            {category.name}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    )

    const CircularSummaries = () => (
        <div className="flex items-center justify-center h-[200px] w-full overflow-hidden my-[4rem]">
            <div className="flex flex-row gap-4 sm:gap-10 justify-center items-center flex-nowrap">
                {categ.map((category) => (
                    <div
                        key={category.id}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
                    >
                        <CircularProgressbar 
                            value={(category.adsCount / sum)*100} 
                            text={`${category.name}% ${category.adsCount}+`} 
                            
                        />;
                        
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div className="flex flex-col items-center w-screen min-h-screen gap-6 sm:gap-12 overflow-x-hidden px-3 sm:px-4 ">
            <div
                ref={headerRef}
                className={`w-full top-0 left-0 z-40 ${isSmallScreen && isCondensed ? 'fixed bg-white/90 backdrop-blur-sm' : ''}`}
            >
                <div className={`flex items-center ${isSmallScreen && isCondensed ? 'justify-between px-4 py-2 gap-3' : 'flex-col items-center justify-center gap-8 mt-40'}`}>
                    <h2 className={`${isSmallScreen && isCondensed ? 'text-lg' : 'text-4xl sm:text-6xl'} font-medium text-[var(--dark-def)]`}>Oysloe</h2>
                    <div className={`relative flex items-center ${isSmallScreen && isCondensed ? ' justify-end' : 'justify-center'}`}>
                        <div className="rotating-bg" aria-hidden="true" />
                        <div className="rotating-bg-inner" aria-hidden="true" />
                        <input
                            type="text"
                            placeholder="Search anything up for good"
                            className={`search-input px-1 py-3 ${isSmallScreen && isCondensed ? 'w-75 text-[16px]' : 'w-80 sm:w-120'} h-12 sm:h-14 rounded-full text-2xl outline-0 bg-white`}
                        />
                        <img src="/search.svg" className="absolute top-1/2 left-[-25px] -translate-y-1/2 w-5 h-5 z-10" />
                    </div>

                </div>
            </div>
            <div className="flex flex-col items-center justify-center">
                {selectedCategory && (
                    <div className="flex gap-4 flex-wrap justify-center">
                        <button
                            onClick={handleFilterSettings}
                            className="bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2"
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
                        <button className="bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                            Locations <img src="/location.svg" alt="" className="w-4 h-4" />
                        </button>
                        <button className="bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                            Ad Purpose <img src="/tag.svg" alt="" className="w-4 h-4" />
                        </button>
                        <button className="bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                            Highlight <img src="/highlight.svg" alt="" className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {showFilterPopup && (
                    <ShowFilter />
                )}
                {/* Conditional Content */}
                {selectedCategory ? (
                    /* Category Ads Grid */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                        {pics.map((pic, index) => (
                            <div key={index} className="flex flex-col w-[100%] bg-white overflow-hidden">
                                <Link to={`/ads/${ads[index].id}`} state={{ adData: ads[index] }}>
                                    <img
                                        src={pic}
                                        alt={`${selectedCategory} ${index}`}
                                        className="w-full h-40 sm:h-48 object-cover"
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
                    </div>
                ) : (
                    <>
                        {/* Categories Grid */}
                        <SelectACategory />

                        {/* Circular category summaries */}
                        <CircularSummaries />

                        {/* === Scrollable Ad Sections === */}
                        {[
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
                            <div key={section} className="flex flex-col w-full max-w-6xl mt-6">
                                {/* Section Header */}
                                <div className="flex items-center gap-3 mb-2 px-2">
                                    <h2 className="text-lg sm:text-xl font-semibold">{section}</h2>
                                    <button className="bg-gray-200 px-4 py-1 rounded-full text-sm">Show All</button>
                                    <div className="flex gap-2 ml-auto">
                                        <button
                                            onClick={() => handleArrowClick("left", section.toLowerCase())}
                                            className="bg-gray-200 p-2 rounded-full"
                                        >
                                            <img src="/arrowleft.svg" alt="Left" />
                                        </button>
                                        <button
                                            onClick={() => handleArrowClick("right", section.toLowerCase())}
                                            className="bg-gray-200 p-2 rounded-full"
                                        >
                                            <img src="/arrowright.svg" alt="Right" />
                                        </button>
                                    </div>
                                </div>

                                {/* Horizontally scrollable ads */}
                                <div
                                    id={`move-${section.toLowerCase()}`}
                                    className="overflow-x-auto whitespace-nowrap py-3 px-1 no-scrollbar"
                                >
                                    <div className="flex gap-3">
                                        {pics.map((pic, index) => (
                                            <Link
                                                key={index}
                                                to={`/ads/${ads[index].id}`}
                                                state={{ adData: ads[index] }}
                                                className="inline-block bg-white rounded overflow-hidden flex-shrink-0 w-40 sm:w-48"
                                            >
                                                <img
                                                    src={pic}
                                                    alt={`${section} ${index}`}
                                                    className="w-full h-40 sm:h-48 object-cover rounded-2xl"
                                                />
                                                <div className="flex items-center gap-1 px-2 py-1">
                                                    <img src="/location.svg" alt="" className="w-4 h-4" />
                                                    <p className="text-[10px] sm:text-xs text-gray-500">{ads[index].location}</p>
                                                </div>
                                                <p className="px-2 text-sm line-clamp-1 text-gray-500">{ads[index].title}</p>
                                                <p className="px-2 text-sm font-medium text-gray-500">{ads[index].price}</p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
            <div className="h-16" />
            <MenuButton />
        </div>
    );
};

export default HomePage;
import { useState } from "react";
import { Link } from "react-router";
import MenuButton from "../components/MenuButton";

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
        { id: 10, name: "Services", icon: "services.png", adsCount: 20 }
    ];

    const categ = [
        { id: 1, name: "Electronics", icon: "electronics.png", adsCount: 120 },
        { id: 2, name: "Furniture", icon: "furniture.png", adsCount: 80 },
        { id: 3, name: "Vehicles", icon: "vehicle.png", adsCount: 60 },
        { id: 4, name: "Industry", icon: "industrial.png", adsCount: 40 },
        { id: 5, name: "Fashion", icon: "fashion.png", adsCount: 100 },
    ];
    const pics: string[] = [];
    for (let i = 1; i <= 10; i++) {
        pics.push("https://picsum.photos/200");
    }

    const ads = [
        { id: 1, location: "Accra", title: "Smartphone for sale", price: "GHc 500" },
        { id: 2, location: "Kumasi", title: "Car", price: "GHc 300 for 6days" },
        { id: 3, location: "Takoradi", title: "Laptop", price: "GHc 800" },
        { id: 4, location: "Cape Coast", title: "Bike", price: "GHc 150 for 3days" },
        { id: 5, location: "Tamale", title: "Headphones", price: "GHc 200" },
        { id: 6, location: "Ho", title: "Tablet", price: "GHc 400" },
        { id: 7, location: "Tema", title: "Camera", price: "GHc 600" },
        { id: 8, location: "Obuasi", title: "Smartwatch", price: "GHc 250" },
        { id: 9, location: "Sunyani", title: "Printer", price: "GHc 250 GHc 250 GHc 250" },
        { id: 10, location: "Wa", title: "Monitor", price: "GHc 450" }
    ]

    let sum = 0;
    for (const category of categories) {
        sum += category.adsCount;
    }

    const handleArrowClick = (direction: 'left' | 'right', id: string) => {
        const container = document.querySelector(`#move-${id}`) as HTMLElement | null;
        if (container) {
            const scrollAmount = container.clientWidth;
            if (direction === 'left') {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    }

    const handleCategoryClick = (categoryName: string) => {
        setSelectedCategory(categoryName);
    }

    const handleBackToHome = () => {
        setSelectedCategory(null);
    }

    const handleFilterSettings = () => {
        setShowFilterPopup(true);
    }

    const closeFilterPopup = () => {
        setShowFilterPopup(false);
    }

    return (
        <div className="flex flex-col items-center w-screen min-h-screen p-6 gap-6 sm:p-25 sm:gap-12 overflow-x-auto">
            <div className="flex flex-col items-center justify-center gap-10">
                <h2 className="text-6xl mt-8 sm:mt-[calc(100vh-34rem)] m-4">Oysloe</h2>
                <div className="relative flex items-center justify-center w-full">
                    <input type="text" placeholder="Search anything up for good" className="px-6 py-3 w-11/12 sm:w-120 h-12 sm:h-18 bg-[18px_center] bg-[length:24px_24px] bg-no-repeat bg-[url('/search.svg')] rounded-full text-2xl focus:border-gray-400 outline-0 relative bg-white" />
                    <div className="absolute w-11/12 sm:w-120.5 h-12 sm:h-18.5 bg-gradient-to-r from-green-400 via-yellow-500 to-red-500 rounded-full opacity-30 animate-pulse -z-10"></div>
                </div>
            </div>

            {/* Filter Tags - Show only when category is selected */}
            {selectedCategory && (
                <div className="flex gap-4 flex-wrap justify-center">
                    <button onClick={handleFilterSettings} className="bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        Categories
                        <img onClick={(e) => { e.stopPropagation(); handleBackToHome() }} src="/cancel.svg" alt="" className="w-4 h-4" />
                    </button>
                    <button className="bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        Locations
                        <img src="/location.svg" alt="" className="w-4 h-4" />
                    </button>
                    <button className="bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        Ad Purpose
                        <img src="/tag.svg" alt="" className="w-4 h-4" />
                    </button>
                    <button className="bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                        Highlight
                        <img src="/highlight.svg" alt="" className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Filter Popup */}
            {showFilterPopup && (
                <div className="fixed inset-0 bg-[#4c4a4ab8] flex items-center justify-center z-50">
                    <div className="bg-white rounded-4xl w-120 max-h-120 flex flex-col justify-center">
                        <div className="flex pt-5 px-5 flex-col gap-4 mb-2">
                            <button onClick={closeFilterPopup} className="text-gray-500 hover:text-gray-700">
                                <img src="/close.svg" alt="Close" className="p-2 w-12 h-12" />
                            </button>
                            <h3 className="bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2 w-fit">Category</h3>
                        </div>
                        <hr className="border-gray-300" />
                        <div className="flex flex-wrap p-2 gap-3">
                            {categories.map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-center gap-4 p-3 w-fit bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="category"
                                        id={`custom-radio-${category.id}`}
                                        value={category.name}
                                        checked={selectedCategory === category.name}
                                        onChange={() => setSelectedCategory(category.name)}
                                        required
                                        className="peer relative h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-400 checked:bg-[url('/check.svg')] checked:bg-center checked:bg-no-repeat checked:bg-[length:18px_18px]"
                                    />
                                    <span className="text-sm ml-2">{category.name}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex justify-center mb-5 w-full">
                            <button className="text-lg font-bold flex items-center gap-2 p-3 px-8 w-fit bg-gray-100 rounded-lg hover:bg-gray-200 ">Search</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Conditional Content */}
            {selectedCategory ? (
                /* Category Ads Grid */
                <div className="grid grid-cols-4 gap-6 w-9/10">
                    {pics.map((pic, index) => (
                        <div key={index} className="flex flex-col">
                            <Link to={`/ads/${ads[index].id}`} state={{ adData: ads[index] }}>
                                <img src={pic} alt={`${selectedCategory} ${index}`} className="w-full h-48 object-cover rounded" />
                                <div className="flex items-center justify-start px-1 w-full bg-white mt-2">
                                    <img src="/location.svg" alt="" className="w-4 h-2.5" />
                                    <p className="text-xs text-black">{ads[index].location}</p>
                                </div>
                                <p className="px-2 text-sm text-black">{ads[index].title}</p>
                                <p className="px-2 text-sm font-semibold text-black">{ads[index].price}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                /* Original Homepage Content */
                <>
                    <div className="w-full sm:w-4/7 mt-3">
                        {/* Force 5 columns on all sizes; make tiles compact on very small screens */}
                        <div className="grid grid-cols-4 gap-2 sm:gap-4">
                            {categories.map((category) => (
                                <div key={category.id} onClick={() => handleCategoryClick(category.name)} className="flex flex-col items-center justify-center w-full sm:w-32 sm:h-32 gap-1 bg-[#f3f4f6b5] rounded-lg p-2 sm:p-3 cursor-pointer hover:bg-gray-300">
                                    <img src={category.icon} alt={category.name} className="w-8 h-8 sm:w-14 sm:h-14 p-1 sm:p-2 bg-white rounded-full object-contain" />
                                    <h3 className="text-center text-xs sm:text-sm truncate">{category.name}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center justify-center w-full sm:w-5/7">
                        <div className="grid place-items-center grid-cols-2 sm:grid-cols-5 gap-x-6 sm:gap-x-10 template-columns-5 auto-cols-fr">
                            {categ.map((category) => (
                                <div key={category.id} className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-4 mt-15">
                                    <div className="absolute inset-0 rounded-full"
                                        style={{ background: `conic-gradient(#1e2939 calc(${category.adsCount} / ${sum} * 100%), #e2e8f0 0deg)` }}
                                    ></div>
                                    <div className="absolute w-20 h-20 bg-white rounded-full"></div>
                                    <div className="relative z-10 text-xl font-bold text-gray-800 flex flex-col items-center justify-center">
                                        <h2 className="text-sm font-light">{category.name}</h2>
                                        <p>{category.adsCount}+</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-full sm:w-7/10">
                        <div className="flex items-center">
                            <h2>Electronics</h2>
                            <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                            <div className="flex gap-4 ml-auto">
                                <button onClick={() => handleArrowClick('left', 'electro')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowleft.svg" alt="Arrow Left" /></button>
                                <button onClick={() => handleArrowClick('right', 'electro')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowright.svg" alt="Arrow Right" /></button>
                            </div>
                        </div>
                        <div id="move-electro" className="overflow-x-hidden whitespace-nowrap py-4">
                            {pics.map((pic, index) => (
                                <div key={index} className="inline-block ">
                                    <Link to={`/ads/${ads[index].id}`} state={{ adData: ads[index] }}>
                                        <img key={index} src={pic} alt={`Random ${index}`} className="w-40 h-40 sm:w-48 sm:h-48 object-cover mx-2 inline-block rounded" />
                                        <div className="flex items-center justify-start px-1 w-48 bg-white">
                                            <img src="/location.svg" alt="" className="w-4 h-2.5" />
                                            <p className="text-center text-[8px] h-3 text-black">{ads[index].location}</p>
                                        </div>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].title}</p>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].price}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-full sm:w-7/10">
                        <div className="flex items-center">
                            <h2>Furniture</h2>
                            <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                            <div className="flex gap-4 ml-auto">
                                <button onClick={() => handleArrowClick('left', 'furniture')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowleft.svg" alt="Arrow Left" /></button>
                                <button onClick={() => handleArrowClick('right', 'furniture')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowright.svg" alt="Arrow Right" /></button>
                            </div>
                        </div>
                        <div id="move-furniture" className="overflow-x-hidden whitespace-nowrap py-4">
                            {pics.map((pic, index) => (
                                <div key={index} className="inline-block">
                                    <Link to={`/ads/${ads[index].id}`} state={{ adData: ads[index] }}>
                                        <img key={index} src={pic} alt={`Random ${index}`} className="w-40 h-40 sm:w-48 sm:h-48 object-cover mx-2 inline-block rounded" />
                                        <div className="flex items-center justify-start px-1 w-48 bg-white">
                                            <img src="/location.svg" alt="" className="w-4 h-2.5" />
                                            <p className="text-center text-[8px] h-3 text-black">{ads[index].location}</p>
                                        </div>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].title}</p>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].price}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-7/10">
                        <div className="flex items-center">
                            <h2>Vehicles</h2>
                            <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                            <div className="flex gap-4 ml-auto">
                                <button onClick={() => handleArrowClick('left', 'vehicles')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowleft.svg" alt="Arrow Left" /></button>
                                <button onClick={() => handleArrowClick('right', 'vehicles')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowright.svg" alt="Arrow Right" /></button>
                            </div>
                        </div>
                        <div id="move-vehicles" className="overflow-x-hidden whitespace-nowrap py-4">
                            {pics.map((pic, index) => (
                                <div key={index} className="inline-block">
                                    <Link to={`/ads/${ads[index].id}`} state={{ adData: ads[index] }}>
                                        <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                                        <div className="flex items-center justify-start px-1 w-48 bg-white">
                                            <img src="/location.svg" alt="" className="w-4 h-2.5" />
                                            <p className="text-center text-[8px] h-3 text-black">{ads[index].location}</p>
                                        </div>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].title}</p>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].price}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-7/10">
                        <div className="flex items-center">
                            <h2>Industry</h2>
                            <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                            <div className="flex gap-4 ml-auto">
                                <button onClick={() => handleArrowClick('left', 'industry')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowleft.svg" alt="Arrow Left" /></button>
                                <button onClick={() => handleArrowClick('right', 'industry')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowright.svg" alt="Arrow Right" /></button>
                            </div>
                        </div>
                        <div id="move-industry" className="overflow-x-hidden whitespace-nowrap py-4">
                            {pics.map((pic, index) => (
                                <div key={index} className="inline-block">
                                    <Link to={`/ads/${ads[index].id}`} state={{ adData: ads[index] }}>
                                        <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                                        <div className="flex items-center justify-start px-1 w-48 bg-white">
                                            <img src="/location.svg" alt="" className="w-4 h-2.5" />
                                            <p className="text-center text-[8px] h-3 text-black">{ads[index].location}</p>
                                        </div>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].title}</p>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].price}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-7/10">
                        <div className="flex items-center">
                            <h2>Fashion</h2>
                            <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                            <div className="flex gap-4 ml-auto">
                                <button onClick={() => handleArrowClick('left', 'fashion')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowleft.svg" alt="Arrow Left" /></button>
                                <button onClick={() => handleArrowClick('right', 'fashion')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowright.svg" alt="Arrow Right" /></button>
                            </div>
                        </div>
                        <div id="move-fashion" className="overflow-x-hidden whitespace-nowrap py-4">
                            {pics.map((pic, index) => (
                                <div key={index} className="inline-block">
                                    <Link to={`/ads/${ads[index].id}`} state={{ adData: ads[index] }}>
                                        <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                                        <div className="flex items-center justify-start px-1 w-48 bg-white">
                                            <img src="/location.svg" alt="" className="w-4 h-2.5" />
                                            <p className="text-center text-[8px] h-3 text-black">{ads[index].location}</p>
                                        </div>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].title}</p>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].price}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-7/10">
                        <div className="flex items-center">
                            <h2>Grocery</h2>
                            <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                            <div className="flex gap-4 ml-auto">
                                <button onClick={() => handleArrowClick('left', 'grocery')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowleft.svg" alt="Arrow Left" /></button>
                                <button onClick={() => handleArrowClick('right', 'grocery')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowright.svg" alt="Arrow Right" /></button>
                            </div>
                        </div>
                        <div id="move-grocery" className="overflow-x-hidden whitespace-nowrap py-4">
                            {pics.map((pic, index) => (
                                <div key={index} className="inline-block">
                                    <Link to={`/ads/${ads[index].id}`} state={{ adData: ads[index] }}>
                                        <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                                        <div className="flex items-center justify-start px-1 w-48 bg-white">
                                            <img src="/location.svg" alt="" className="w-4 h-2.5" />
                                            <p className="text-center text-[8px] h-3 text-black">{ads[index].location}</p>
                                        </div>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].title}</p>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].price}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-7/10">
                        <div className="flex items-center">
                            <h2>Games</h2>
                            <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                            <div className="flex gap-4 ml-auto">
                                <button onClick={() => handleArrowClick('left', 'games')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowleft.svg" alt="Arrow Left" /></button>
                                <button onClick={() => handleArrowClick('right', 'games')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowright.svg" alt="Arrow Right" /></button>
                            </div>
                        </div>
                        <div id="move-games" className="overflow-x-hidden whitespace-nowrap py-4">
                            {pics.map((pic, index) => (
                                <div key={index} className="inline-block">
                                    <Link to={`/ads/${ads[index].id}`} state={{ adData: ads[index] }}>
                                        <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                                        <div className="flex items-center justify-start px-1 w-48 bg-white">
                                            <img src="/location.svg" alt="" className="w-4 h-2.5" />
                                            <p className="text-center text-[8px] h-3 text-black">{ads[index].location}</p>
                                        </div>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].title}</p>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].price}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-7/10">
                        <div className="flex items-center">
                            <h2>Cosmetics</h2>
                            <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                            <div className="flex gap-4 ml-auto">
                                <button onClick={() => handleArrowClick('left', 'cosmetics')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowleft.svg" alt="Arrow Left" /></button>
                                <button onClick={() => handleArrowClick('right', 'cosmetics')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowright.svg" alt="Arrow Right" /></button>
                            </div>
                        </div>
                        <div id="move-cosmetics" className="overflow-x-hidden whitespace-nowrap py-4">
                            {pics.map((pic, index) => (
                                <div key={index} className="inline-block">
                                    <Link to={`/ads/${ads[index].id}`} state={{ adData: ads[index] }}>
                                        <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                                        <div className="flex items-center justify-start px-1 w-48 bg-white">
                                            <img src="/location.svg" alt="" className="w-4 h-2.5" />
                                            <p className="text-center text-[8px] h-3 text-black">{ads[index].location}</p>
                                        </div>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].title}</p>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].price}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col w-7/10">
                        <div className="flex items-center">
                            <h2>Property</h2>
                            <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                            <div className="flex gap-4 ml-auto">
                                <button onClick={() => handleArrowClick('left', 'property')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowleft.svg" alt="Arrow Left" /></button>
                                <button onClick={() => handleArrowClick('right', 'property')} className="bg-gray-200 p-2 rounded-full"><img src="/arrowright.svg" alt="Arrow Right" /></button>
                            </div>
                        </div>
                        <div id="move-property" className="overflow-x-hidden whitespace-nowrap py-4">
                            {pics.map((pic, index) => (
                                <div key={index} className="inline-block">
                                    <Link to={`/ads/${ads[index].id}`} state={{ adData: ads[index] }}>
                                        <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                                        <div className="flex items-center justify-start px-1 w-48 bg-white">
                                            <img src="/location.svg" alt="" className="w-4 h-2.5" />
                                            <p className="text-center text-[8px] h-3 text-black">{ads[index].location}</p>
                                        </div>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].title}</p>
                                        <p className="px-2 text-sm line-clamp-2  w-48 h-5 text-black">{ads[index].price}</p>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
            <MenuButton />
        </div>
    );
}

export default HomePage;
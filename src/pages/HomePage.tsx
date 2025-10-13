import { useState } from "react";
import { Link } from "react-router";
import MenuButton from "../components/MenuButton";

import "../App.css"

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

  let sum = categories.reduce((acc, c) => acc + c.adsCount, 0);

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

  return (
    <div className="flex flex-col items-center w-full min-h-screen px-4 sm:px-10 gap-6 sm:gap-12 overflow-x-hidden">
      <div className="flex flex-col items-center justify-center gap-8 mt-8">
        <h2 className="text-4xl sm:text-6xl font-semibold">Oysloe</h2>

        <div className="relative flex items-center justify-center w-full max-w-xl">
          <input
            type="text"
            placeholder="Search anything up for good"
            className="px-6 py-3 w-full h-12 bg-[18px_center] bg-[length:24px_24px] bg-no-repeat bg-[url('/search.svg')] rounded-full text-base sm:text-2xl focus:border-gray-400 outline-0 bg-white"
          />
          <div className="absolute w-full h-12 bg-gradient-to-r from-green-400 via-yellow-500 to-red-500 rounded-full opacity-30 animate-pulse -z-10"></div>
        </div>
      </div>
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
        <div className="fixed inset-0 bg-[#4c4a4ab8] flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-11/12 max-w-lg max-h-[90vh] overflow-y-auto p-5">
            <button onClick={closeFilterPopup} className="self-end text-gray-500 hover:text-gray-700">
              <img src="/close.svg" alt="Close" className="p-2 w-10 h-10" />
            </button>
            <h3 className="bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2 w-fit mb-4">
              Category
            </h3>
            <div className="flex flex-wrap p-2 gap-3">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 p-3 w-fit bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.name}
                    checked={selectedCategory === category.name}
                    onChange={() => setSelectedCategory(category.name)}
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-400 checked:bg-[url('/check.svg')] checked:bg-center checked:bg-no-repeat checked:bg-[length:18px_18px]"
                  />
                  <span className="text-sm ml-2">{category.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <button className="text-lg font-bold px-8 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                Search
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Conditional Content */}
      {selectedCategory ? (
        /* Category Ads Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-6xl">
          {pics.map((pic, index) => (
            <div key={index} className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
              <Link to={`/ads/${ads[index].id}`} state={{ adData: ads[index] }}>
                <img
                  src={pic}
                  alt={`${selectedCategory} ${index}`}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <div className="flex items-center gap-1 px-2 py-1">
                  <img src="/location.svg" alt="" className="w-4 h-4" />
                  <p className="text-xs text-black">{ads[index].location}</p>
                </div>
                <p className="px-2 text-sm truncate text-black">{ads[index].title}</p>
                <p className="px-2 text-sm font-semibold text-black">{ads[index].price}</p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Categories Grid */}
          <div className="w-full max-w-6xl mt-3">
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3 sm:gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.name)}
                  className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-gray-300 transition"
                >
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="w-10 h-10 sm:w-14 sm:h-14 p-2 bg-white rounded-full object-contain"
                  />
                  <h3 className="text-center text-xs sm:text-sm mt-1 truncate">
                    {category.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Circular category summaries */}
          <div className="flex items-center justify-center w-full overflow-hidden">
            <div className="grid place-items-center grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-10">
              {categ.map((category) => (
                <div
                  key={category.id}
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
                >
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(#1e2939 calc(${category.adsCount} / ${sum} * 100%), #e2e8f0 0deg)`,
                    }}
                  ></div>
                  <div className="absolute w-[90%] h-[90%] bg-white rounded-full"></div>
                  <div className="relative z-10 text-center text-gray-800">
                    <h2 className="text-xs sm:text-sm font-light">{category.name}</h2>
                    <p className="text-sm sm:text-base font-semibold">{category.adsCount}+</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                      className="inline-block bg-white rounded-lg shadow-sm overflow-hidden flex-shrink-0 w-40 sm:w-48"
                    >
                      <img
                        src={pic}
                        alt={`${section} ${index}`}
                        className="w-full h-40 sm:h-48 object-cover"
                      />
                      <div className="flex items-center gap-1 px-2 py-1">
                        <img src="/location.svg" alt="" className="w-4 h-4" />
                        <p className="text-[10px] sm:text-xs text-black">{ads[index].location}</p>
                      </div>
                      <p className="px-2 text-sm line-clamp-2 text-black">{ads[index].title}</p>
                      <p className="px-2 text-sm font-semibold text-black">{ads[index].price}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </>
      )}

      <MenuButton />
    </div>
  );
};

export default HomePage;

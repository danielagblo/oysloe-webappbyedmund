const HomePage = () => {
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

    const pics: string[] = [];
    for (let i = 1; i <= 10; i++) {
        pics.push("https://picsum.photos/200");
    }

    let sum = 0;
    for (const category of categories) {
        sum += category.adsCount;
    }

    const handleArrowClick = (direction: 'left' | 'right', id: string) => {
        const container = document.querySelector(`#move-${id}`) as HTMLElement | null;
        if (container) {
            const scrollAmount = container.clientWidth; // Amount to scroll
            if (direction === 'left') {
                console.log('left');
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                console.log('right', scrollAmount);
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    }


    console.log(sum);
    return (
        <div className="flex flex-col items-center w-screen h-screen p-15 gap-12 overflow-x-auto">
            <div className="flex flex-col items-center justify-center">
                <h2 className="text-4xl m-4">Oysloe</h2>
                <div className="relative flex items-center justify-center">
                    <input type="text" placeholder="Search anything up for good" className="px-10 py-4 w-84 h-14 bg-[12px_center] bg-[length:18px_18px] bg-no-repeat bg-[url('/search.svg')] rounded-full focus:border-gray-400 outline-0 relative bg-white" />
                    {/* animation of colors moving round behind the search bar */}
                    <div className="absolute w-85.5 h-15.5 bg-gradient-to-r from-green-400 via-yellow-500 to-red-500 rounded-full opacity-30 animate-pulse -z-10"></div>
                </div>
            </div>
            <div className="grid place-items-center grid-cols-5 w-5/7 gap-x-0 gap-y-14 template-columns-5 auto-cols-fr">
                {categories.map((category) => (
                    <div key={category.id} className="flex flex-col items-center justify-center">
                        <img src={category.icon} alt={category.name} className="w-12 h-12 object-contain" />
                        <h3 className="text-center">{category.name}</h3>
                    </div>
                ))}
            </div>
            <div className="flex items-center justify-center w-5/7">
                {/* show circle for each category revealing the number of ads and name */}
                <div className="grid place-items-center grid-cols-5 gap-x-10 template-columns-5 auto-cols-fr">
                    {/* <!-- Outer ring for the pie chart --> */}
                    {categories.map((category) => (
                        <div key={category.id} className="relative w-24 h-24 rounded-full flex items-center justify-center mb-4">
                            <div className="absolute inset-0 rounded-full"
                                style={{ background: `conic-gradient(#1e2939 calc(${category.adsCount} / ${sum} * 100%), #e2e8f0 0deg)` }}
                            ></div>
                            {/* <!-- Inner ring for the hole to create a donut chart --> */}
                            <div className="absolute w-20 h-20 bg-white rounded-full"></div>

                            {/* <!-- Number in the center --> */}
                            <div className="relative z-10 text-xl font-bold text-gray-800 flex flex-col items-center justify-center">
                                <h2 className="text-sm font-light">{category.name}</h2>
                                <p>{category.adsCount}+</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col w-7/10">
                <div className="flex items-center">
                    <h2>Electronics</h2>
                    <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                    <div className="flex gap-4 ml-auto">
                        <button onClick={() => handleArrowClick('left', 'electro')} className="bg-gray-200 p-2 rounded-full"><img src="arrowleft.svg" alt="Arrow Left" /></button>
                        <button onClick={() => handleArrowClick('right', 'electro')} className="bg-gray-200 p-2 rounded-full"><img src="arrowright.svg" alt="Arrow Right" /></button>
                    </div>
                </div>
                <div id="move-electro" className="overflow-x-hidden whitespace-nowrap py-4">
                    {pics.map((pic, index) => (
                        <div key={index} className="inline-block">
                            <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                            <div className="flex items-center justify-start px-1 w-48 bg-white">
                                <img src="location.svg" alt="" className="w-4 h-2.5" />
                                <p className="text-center text-[8px] h-3">Accra</p>
                            </div>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">Six bedroom apartment</p>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">GHc 2,000 for 6days</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col w-7/10">
                <div className="flex items-center">
                    <h2>Furniture</h2>
                    <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                    <div className="flex gap-4 ml-auto">
                        <button onClick={() => handleArrowClick('left', 'furniture')} className="bg-gray-200 p-2 rounded-full"><img src="arrowleft.svg" alt="Arrow Left" /></button>
                        <button onClick={() => handleArrowClick('right', 'furniture')} className="bg-gray-200 p-2 rounded-full"><img src="arrowright.svg" alt="Arrow Right" /></button>
                    </div>
                </div>
                <div id="move-furniture" className="overflow-x-hidden whitespace-nowrap py-4">
                    {pics.map((pic, index) => (
                        <div key={index} className="inline-block">
                            <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                            <div className="flex items-center justify-start px-1 w-48 bg-white">
                                <img src="location.svg" alt="" className="w-4 h-2.5" />
                                <p className="text-center text-[8px] h-3">Accra</p>
                            </div>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">Six bedroom apartment</p>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">GHc 2,000 for 6days</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col w-7/10">
                <div className="flex items-center">
                    <h2>Vehicles</h2>
                    <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                    <div className="flex gap-4 ml-auto">
                        <button onClick={() => handleArrowClick('left', 'vehicles')} className="bg-gray-200 p-2 rounded-full"><img src="arrowleft.svg" alt="Arrow Left" /></button>
                        <button onClick={() => handleArrowClick('right', 'vehicles')} className="bg-gray-200 p-2 rounded-full"><img src="arrowright.svg" alt="Arrow Right" /></button>
                    </div>
                </div>
                <div id="move-vehicles" className="overflow-x-hidden whitespace-nowrap py-4">
                    {pics.map((pic, index) => (
                        <div key={index} className="inline-block">
                            <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                            <div className="flex items-center justify-start px-1 w-48 bg-white">
                                <img src="location.svg" alt="" className="w-4 h-2.5" />
                                <p className="text-center text-[8px] h-3">Accra</p>
                            </div>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">Six bedroom apartment</p>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">GHc 2,000 for 6days</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col w-7/10">
                <div className="flex items-center">
                    <h2>Industry</h2>
                    <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                    <div className="flex gap-4 ml-auto">
                        <button onClick={() => handleArrowClick('left', 'industry')} className="bg-gray-200 p-2 rounded-full"><img src="arrowleft.svg" alt="Arrow Left" /></button>
                        <button onClick={() => handleArrowClick('right', 'industry')} className="bg-gray-200 p-2 rounded-full"><img src="arrowright.svg" alt="Arrow Right" /></button>
                    </div>
                </div>
                <div id="move-industry" className="overflow-x-hidden whitespace-nowrap py-4">
                    {pics.map((pic, index) => (
                        <div key={index} className="inline-block">
                            <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                            <div className="flex items-center justify-start px-1 w-48 bg-white">
                                <img src="location.svg" alt="" className="w-4 h-2.5" />
                                <p className="text-center text-[8px] h-3">Accra</p>
                            </div>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">Six bedroom apartment</p>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">GHc 2,000 for 6days</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col w-7/10">
                <div className="flex items-center">
                    <h2>Fashion</h2>
                    <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                    <div className="flex gap-4 ml-auto">
                        <button onClick={() => handleArrowClick('left', 'fashion')} className="bg-gray-200 p-2 rounded-full"><img src="arrowleft.svg" alt="Arrow Left" /></button>
                        <button onClick={() => handleArrowClick('right', 'fashion')} className="bg-gray-200 p-2 rounded-full"><img src="arrowright.svg" alt="Arrow Right" /></button>
                    </div>
                </div>
                <div id="move-fashion" className="overflow-x-hidden whitespace-nowrap py-4">
                    {pics.map((pic, index) => (
                        <div key={index} className="inline-block">
                            <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                            <div className="flex items-center justify-start px-1 w-48 bg-white">
                                <img src="location.svg" alt="" className="w-4 h-2.5" />
                                <p className="text-center text-[8px] h-3">Accra</p>
                            </div>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">Six bedroom apartment</p>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">GHc 2,000 for 6days</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col w-7/10">
                <div className="flex items-center">
                    <h2>Grocery</h2>
                    <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                    <div className="flex gap-4 ml-auto">
                        <button onClick={() => handleArrowClick('left', 'grocery')} className="bg-gray-200 p-2 rounded-full"><img src="arrowleft.svg" alt="Arrow Left" /></button>
                        <button onClick={() => handleArrowClick('right', 'grocery')} className="bg-gray-200 p-2 rounded-full"><img src="arrowright.svg" alt="Arrow Right" /></button>
                    </div>
                </div>
                <div id="move-grocery" className="overflow-x-hidden whitespace-nowrap py-4">
                    {pics.map((pic, index) => (
                        <div key={index} className="inline-block">
                            <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                            <div className="flex items-center justify-start px-1 w-48 bg-white">
                                <img src="location.svg" alt="" className="w-4 h-2.5" />
                                <p className="text-center text-[8px] h-3">Accra</p>
                            </div>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">Six bedroom apartment</p>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">GHc 2,000 for 6days</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col w-7/10">
                <div className="flex items-center">
                    <h2>Games</h2>
                    <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                    <div className="flex gap-4 ml-auto">
                        <button onClick={() => handleArrowClick('left', 'games')} className="bg-gray-200 p-2 rounded-full"><img src="arrowleft.svg" alt="Arrow Left" /></button>
                        <button onClick={() => handleArrowClick('right', 'games')} className="bg-gray-200 p-2 rounded-full"><img src="arrowright.svg" alt="Arrow Right" /></button>
                    </div>
                </div>
                <div id="move-games" className="overflow-x-hidden whitespace-nowrap py-4">
                    {pics.map((pic, index) => (
                        <div key={index} className="inline-block">
                            <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                            <div className="flex items-center justify-start px-1 w-48 bg-white">
                                <img src="location.svg" alt="" className="w-4 h-2.5" />
                                <p className="text-center text-[8px] h-3">Accra</p>
                            </div>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">Six bedroom apartment</p>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">GHc 2,000 for 6days</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col w-7/10">
                <div className="flex items-center">
                    <h2>Cosmetics</h2>
                    <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                    <div className="flex gap-4 ml-auto">
                        <button onClick={() => handleArrowClick('left', 'cosmetics')} className="bg-gray-200 p-2 rounded-full"><img src="arrowleft.svg" alt="Arrow Left" /></button>
                        <button onClick={() => handleArrowClick('right', 'cosmetics')} className="bg-gray-200 p-2 rounded-full"><img src="arrowright.svg" alt="Arrow Right" /></button>
                    </div>
                </div>
                <div id="move-cosmetics" className="overflow-x-hidden whitespace-nowrap py-4">
                    {pics.map((pic, index) => (
                        <div key={index} className="inline-block">
                            <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                            <div className="flex items-center justify-start px-1 w-48 bg-white">
                                <img src="location.svg" alt="" className="w-4 h-2.5" />
                                <p className="text-center text-[8px] h-3">Accra</p>
                            </div>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">Six bedroom apartment</p>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">GHc 2,000 for 6days</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col w-7/10">
                <div className="flex items-center">
                    <h2>Property</h2>
                    <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                    <div className="flex gap-4 ml-auto">
                        <button onClick={() => handleArrowClick('left', 'property')} className="bg-gray-200 p-2 rounded-full"><img src="arrowleft.svg" alt="Arrow Left" /></button>
                        <button onClick={() => handleArrowClick('right', 'property')} className="bg-gray-200 p-2 rounded-full"><img src="arrowright.svg" alt="Arrow Right" /></button>
                    </div>
                </div>
                <div id="move-property" className="overflow-x-hidden whitespace-nowrap py-4">
                    {pics.map((pic, index) => (
                        <div key={index} className="inline-block">
                            <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                            <div className="flex items-center justify-start px-1 w-48 bg-white">
                                <img src="location.svg" alt="" className="w-4 h-2.5" />
                                <p className="text-center text-[8px] h-3">Accra</p>
                            </div>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">Six bedroom apartment</p>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">GHc 2,000 for 6days</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col w-7/10">
                <div className="flex items-center">
                    <h2>Services</h2>
                    <button className="bg-gray-200 px-4 py-2 rounded-full mx-3">Show All</button>
                    <div className="flex gap-4 ml-auto">
                        <button onClick={() => handleArrowClick('left', 'services')} className="bg-gray-200 p-2 rounded-full"><img src="arrowleft.svg" alt="Arrow Left" /></button>
                        <button onClick={() => handleArrowClick('right', 'services')} className="bg-gray-200 p-2 rounded-full"><img src="arrowright.svg" alt="Arrow Right" /></button>
                    </div>
                </div>
                <div id="move-services" className="overflow-x-hidden whitespace-nowrap py-4">
                    {pics.map((pic, index) => (
                        <div key={index} className="inline-block">
                            <img key={index} src={pic} alt={`Random ${index}`} className="w-48 h-48 object-cover mx-2 inline-block rounded" />
                            <div className="flex items-center justify-start px-1 w-48 bg-white">
                                <img src="location.svg" alt="" className="w-4 h-2.5" />
                                <p className="text-center text-[8px] h-3">Accra</p>
                            </div>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">Six bedroom apartment</p>
                            <p className="px-2 text-sm line-clamp-2  w-48 h-5">GHc 2,000 for 6days</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-2/5 bg-white border-t border-gray-300 flex justify-around items-center h-16 rounded-lg shadow-lg">
                <button><img src="home.svg" alt="" className="w-8 h-6" /> <span className="text-xs text-center">Home</span></button>
                <button><img src="Alert.svg" alt="" className="w-8 h-6" /> <span className="text-xs text-center">Alerts</span></button>
                <button><img src="Post.svg" alt="" className="w-8 h-6" /> <span className="text-xs text-center">Post</span></button>
                <button><img src="inbox.svg" alt="" className="w-8 h-6" /> <span className="text-xs text-center">Inbox</span></button>
                <button><img src="profile.svg" alt="" className="w-8 h-6" /> <span className="text-xs text-center">Profile</span></button>
            </div>
        </div>
    );
}

export default HomePage;

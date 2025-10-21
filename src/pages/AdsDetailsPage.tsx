import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import MenuButton from "../components/MenuButton";
import "../App.css";
import RatingReviews from "../components/RatingsReviews";

const AdsDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const adData = location.state?.adData;

  // mock ads
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
    { id: 10, location: "Wa", title: "Monitor", price: "GHc 450" },
  ];

  const images = [
    "/3d-car-city-street.webp",
    "/3d-car-city-street.webp",
    "/3d-car-city-street.webp",
    "/3d-car-city-street.webp",
  ];

  // navigation 
  const currentId = parseInt(id || "1");
  const currentIndex = ads.findIndex((a) => a.id === currentId);
  const currentAdData = adData || ads[currentIndex];
  const totalAds = ads.length;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevAd = ads[currentIndex - 1];
      navigate(`/ads/${prevAd.id}`, { state: { adData: prevAd } });
    }
  };

  const handleNext = () => {
    if (currentIndex < totalAds - 1) {
      const nextAd = ads[currentIndex + 1];
      navigate(`/ads/${nextAd.id}`, { state: { adData: nextAd } });
    }
  };

  // swipe support
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) { 
                handleNext()
            } else { 
                handlePrevious();
            };
            touchStartX.current = null;
        }
  };

    // mini components
    const MobileHeader = () => (
        <div className="w-[100vw] flex sm:hidden justify-between items-center px-2 py-3 bg-[var(--div-active)] sticky top-0 z-50">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1">
                <img src="/arrowleft.svg" alt="Back" className="w-5 h-5" />
                <span className="text-sm">Back</span>
            </button>
            <h2 className="text-sm font-medium some-gray] rounded-2xl py-1 px-2">
                {currentId}/{totalAds}
            </h2>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                <img src="/flag.svg" alt="" className="w-4 h-4" />
                <span className="text-xs">24</span>
                </div>
                <div className="flex items-center gap-1">
                <img src="/favorited.svg" alt="" className="w-4 h-4" />
                <span className="text-xs">10</span>
                </div>
            </div>
        </div>
    );
    const DesktopHeader = () => (
        <div className="hidden sm:flex bg-white p-2 items-center justify-evenly gap-4 w-full font-light text-xs">
        <div className="flex items-center gap-2">
            <img src="/location.svg" alt="" className="w-3 h-3" />
            <h2 className="text-sm">{currentAdData?.location || "Lashibi, Accra"}</h2>
        </div>
        <div className="flex items-center gap-2">
            <img src="/star.svg" alt="" className="w-3 h-3" />
            <h2 className="text-sm">4.5 20 reviews</h2>
        </div>
        <div className="flex items-center gap-2">
            <img src="/flag.svg" alt="" className="w-3 h-3" />
            <h2 className="text-sm">30</h2>
        </div>
        <div className="flex items-center gap-2">
            <img src="/favorited.svg" alt="" className="w-5 h-5" />
            <h2 className="text-sm">34</h2>
        </div>
        <div className="flex gap-2 ml-auto">
            <button onClick={handlePrevious} className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
            <img src="/arrowleft.svg" alt="" className="w-5 h-5" />
            </button>
            <button onClick={handleNext} className="bg-gray-200 p-2 rounded-full hover:bg-gray-300">
            <img src="/arrowright.svg" alt="" className="w-5 h-5" />
            </button>
        </div>
        </div>
    );
    const ImageGallery = () => (
        <div className="w-full flex justify-center my-4 sm:my-8">
        {/* Desktop */}
        <div className="hidden sm:flex flex-row w-9/10 h-64 gap-1">
            <div className="flex w-full">
            <img src="/3d-car-city-street.webp" alt="" className="object-cover h-auto w-full sm:h-full sm:w-full rounded-lg" />
            </div>
            <div className="flex flex-row flex-wrap gap-1 sm:h-[49.3%] w-0 h-0 sm:w-8/10">
            <img src="/3d-car-city-street.webp" alt="" className="object-cover sm:h-full sm:w-full sm:block hidden rounded-lg" />
            <img src="/3d-car-city-street.webp" alt="" className="object-cover sm:h-full sm:w-full sm:block hidden rounded-lg" />
            </div>
            <div className="flex flex-row flex-wrap gap-1 sm:h-[49.3%] sm:w-8/10">
            <img src="/3d-car-city-street.webp" alt="" className="object-cover sm:h-full sm:w-full sm:block hidden rounded-lg" />
            <img src="/3d-car-city-street.webp" alt="" className="object-cover sm:h-full sm:w-full sm:block hidden rounded-lg" />
            </div>
        </div>

        {/* Mobile */}
        <div
            className="relative w-full max-w-3xl h-64 sm:h-96 overflow-hidden rounded-lg sm:hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <img src={images[currentIndex]} alt="Ad main" className="object-cover w-full h-full" />
            <div onClick={handlePrevious} className="absolute top-0 left-0 w-[30%] h-full z-20" />
            <div onClick={handleNext} className="absolute top-0 right-0 w-[30%] h-full z-20" />
        </div>
        </div>
    );
    const TitleAndPrice = () => (
        <div className="bg-white px-4 sm:px-12 py-2 w-full text-left rounded-lg">
            <div className="flex items-center gap-2">
                <img src="/location.svg" alt="" className="w-3 h-3" />
                <h2 className="text-sm">{currentAdData?.location || "Lashibi, Accra"}</h2>
            </div>
            <h2 className="text-2xl font-medium">{currentAdData?.title || "Covet Hyundai csv salon 2025"}</h2>
            <h2 className="text-xl font-medium">{currentAdData?.price || "₵25,000"}</h2>
        </div>
    );
    const AdDetails = () => (
        <div className=" sm:p-6 pl-2 mb-[2rem] ">
        <h2 className="text-xl font-bold mb-2">Ad Details</h2>
        <ul className="list-disc ml-5 marker:text-black marker:font-extrabold space-y-2 text-sm">
            <li><span className="font-bold">Ad ID&nbsp;</span> {id}</li>
            <li><span className="font-bold">State&nbsp;</span> Brand new</li>
            <li><span className="font-bold">Body Type&nbsp;</span> Sedan</li>
            <li><span className="font-bold">Year&nbsp;</span> 2025</li>
            <li><span className="font-bold">Mileage&nbsp;</span> 0</li>
            <li><span className="font-bold">Color&nbsp;</span> Red</li>
            <li><span className="font-bold">Location&nbsp;</span> {currentAdData?.location || "Accra"}</li>
            <li><span className="font-bold">Model:</span> Covet Hyundai csv salon</li>
        </ul>
        </div>
    );
    const SafetyTips = () => (
        <div className="bg-white sm:bg-[var(--div-active)] sm:p-6 rounded-lg py-1 px-2 pb-5">
            <h2 className="text-xl font-bold mb-2">Safety tips</h2>
            <p className="text-gray-500 mb-3 py-1 px-2 rounded-2xl text-xs bg-[var(--div-active)] sm:bg-white">Follow this tips and report any suspicious activity.</p>
            <ul className="list-disc ml-5 marker:text-black space-y-2 font-bold text-sm">
                <li>Meet in a public place</li>
                <li>Check the vehicle history</li>
                <li>Inspect the vehicle thoroughly</li>
                <li>Don't share personal information</li>
                <li>Trust your instincts</li>
            </ul>
        </div>
    );
    const ActionButtons = () => (
        <div>
            <div className="flex flex-wrap gap-2 mb-1">
                {[
                ["mark as taken.svg", "Mark as taken"],
                ["flag.svg", "Report Ad"],
                ["outgoing call.svg", "Caller 1"],
                ["outgoing call.svg", "Caller 2"],
                ["Make an offer.svg", "Make Offer"],
                ["favorited.svg", "Favorites"],
                ].map(([icon, label]) => (
                <button key={label} className="flex items-center gap-2 p-4 h-5 rounded-lg text-sm bg-[var(--div-active)] sm:bg-white hover:bg-gray-50">
                    <img src={`/${icon}`} alt="" className="w-4 h-4" />
                    <p className="whitespace-nowrap">{label}</p>
                </button>
                ))}
            </div>
        </div>
    );
    const CommentsSection = () => (
        <div className="p-6 w-full rounded-lg -ml-4 sm:ml-0">
            <h2 className="text-2xl font-medium sm:hidden inline">Seller Reviews</h2>
            <h2 className="text-2xl font-medium hidden sm:inline">Comments</h2>
            <div className="mt-5 -ml-4 w-[120%] flex flex-col gap-3">
                {[1, 2, 3].map((comment) => (
                    <div key={comment} className="p-4 last:border-b-0 bg-[var(--div-active)] rounded-lg w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src="/face.svg" alt="" className="w-10 h-10 rounded-lg" />
                                <div className="flex flex-col">
                                    <p className="text-[10px] text-gray-500">1st April</p>
                                    <h3 className="font-semibold">Sandra</h3>
                                    <div className="flex">
                                        <img src="/star.svg" alt="" className="w-3 h-3" />
                                        <img src="/star.svg" alt="" className="w-3 h-3" />
                                        <img src="/star.svg" alt="" className="w-3 h-3" />
                                        <img src="/star.svg" alt="" className="w-3 h-3" />
                                        <img src="/star.svg" alt="" className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button className="flex items-center gap-1 m-2">
                                    <img src="/like.svg" alt="" className="w-5 h-5" />
                                    <h3>Like</h3>
                                </button>
                                <span className="text-sm">20</span>
                            </div>
                        </div>
                        <p className="text-gray-700 text-xs">
                        This is a great car with excellent features. I had a wonderful experience driving it around the city.
                        </p>
                    </div>
                ))}
            </div>
            <div className="flex gap-3 mt-6">
                <button onClick={() => navigate('/reviews')} className="bg-[var(--div-active)] text-[var(--dark-def)] px-6 py-3 rounded-full whitespace-nowrap">Make Review</button>
                <button onClick={() => navigate('/reviews')} className="text-[var(--dark-def)] px-6 py-3 rounded-full bg-[var(--div-active)] whitespace-nowrap">Show reviews</button>
            </div>
        </div>
    );
    const QuickChat = () => (
        <div className="w-full">
            <div className="pt-4 w-full">
                <div className="flex items-center gap-2 mb-3">
                    <img src="/quick chat.svg" alt="" className="w-5 h-5" />
                    <h6 className="font-semibold text-xs">Quick Chat</h6>
                </div>
                <div className="flex flex-wrap flex-row gap-2 mb-4 w-full text-gray-400 sm:text-[var(--dark-def)] font-extralight justify-start">
                    {[
                        "Is this Original?",
                        "Do you have delivery options?",
                        "What is the warranty period?",
                        "Can I see the service history?"
                    ].map((text, i) => (
                        <button
                        key={i}
                        className="px-3 py-2 bg-[var(--div-active)] sm:bg-white rounded text-xs hover:bg-gray-100 whitespace-nowrap w-fit"
                        >
                        {text}
                        </button>
                    ))}
                </div>


                <div className="flex gap-2 w-full">
                    <input
                        type="text"
                        placeholder="Start a chat"
                        style={{ border:"1px solid var(--div-border)" }}
                        className="rounded-2xl px-3 py-3 bg-[url('/send.svg')] bg-[length:20px_20px] bg-[center_right_12px] bg-no-repeat sm:bg-white text-sm w-full sm:border-[var(--dark-def)]"
                    />
                    <button style={{ border:"1px solid var(--div-border)" }} className="p-2 rounded-2xl hover:bg-gray-300 sm:bg-white">
                        <img src="/audio.svg" alt="" className="w-7 h-5" />
                    </button>
                </div>
                <div className="mt-4 space-y-2 text-[10px] inline-flex flex-wrap gap-2 text-gray-600">
                    <div className="flex items-center justify-end relative">
                        <h4 className="bg-[var(--green)] h-fit p-0 pl-1 pr-8 rounded-2xl">Chat is secured</h4>
                        <img src="/lock-on-svgrepo-com.svg" alt="" className="bg-[var(--green)] z-10 rounded-full w-6 h-6 p-1 absolute" />
                    </div>
                    <div className="flex -mt-2 items-center gap-1">
                        <img src="/shield.svg" alt="" className="w-3 h-3" />
                        <h4>Always chat here for Safety reasons!</h4>
                    </div>
                </div>
            </div>
        </div>
    );
    const SellerInfo = () => (
        <div className="sm:mt-4">
            {/* profile bit pc */}
            <div className="hidden sm:flex flex-row gap-4 bg-[var(--div-active)] px-4 py-7 rounded-2xl mb-5">
                <div className="relative">
                    <img src="/face.svg" alt="" className="w-15 h-15 rounded-full" />
                    <img src="/verified.svg" alt="" className="absolute -bottom-1 -right-2 w-8 h-8" />   
                </div>
                <div>
                    <h2 className="text-sm text-gray-500">Jan,2024</h2>
                    <h3 className="font-semibold">Alexander Kowri</h3>
                    <h3 className="text-sm text-gray-600">Total Ads: 2k</h3>
                </div>
            </div>
            {/* store name */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-start gap-2 flex-col">
                    <h4 className="text-xl">ElectroMart Gh Ltd</h4>
                    <div className="flex bg-green-300 px-1 p-0.5 rounded items-center gap-1">
                        <img src="/tick.svg" alt="" className="w-3 h-3" />
                        <span className="text-[10px] text-green-800">High level</span>
                    </div>
                </div>
                <button className="px-2 py-1 rounded text-sm bg-[var(--div-active)]">Seller Ads</button>
            </div>
                
            {/* product slideshow */}
            <div className="flex items-center mb-4 w-full">
                <div className="pt-4 overflow-x-hidden">
                    <div className="relative flex items-center gap-2">
                        <button className="absolute left-1 bg-gray-100 p-1 rounded-full hover:bg-gray-300">
                            <img src="/arrowleft.svg" alt="" className="w-4 h-4" />
                        </button>
                        <div className="flex gap-2 overflow-x-auto flex-1 no-scrollbar">
                            <img src="/fashion.png" alt="" className="bg-[var(--div-active)] w-23 h-23 object-cover rounded flex-shrink-0" />
                            <img src="/games.png" alt="" className="bg-[var(--div-active)] w-23 h-23 object-cover rounded flex-shrink-0" />
                            <img src="/grocery.png" alt="" className="bg-[var(--div-active)] w-23 h-23 object-cover rounded flex-shrink-0" />
                            <img src="/grocery.png" alt="" className="bg-[var(--div-active)] w-23 h-23 object-cover rounded flex-shrink-0" />
                            <img src="/grocery.png" alt="" className="bg-[var(--div-active)] w-23 h-23 object-cover rounded flex-shrink-0" />
                        </div>
                        <button className="absolute right-1 bg-gray-100 p-1 rounded-full hover:bg-gray-300">
                            <img src="/arrowright.svg" alt="" className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* profile bit mobile*/}
            <div className="sm:hidden flex flex-row gap-4 bg-[var(--div-active)] p-4 rounded-2xl mb-5">
                <div className="relative">
                    <img src="/face.svg" alt="" className="w-15 h-15 rounded-full" />
                    <img src="/verified.svg" alt="" className="absolute -bottom-1 -right-2 w-8 h-8" />   
                </div>
                <div>
                    <h2 className="text-sm text-gray-500">Jan,2024</h2>
                    <h3 className="font-semibold">Alexander Kowri</h3>
                    <h3 className="text-sm text-gray-600">Total Ads: 2k</h3>
                </div>
            </div>
        </div>
    );
    const SimilarAds = () => (
        <div className="bg-white sm:bg-[var(--div-active)] p-4 sm:p-6 w-full">
            <h2 className="text-xl font-bold mb-4 px-2">Similar Ads</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 sm:gap-6 w-full">
                {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className="flex flex-col w-full">
                    <img
                        src="/building.svg"
                        className="object-cover w-full h-32 sm:h-40 rounded-2xl"
                        alt="Ad"
                    />
                    <div className="flex items-center justify-start px-1 mt-2">
                        <img src="/location.svg" alt="" className="w-4 h-4" />
                        <p className="text-xs ml-1 text-gray-600">Accra</p>
                    </div>
                    <p className="px-1 text-sm line-clamp-2 mt-1 text-gray-800">
                        Six bedroom apartment
                    </p>
                    <p className="px-1 text-sm font-semibold text-gray-900">
                        GH₵ 2,000 for 6 days
                    </p>
                    </div>
                ))}
            </div>
        </div>
    );


    return (
        
        <div style={{color:"var(--dark-def)"}} className="flex flex-col items-center w-[calc(100%-0.2rem)] sm:w-full min-h-screen px-4 sm:px-12 gap-6 overflow-x-hidden bg-[var(--div-active)] sm:bg-white">

            <MobileHeader  />
            <DesktopHeader />
            <ImageGallery  />
            <TitleAndPrice />

            {/* MAIN CONTENT */}
            <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-evenly gap-4 flex-col md:px-4 ad-details-page">
                    <div className='flex w-full justify-between ad-details-page'>
                        <div className="flex flex-col space-y-6 w-fit md:w-1/2 ad-details-desc">
                            <AdDetails />
                        </div>
                        <div className="flex flex-col space-y-6 w-full md:w-1/2">
                            <SafetyTips />
                        </div>
                    </div>

                    {/* mobile layout */}
                    <div className='sm:hidden flex w-full ad-details-page'>
                        <div className="flex flex-col w-fit space-y-6 md:w-1/2  bg-white p-6 rounded-lg mb-5">
                            <ActionButtons />
                            <QuickChat />
                        </div>
                        <div className="bg-white p-6 rounded-lg w-full">
                            <SellerInfo />
                            <RatingReviews layout='row' fullWidth />
                        </div>
                        
                        <div className="bg-white mt-6 p-6 rounded-lg w-full">
                            <CommentsSection />
                        </div>
                    </div>

                    {/* desktop layout */}
                    <div className=' hidden sm:grid sm:grid-cols-2 gap-1.5 w-full ad-details-page'>
                        <div className="flex flex-col w-full space-y-6 p-6 mb-5">
                            <RatingReviews layout='row'/>
                            <CommentsSection />
                        </div>
                        <div className="p-6 rounded-lg w-full">
                            <div className="sm:bg-[var(--div-active)] w-full p-3 rounded-2xl">
                                <ActionButtons />
                                <QuickChat />
                            </div>
                            <SellerInfo />
                        </div>
                        
                        <div className="bg-white mt-6 p-6 rounded-lg w-full">
                            
                        </div>
                    </div>
                </div>

                <div className="w-[100vw] -ml-4 sm:-ml-12 p-0">
                    <SimilarAds />
                    <div className="p-10 bg-[var(--div-active)]" />
                </div>
            </div>

            <MenuButton />
            
        </div>
    );
};

export default AdsDetailsPage;

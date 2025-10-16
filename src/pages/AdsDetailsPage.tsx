import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MenuButton from '../components/MenuButton';

import "../App.css";

const AdsDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const location = useLocation();
    const navigate = useNavigate();
    const adData = location.state?.adData;

    // Same ads data as HomePage
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
    ];

    const currentId = parseInt(id || '1');

    const handlePrevious = () => {
        if (currentId > 1) {
            const prevAd = ads.find(ad => ad.id === currentId - 1);
            navigate(`/ads/${currentId - 1}`, { state: { adData: prevAd } });
        }
    };

    const handleNext = () => {
        const nextAd = ads.find(ad => ad.id === currentId + 1);
        if (nextAd) {
            navigate(`/ads/${currentId + 1}`, { state: { adData: nextAd } });
        }
    };

    // Get current ad data (from state or fallback to ads array)
    const currentAdData = adData || ads.find(ad => ad.id === currentId);

    return (
        <div className="flex flex-col items-center w-[calc(100%-0.2rem)] h-screen px-4 gap-6 text-gray-600  sm:px-12 ">
            {/* Filter Popup */}
            {/* {makeReviewModalOpen && (
                <div className="fixed inset-0 bg-[#4c4a4ab8] flex items-center justify-center z-50">
                    <div className="bg-white rounded-4xl w-120 max-h-96 flex gap-1 flex-col justify-center">
                        <div className="flex pt-5 px-5 flex-col gap-4 mb-2">
                            <button onClick={() => setMakeReviewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <img src="/close.svg" alt="Close" className="p-2 w-12 h-12" />
                            </button>
                            <h3 className="bg-gray-200 px-4 py-2 rounded-lg text-sm flex items-center gap-2 w-fit">Make A Review</h3>
                        </div>
                        <hr className="border-gray-300" />
                        <div className="flex w-full items-center justify-center gap-2">
                            <img src="/star.svg" alt="" className="w-6 h-6" />
                            <img src="/star.svg" alt="" className="w-6 h-6" />
                            <img src="/star.svg" alt="" className="w-6 h-6" />
                            <img src="/star.svg" alt="" className="w-6 h-6" />
                            <img src="/star.svg" alt="" className="w-6 h-6" />
                        </div>
                        <h2 className="text-center">Excellent</h2>
                        <textarea placeholder='Comment' className='border border-gray-300 rounded-lg p-2 m-2 w-11/12 h-40 resize-none' />
                        <div className="flex justify-center mb-5 w-full">
                            <button className="text-lg font-bold flex items-center gap-2 p-3 px-8 bg-gray-100 rounded-lg hover:bg-gray-200 ">Send Review</button>
                        </div>
                    </div>
                </div>
            )
            } */}
            <div className="w-full flex flex-col items-center gap-1">
                {/* Header Section */}
                <div className="bg-white p-2 flex items-center justify-evenly gap-4 w-9/10 font-light text-xs">
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

                {/* Image Gallery */}
                <div className="flex flex-row w-9/10 h-64 gap-1 ">
                    <div className="flex w-full">
                        <img src="/3d-car-city-street.webp" alt="" className="object-cover h-auto w-full sm:h-full sm:w-full" />
                    </div>
                    <div className="flex flex-row flex-wrap gap-1 sm:h-[49.3%] w-0 h-0 sm:w-8/10">
                        <img src="/3d-car-city-street.webp" alt="" className="object-cover w-0 h-0 sm:h-full sm:w-full sm:block hidden" />
                        <img src="/3d-car-city-street.webp" alt="" className="object-cover w-0 h-0  sm:h-full sm:w-full sm:block hidden" />
                    </div>
                    <div className="flex flex-row flex-wrap gap-1 sm:h-[49.3%] sm:w-8/10">
                        <img src="/3d-car-city-street.webp" alt="" className="object-cover w-0 h-0 sm:h-full sm:w-full sm:block hidden" />
                        <img src="/3d-car-city-street.webp" alt="" className="object-cover w-0 h-0  sm:h-full sm:w-full sm:block hidden" />
                    </div>
                </div>
            </div>
            {/* Title and Price */}
            <div className="bg-white px-12 w-full">
                <h2 className="text-2xl font-medium">{currentAdData?.title || "Covet Hyundai csv salon 2025"}</h2>
                <h2 className="text-xl font-medium px-2">{currentAdData?.price || "₵25,000"}</h2>
            </div>


            {/* Main Content */}
            <div className="flex justify-evenly gap-4 flex-col px-4 w-9/10 ad-details-page">
                <div className='flex w-full justify-between ad-details-page'>
                    <div className="flex flex-col space-y-6 w-fit md:w-1/2 ad-details-desc">
                        {/* Ad Details */}
                        <div className="bg-white p-6 rounded-lg">
                            <h2 className="text-xl font-bold">Ad Details</h2>
                            <ul className="list-disc ml-5 marker:text-gray-400 space-y-2 text-sm">
                                <li><span className="font-medium">Ad ID&nbsp;</span> {id}</li>
                                <li><span className="font-medium">State&nbsp;</span> Brand new</li>
                                <li><span className="font-medium">Body Type&nbsp;</span> Sedan</li>
                                <li><span className="font-medium">Year&nbsp;</span> 2025</li>
                                <li><span className="font-medium">Mileage&nbsp;</span> 0</li>
                                <li><span className="font-medium">Color&nbsp;</span> Red</li>
                                <li><span className="font-medium">Location&nbsp;</span> {currentAdData?.location || "Accra"}</li>
                                <li><span className="font-medium">Model:</span> Covet Hyundai csv salon</li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex flex-col space-y-6 w-fit md:w-1/2 ad-details-desc">
                        {/* Safety Tips */}
                        <div className="bg-white p-6 rounded-lg">
                            <h2 className="text-xl font-bold mb-2">Safety tips</h2>
                            <p className="text-gray-600 mb-4">Follow this tips and report any suspicious activity.</p>
                            <ul className="list-disc ml-5 marker:text-gray-400 space-y-2 text-sm">
                                <li>Meet in a public place</li>
                                <li>Check the vehicle history</li>
                                <li>Inspect the vehicle thoroughly</li>
                                <li>Don't share personal information</li>
                                <li>Trust your instincts</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='flex w-full ad-details-page'>
                    <div className="flex flex-col w-fit space-y-6 md:w-1/2 ">
                        {/* Reviews Section */}
                        <div className="bg-white p-6 gap-7 flex flex-col justify-center items-center  rounded-lg">
                            <div className="flex w-full">
                                <div className="flex items-center flex-col justify-center gap-1">
                                    <span className="text-3xl font-medium p-0">4.5</span>
                                    <div className="flex">
                                        <img src="/star.svg" alt="" className="w-3 h-3" />
                                        <img src="/star.svg" alt="" className="w-3 h-3" />
                                        <img src="/star.svg" alt="" className="w-3 h-3" />
                                        <img src="/star.svg" alt="" className="w-3 h-3" />
                                        <img src="/star.svg" alt="" className="w-3 h-3" />
                                    </div>

                                    <h2 className="text-gray-600 text-[8px]">20 reviews</h2>
                                </div>
                                <div className="space-y-2 w-full ml-6">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <div key={rating} className="flex items-center gap-2">
                                            <img src="/star.svg" alt="" className="w-4 h-4" />
                                            <h3 className="w-4 text-xs">{rating}</h3>
                                            <div className="flex-1 bg-gray-200 rounded-full h-4">
                                                <div className="bg-gray-700 h-4 rounded-full" style={{ width: `${rating * 20}%` }}></div>
                                            </div>
                                            <span className="w-6 text-xs text-gray-600">{rating * 4}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 overflow-x-auto">
                                <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full flex-nowrap">
                                    <img src="/star.svg" alt="" className="w-4 h-4" />All
                                </button>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full">
                                        <img src="/star.svg" alt="" className="w-4 h-4" />{star}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-col w-fit space-y-6 md:w-1/2 ">

                        <div className="bg-white p-6 rounded-lg">
                            <div className="inline-flex flex-wrap  gap-2 mb-4">
                                <button className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm bg-gray-100">
                                    <img src="/mark as taken.svg" alt="" className="w-4 h-4" />Mark as taken
                                </button>
                                <button className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm bg-gray-100">
                                    <img src="/flag.svg" alt="" className="w-4 h-4" />Report Ad
                                </button>
                                <button className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm bg-gray-100">
                                    <img src="/outgoing call.svg" alt="" className="w-4 h-4" />Caller 1
                                </button>
                                <button className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm bg-gray-100">
                                    <img src="/outgoing call.svg" alt="" className="w-4 h-4" />Caller 2
                                </button>
                                <button className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm bg-gray-100">
                                    <img src="/Make an offer.svg" alt="" className="w-4 h-4" />Make Offer
                                </button>
                                <button className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm bg-gray-100 hover:bg-gray-50">
                                    <img src="/favorited.svg" alt="" className="w-4 h-4" />Favorites
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex w-full ad-details-page'>
                    {/* Comments */}
                    <div className="bg-white p-6 w-fit sm:w-1/2 rounded-lg ads-details-page">
                        <h2 className="text-2xl font-medium">Comments</h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map((comment) => (
                                <div key={comment} className="pb-4 last:border-b-0">
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
                                            <button className="flex items-center gap-1 m-2"><img src="/like.svg" alt="" className="w-5 h-5" /><h3>Like</h3></button>
                                            <span className="text-sm">20</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-700">This is a great car with excellent features. I had a wonderful experience driving it around the city.</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => navigate('/reviews')} className="bg-gray-100 text-gray-600 px-6 py-3 rounded-full">Make Review</button>
                            <button onClick={() => navigate('/reviews')} className=" text-gray-600 px-6 py-3 rounded-full bg-gray-100">Show reviews</button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6 w-fit sm:w-1/2 ">

                        {/* Quick Chat */}
                        <div className="pt-4">
                            <div className="flex items-center gap-2 mb-3">
                                <img src="/quick chat.svg" alt="" className="w-5 h-5" />
                                <h6 className="font-semibold text-xs">Quick Chat</h6>
                            </div>
                            <div className="inline-flex flex-wrap text-gray-400 font-extralight">
                                <button className="w-fit text-left p-2 bg-gray-50 rounded text-sm hover:bg-gray-100">Is this Original?</button>
                                <button className="w-fit text-left p-2 bg-gray-50 rounded text-sm hover:bg-gray-100">Do you have delivery options?</button>
                                <button className="w-fit text-left p-2 bg-gray-50 rounded text-sm hover:bg-gray-100">What is the warranty period?</button>
                                <button className="w-fit text-left p-2 bg-gray-50 rounded text-sm hover:bg-gray-100">Can I see the service history?</button>
                            </div>
                            <div className="flex gap-2 w-full">
                                <input type="text" placeholder="Start a chat" className="border rounded-lg px-3 py-3 bg-[url('/send.svg')] bg-[length:20px_20px] bg-[center_right_12px] bg-no-repeat text-sm w-4/5" />
                                <button className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300">
                                    <img src="/audio.svg" alt="" className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="mt-2 space-y-2 text-[10px] inline-flex flex-wrap gap-2 text-gray-600">
                                <div className="flex items-center justify-end relative">
                                    <h4 className="bg-green-500 h-fit p-0 pl-1 pr-8 rounded-2xl">Chat is secured</h4>
                                    <img src="/lock-on-svgrepo-com.svg" alt="" className="bg-green-500 z-10 rounded-full w-6 h-6 p-1 absolute" />
                                </div>
                                <div className="flex -mt-2 items-center gap-1">
                                    <img src="/shield.svg" alt="" className="w-3 h-3" />
                                    <h4>Always chat here for Safety reasons!</h4>
                                </div>
                            </div>
                        </div>

                        {/* Seller Info */}
                        <div className="bg-white p-6 rounded-lg">
                            <div className="flex items-center gap-3 mb-4 w-full">
                                <div className="relative">
                                    <img src="/face.svg" alt="" className="w-16 h-16 rounded-full" />
                                    <img src="/verified.svg" alt="" className="absolute -bottom-1 -right-2 w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-sm text-gray-500">Jan,2024</h2>
                                    <h3 className="font-semibold">Alexander Kowri</h3>
                                    <h3 className="text-sm text-gray-600">Total Ads: 2k</h3>
                                </div>
                            </div>

                            <div className="pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-start gap-2 flex-col">
                                        <h4 className="text-xl">ElectroMart Gh Ltd</h4>
                                        <div className="flex bg-green-300 px-1 p-0.5 rounded items-center gap-1">
                                            <img src="/tick.svg" alt="" className="w-3 h-3" />
                                            <span className="text-[10px] text-green-800">High level</span>
                                        </div>
                                    </div>
                                    <button className="px-2 py-1 rounded text-sm ">Seller Ads</button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="bg-gray-100 p-1 rounded-full hover:bg-gray-300">
                                        <img src="/arrowleft.svg" alt="" className="w-4 h-4" />
                                    </button>
                                    <div className="flex gap-2 overflow-x-auto flex-1  custom-scroll">
                                        <img src="/fashion.png" alt="" className="w-24 h-24 object-cover rounded flex-shrink-0" />
                                        <img src="/games.png" alt="" className="w-24 h-24 object-cover rounded flex-shrink-0" />
                                        <img src="/grocery.png" alt="" className="w-24 h-24 object-cover rounded flex-shrink-0" />
                                    </div>
                                    <button className="bg-gray-100 p-1 rounded-full hover:bg-gray-300">
                                        <img src="/arrowright.svg" alt="" className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Ads */}
            <div className="bg-white p-6 w-9/10">
                <h2 className="text-xl font-bold m-4">Similar Ads</h2>
                <div>
                    <div className="flex gap-4 pb-4 flex-wrap justify-around">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div key={index} className="flex-shrink-0">
                                <img src="/building.svg" className="w-55 h-55 object-cover rounded-lg" />
                                <div className="flex items-center justify-start px-1 w-48 bg-white mt-2">
                                    <img src="/location.svg" alt="" className="w-4 h-2.5" />
                                    <p className="text-xs ml-1">Accra</p>
                                </div>
                                <p className="px-2 text-sm line-clamp-2 w-48 h-5 mt-1">Six bedroom apartment</p>
                                <p className="px-2 text-sm line-clamp-2 w-48 h-5 font-semibold">GHc 2,000 for 6days</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <MenuButton />
            <div className="p-10" />
        </div >
    );
};

export default AdsDetailsPage;
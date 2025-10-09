import { useState } from "react";
import LottieSuccess from "../components/LottieSuccess";
import MenuButton from "../components/MenuButton";

const ReviewPage = () => {
    const [sendSuccess, setSendSuccess] = useState(false);
    return (
        <div className="flex gap-6 p-4 px-10 justify-evenly h-screen w-screen items-center">
            {
                sendSuccess && (
                    <div className="fixed inset-0 bg-[#4c4a4ab8] flex items-center justify-center z-50">
                        <div className="bg-white rounded-4xl w-96 max-h-96 flex gap-1 flex-col justify-center items-center">
                            <div className="flex flex-col items-center justify-center w-2/5 h-1/5">
                                <LottieSuccess />
                                <h2 className="text-lg font-medium pb-6">Submitted</h2>
                            </div>
                            <button className="bg-gray-100 rounded-full px-4 py-2" onClick={() => setSendSuccess(false)}>Close</button>
                        </div>
                    </div>
                )
            }
            <div className="bg-white rounded-lg w-4/10 h-9/10 overflow-y-auto relative">
                {/* sticky filter bar inside comments panel */}
                <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm px-4 py-3 border-b border-gray-100">
                    <div className="flex gap-2 overflow-x-auto">
                        <button className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full whitespace-nowrap">
                            <img src="/star.svg" alt="" className="w-4 h-4" />All
                        </button>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-full">
                                <img src="/star.svg" alt="" className="w-4 h-4" />{star}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-4">
                    <h2 className="text-2xl font-medium">Comments</h2>
                    <div className="space-y-4 mt-3">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((comment) => (
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
                </div>
            </div>
            <div className=" flex items-center w-4/10 h-9/10 justify-center">
                <div className="rounded-4xl flex items-center flex-col justify-center w-full gap-4">
                    <div className="flex pt-5 px-5 flex-col gap-4 mb-2">
                        <h3 className="text-center">
                            Make A Review
                        </h3>
                    </div>
                    <div className="flex w-full px-12 items-center justify-around">
                        <img src="/star.svg" alt="" className="w-7 h-7" />
                        <img src="/star.svg" alt="" className="w-7 h-7" />
                        <img src="/star.svg" alt="" className="w-7 h-7" />
                        <img src="/star.svg" alt="" className="w-7 h-7" />
                        <img src="/star.svg" alt="" className="w-7 h-7" />
                    </div>
                    <h2 className="text-center">Excellent</h2>
                    <textarea placeholder='Comment' className='border border-gray-300 rounded-lg p-2 mt-20 w-11/12 h-20 resize-none ' />
                    <div className="flex justify-center mb-5 w-full">
                        <button onClick={() => { setSendSuccess(true) }} className="text-lg flex items-center gap-2 p-3 px-8 bg-gray-100 rounded-lg hover:bg-gray-200 ">Send Review</button>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-lg w-2/10 h-9/10 flex flex-col items-center justify-around">
                <div className="flex flex-col items-center gap-2  w-full">
                    <img src="/face.svg" alt="" className="w-24 h-24 border-green-300 border-2 p-2 rounded-full" />
                    <h3 className="font-semibold">Alexander Kowri</h3>
                    <div className="flex flex-col items-center gap-0.5 w-full">
                        <div className="flex px-1 rounded items-center  mr-auto">
                            <img src="/tick.svg" alt="" className="w-1.5 h-1.5" />
                            <span className="text-[6px]">High level</span>
                        </div>
                        <div className="bg-green-300 h-1 w-full px-2"></div>
                    </div>
                    <div className="flex flex-row-reverse w-full text-center justify-around">
                        <div className="flex flex-col-reverse">
                            <h3 className="text-[7px] text-center text-gray-500">Sold Ads</h3><h3>2k</h3>
                        </div>
                        <div className="flex flex-col-reverse ">
                            <h3 className="text-[7px] text-center text-gray-600">Active Ads</h3><h3>2k</h3>
                        </div>
                    </div>
                </div>
                <div className="flex items-center flex-col justify-center gap-1 w-full">
                    <span className="text-3xl text-center font-medium w-full">4.5</span>
                    <div className="flex">
                        <img src="/star.svg" alt="" className="w-3 h-3" />
                        <img src="/star.svg" alt="" className="w-3 h-3" />
                        <img src="/star.svg" alt="" className="w-3 h-3" />
                        <img src="/star.svg" alt="" className="w-3 h-3" />
                        <img src="/star.svg" alt="" className="w-3 h-3" />
                    </div>
                    <h2 className="text-gray-600 text-[8px]">20 reviews</h2>
                    <div className="space-y-2 w-full">
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
            </div>
            <MenuButton />
        </div>
    );
}

export default ReviewPage;

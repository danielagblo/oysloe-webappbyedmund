
import MenuButton from '../components/MenuButton';
import ProfileSidebar from '../components/ProfileSidebar';

const TermsPage = () => {
    return (
        <div className="flex justify-between h-screen w-screen items-center bg-[#f3f4f6]">
            <div className="w-2/14 h-full">
                <ProfileSidebar />
            </div>
            <div className=" md:flex w-full p-3 m-2 h-full overflow-hidden no-scrollbar justify-start hidden">
                <div className="bg-white w-1/2 h-full mt-2 flex flex-col justify-start items-start gap-4 px-3 py-3 rounded-2xl overflow-auto text-xs">
                    <div className="flex pt-5 px-5 flex-col justify-start gap-2 mb-2">
                        <h3 className=" text-2xl">
                            T&C
                        </h3>
                        <h3 className="">
                            Help us improve on our app
                        </h3>
                    </div>
                </div>
            </div>
            <div className=" md:w-1/5 w-full hidden h-full md:flex flex-col items-center justify-around gap-2 mr-3 my-3">
                <div className="flex p-4 bg-white rounded-2xl flex-col items-center gap-2 justify-center w-full h-1/2 show">
                    <img src="/face.svg" alt="" className="w-24 h-24 border-green-300 border-2 p-2 rounded-full" />
                    <div>
                        <h3 className="font-medium text-3xl">Alexander Kowri</h3>
                        <div className="flex flex-col items-center gap-0.5 w-full">
                            <div className="flex px-1 rounded items-center  mr-auto">
                                <img src="/tick.svg" alt="" className="w-1.5 h-1.5" />
                                <span className="text-[6px]">High level</span>
                            </div>
                            <div className="bg-green-300 h-1 w-full px-2"></div>
                        </div>
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
                <div className="flex bg-white rounded-2xl flex-col items-center gap-1 justify-center w-full h-1/2 p-2">
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
                                <div className="flex-1 bg-gray-200 rounded-full h-1">
                                    <div className="bg-gray-700 h-1 rounded-full" style={{ width: `${rating * 20}%` }}></div>
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

export default TermsPage;

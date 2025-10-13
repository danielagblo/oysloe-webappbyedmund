
const ProfileCard = () => {
    return (
        <div className="flex flex-col justify-around items-center bg-white w-2/7 h-1/2 rounded-4xl p-5">
            <img src="/face.svg" alt="" className="w-24 h-auto border-green-300 border-2 p-2 rounded-full" />
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

            <div className="flex flex-row-reverse w-full text-center justify-center gap-3">
                <div className="flex flex-col-reverse w-full bg-gray-100 px-6 py-2 rounded-[8px]">
                    <h3 className="text-[8px] text-center text-gray-500">Sold Ads</h3><h3>2k</h3>
                </div>
                <div className="flex flex-col-reverse w-full bg-gray-100 px-6 py-2 rounded-[8px]">
                    <h3 className="text-[8px] text-center text-gray-600">Active Ads</h3><h3>2k</h3>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard;

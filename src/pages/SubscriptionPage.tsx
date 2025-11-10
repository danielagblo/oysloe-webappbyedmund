import Subscription from "../assets/Subscription.png";

const SubscriptionPage = () => {
  return (
    <div className="flex justify-between h-screen w-screen items-center gap-2 no-scrollbar">
       <div className="flex flex-col lg:flex-row w-full -mt-10 md:mt-4 md:py-3 min-h-0 max-h-[100vh] max-lg:overflow-auto lg:overflow-hidden justify-start gap-4">
        <div className="lg:w-1/2 lg:overflow-y-auto no-scrollbar">
          <div className="w-full md:bg-white md:min-h-[92vh] lg:w-full pt-20 md:mt-0 flex flex-col justify-start items-center gap-4 px-3 md:py-3 rounded-2xl text-xs">
            <div className="flex pt-5 px-5 flex-col justify-start gap-2 mb-2">
              <div className="bg-[var(--div-active)] flex p-4 rounded-2xl justify-between items-center gap-2">
                <div className="w-full flex flex-col justify-start items-start gap-4">
                  <p className="md:text-[1.25rem] max-md:text-[0.8rem]  font-light text-nowrap">
                    You're currently subscribed
                  </p>
                  <div className="flex justify-start items-start gap-4">
                    <p className="font-medium max-md:text-[0.5rem] bg-[#FFECEC] px-1.5 py-0.5">
                      Basic Package
                    </p>
                    <p className="font-medium max-md:text-[0.5rem]">
                      Expires in 30 days
                    </p>
                  </div>
                </div>
                <img src={Subscription} alt="subscription" className="w-[20%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2 `lg:overflow-y-auto no-scrollbar ">
          <div className="bg-white w-full md:min-h-[92vh] mt-2 md:mt-0 flex flex-col justify-start items-center gap-4 h-fit px-3 py-3 md:rounded-2xl text-xs max-lg:mb-10 lg:pb-17">
            <div className="flex pt-5 px-5 flex-col justify-start gap-6 mb-2 w-full">
              <p className="text-center text-gray-500">
                Choose a monthly plan that works for you
              </p>

              {/* <-- keep the card relative so absolute children position to it */}

              <div className="relative bg-[var(--div-active)] rounded-2xl flex flex-col justify-start items-start gap-2 p-4 w-full border-1">
                {/* badge moved INSIDE this relative container */}
                <div className="absolute top-[-10%] right-10 z-10 py-1 px-2 rounded-2xl bg-gray-900 text-white text-center text-xs">
                  For you 50% off
                </div>

                <p className="font-bold">
                  Basic <span className="font-normal">3x</span>
                </p>
                <ul>
                  <li>
                    <span className="font-bold">&#10004; </span><span className="text-gray-500">Share limited number of ads</span>
                  </li>
                  <li>
                    <span className="font-bold">&#10004; </span><span className="text-gray-500">All ads stays promoted for a week</span>
                  </li>
                </ul>
                <div className="flex justify-start items-start gap-4">
                  <p className="font-bold text-sm">₵ 567</p>
                  <p className="text-gray-500">
                    ₵ <span className="line-through"> 567 </span>
                  </p>
                </div>
              </div>

              <div className="relative bg-[var(--div-active)] rounded-2xl flex flex-col justify-start items-start gap-2 p-4 w-full">
                <p className="font-bold">
                  Buisness <span className="font-normal">4x</span>
                </p>
                <ul>
                  <li>
                    <span className="font-bold">&#10004; </span><span className="text-gray-500">Pro partnership status</span>
                  </li>
                  <li>
                    <span className="font-bold">&#10004; </span><span className="text-gray-500">All ads stays promoted for a month</span>
                  </li>
                </ul>
                <div className="flex justify-start items-start gap-4">
                  <p className="font-bold text-sm">₵ 567</p>
                  <p className="text-gray-500">
                    ₵ <span className="line-through"> 567 </span>
                  </p>
                </div>
              </div>

              <div className="relative bg-[var(--div-active)] rounded-2xl flex flex-col justify-start items-start gap-2 p-4 w-full">

                <p className="font-bold">
                  Premium <span className="font-normal">10x</span>
                </p>
                <ul>
                  <li>
                    <span className="font-bold">&#10004; </span><span className="text-gray-500">Unlimited number of ads</span>
                  </li>
                  <li>
                    <span className="font-bold">&#10004; </span><span className="text-gray-500">Sell 10x faster in all categories</span>
                  </li>
                </ul>
                <div className="flex justify-start items-start gap-4">
                  <p className="font-bold text-sm">₵ 567</p>
                  <p className="text-gray-500">
                    ₵ <span className="line-through"> 567 </span>
                  </p>
                </div>
              </div>

              {/* badge was previously here (outside the card) which caused the issue */}
              <button className="bg-[var(--div-active)] w-full py-4 rounded text-center mt-[10%] text-[1.1rem]">
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default SubscriptionPage;

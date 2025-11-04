import { useState } from "react";
import MenuButton from "../components/MenuButton";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileStats from "../components/ProfileStats";
import Subscription from "../assets/Subscription.png";
// import MobileBanner from "../components/MobileBanner";

const SubscriptionPage = () => {
  const [activeTab, setActiveTab] = useState("subscription");

  return (
    <div className="flex justify-between h-screen w-screen items-center bg-[#f3f4f6] gap-4">
      <div className="w-1/11 h-full">
        <ProfileSidebar active={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="md:flex w-full p-3 m-0 mr-2 h-full overflow-hidden no-scrollbar justify-center gap-4 hidden">
        <div className="bg-white w-1/2 h-full mt-2 flex flex-col justify-start items-start gap-4 px-3 py-3 rounded-2xl overflow-auto text-xs">
          <div className="flex pt-5 px-5 flex-col justify-start gap-2 mb-2">
            <div className="bg-gray-50 flex p-4 rounded-2xl justify-between items-center gap-2">
              <div className="w-full flex flex-col justify-start items-start gap-4">
                <p className="text-[1.25rem] font-light text-nowrap">
                  You're currently subscribed
                </p>
                <div className="flex justify-start items-start gap-4">
                  <p className="font-medium">Basic Package</p>
                  <p className="font-medium">Expires in 30 days</p>
                </div>
              </div>
              <img src={Subscription} alt="subscription" className="w-[20%]" />
            </div>
          </div>
        </div>

        <div className="bg-white w-1/2 h-full mt-2 flex flex-col justify-start items-center gap-4 px-3 py-3 rounded-2xl overflow-auto text-xs">
          <div className="flex pt-5 px-5 flex-col justify-start gap-6 mb-2 w-full">
            <p className="text-center text-gray-500">
              Choose a monthly plan that works for you{" "}
            </p>

            {/* <-- keep the card relative so absolute children position to it */}

            <div className="relative bg-red-50 rounded-2xl flex flex-col justify-start items-start gap-2 p-4 w-full border-1">
              {/* badge moved INSIDE this relative container */}
              <div className="absolute top-[-10%] right-10 z-10 py-1 px-2 rounded-2xl bg-gray-900 text-white text-center text-xs">
                For you 50% off
              </div>

              <p>
                Basic <span>3x</span>
              </p>
              <ul>
                <li>
                  <span>🗸 </span>Share limited number of ads
                </li>
                <li>
                  <span>🗸 </span>All ads stays promoted for a week
                </li>
              </ul>
              <div className="flex justify-start items-start gap-4">
                <p>₵ 567</p>
                <p className="text-gray-500">
                  ₵ <span className="line-through"> 567 </span>
                </p>
              </div>
            </div>

            <div className="relative bg-red-50 rounded-2xl flex flex-col justify-start items-start gap-2 p-4 w-full">
              {/* <div className="absolute top-[-10%] right-10 z-10 py-1 px-2 rounded-2xl bg-gray-900 text-white text-center text-xs">
                For you 50% off
              </div> */}

              <p>
                Buisness <span>4x</span>
              </p>
              <ul>
                <li>
                  <span>🗸 </span>Pro partnership status
                </li>
                <li>
                  <span>🗸 </span>All ads stays promoted for a month
                </li>
              </ul>
              <div className="flex justify-start items-start gap-4">
                <p>₵ 567</p>
                <p className="text-gray-500">
                  ₵ <span className="line-through"> 567 </span>
                </p>
              </div>
            </div>

            <div className="relative bg-red-50 rounded-2xl flex flex-col justify-start items-start gap-2 p-4 w-full">
              {/* <div className="absolute top-[-10%] right-10 z-10 py-1 px-2 rounded-2xl bg-gray-900 text-white text-center text-xs">
                For you 50% off
              </div> */}

              <p>
                Premium <span>10x</span>
              </p>
              <ul>
                <li>
                  <span>🗸 </span>Unlimited number of ads
                </li>
                <li>
                  <span>🗸 </span>Sell 10x faster in all categories
                </li>
              </ul>
              <div className="flex justify-start items-start gap-4">
                <p>₵ 567</p>
                <p className="text-gray-500">
                  ₵ <span className="line-through"> 567 </span>
                </p>
              </div>
            </div>

            {/* badge was previously here (outside the card) which caused the issue */}
            <button className="bg-red-50 w-full py-4 rounded text-center mt-[10%] text-[1.1rem]">
              Pay Now
            </button>
          </div>
        </div>
      </div>

      {/* <div className="sm:hidden w-full">
        <MobileBanner page="Alerts" />
      </div> */}

      <div className="hidden lg:flex w-[25vw] h-[100vh] items-center justify-center pl-2">
        <ProfileStats />
      </div>
      <MenuButton />
    </div>
  );
};

export default SubscriptionPage;

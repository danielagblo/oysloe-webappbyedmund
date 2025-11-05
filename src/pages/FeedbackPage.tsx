import { useState } from "react";
import MenuButton from "../components/MenuButton";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileStats from "../components/ProfileStats";
import StarRating from "../components/StarRating";

const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState("feedback");

  return (
    <div className="flex justify-between h-screen w-screen items-center bg-[#f3f4f6] gap-4">
      <div className="w-1/11 h-full">
        <ProfileSidebar active={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="flex flex-col lg:flex-row w-full p-3 max-md:ml-[-2.5rem] mr-2 h-full  justify-start gap-4">
        <div className="bg-white w-full lg:w-1/2 mt-2 flex flex-col justify-start items-center gap-4 px-3 py-3 rounded-2xl text-xs">
          <div className="flex flex-col pt-5 px-5 gap-2 mb-2 w-full h-full min-h-0 justify-center items-center">
            <div className={`flex flex-col items-center justify-center w-full`}>
              <h2 className="text-2xl fontsize-20 text-gray-700">Feedback</h2>
              <p className="text-gray-500">Help us improve on our app</p>
              <StarRating rating={3} size="text-5xl" onColor="text-gray-700" />
              <p className="text-gray-500">Good</p>
            </div>
          </div>
        </div>
        <div className="bg-white w-full lg:w-1/2 mt-2 flex flex-col justify-start items-center gap-4 px-3 py-3 rounded-2xl text-xs max-lg:mb-20">
          <textarea
            className="border-1 w-full h-[15rem] rounded-md resize-none p-2 border-gray-300 mt-[10%]"
            placeholder="Comment"
          />
          <button className="w-full cursor-pointer bg-gray-100 p-5 rounded-md">
            Send Review
          </button>
        </div>
      </div>
      <div className="hidden sm:flex w-[20vw] h-[100vh] items-center justify-center mr-6">
        <ProfileStats />
      </div>
      <MenuButton />
    </div>
  );
};

export default FeedbackPage;

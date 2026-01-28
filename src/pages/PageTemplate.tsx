import { useState } from "react";
import MenuButton from "../components/MenuButton";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileStats from "../components/ProfileStats";

const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState("feedback");

  return (
    <div className="flex justify-between h-screen w-screen items-center bg-[#f3f4f6] gap-4">
      <div className="w-1/11 h-full">
        <ProfileSidebar active={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="md:flex w-full p-3 m-0 mr-2 h-full overflow-hidden no-scrollbar justify-center gap-4 hidden">
        <div className="bg-white w-1/2 h-full mt-2 flex flex-col justify-start items-start gap-4 px-3 py-3 rounded-2xl overflow-auto text-xs">
          <div className="flex pt-5 px-5 flex-col justify-start gap-2 mb-2"></div>
        </div>
        <div className="bg-white w-1/2 h-full mt-2 flex flex-col justify-start items-start gap-4 px-3 py-3 rounded-2xl overflow-auto text-xs">
          <div className="flex pt-5 px-5 flex-col justify-start gap-2 mb-2"></div>
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

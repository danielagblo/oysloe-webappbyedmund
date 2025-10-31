import { useState } from "react";
import MenuButton from "../components/MenuButton";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileStats from "../components/ProfileStats";

const EditProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="flex sm:justify-between h-[100vh] w-[100vw] items-center bg-[var(--div-active)]">
      <div className="h-full">
        <ProfileSidebar active={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="flex items-center justify-start sm:w-[65vw] sm:mr-6 sm:ml-2 sm:my-2 overflow-y-hidden">
        <div className="flex gap-2 sm:h-full sm:w-full">
          <div className="w-[100%]" style={{ backgroundColor: "red" }}>
            1
          </div>
        </div>
      </div>

      <div className="hidden sm:flex w-[20vw] h-[100vh] items-center justify-center mr-6">
        <ProfileStats />
      </div>
      <MenuButton />
    </div>
  );
};

export default EditProfilePage;

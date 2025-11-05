import { useState } from "react";
import MenuButton from "../components/MenuButton";
import PageLocked from "../components/PageLocked";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileStats from "../components/ProfileStats";
import ReferPage from "./ReferPage";
import PrivacyPage from "./PrivacyPage";
import AdsPage from "./AdsPage";
import FavouritesPage from "./FavouritesPage";
import SubscriptionPage from "./SubscriptionPage";
import EditProfilePage from "./EditProfilePage";
import TermsAndConditionsPage from "./TermsAndConditionsPage";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
        switch (activeTab) {
            case "profile":
              return <EditProfilePage />;
            case "favorite":
              return <FavouritesPage />;
            case "ads":
                return <AdsPage />;
            case "refer":
                return <ReferPage />;
            case "terms":
                return <TermsAndConditionsPage />;
            case "privacy":
                return <PrivacyPage />;
            case "subscription":
              return <SubscriptionPage />;
            case "feedback":
              return <PageLocked page="Feedback"/>
            default:
                return null;
        }
    };

  return (
    <div className="overflow-y-hidden no-scrollbar flex sm:justify-between h-[100vh] w-[100vw] items-center bg-[#ededed]">
      <div className="h-full">
        <ProfileSidebar active={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="flex no-scrollbar items-center justify-center sm:w-[65vw] sm:mr-6 sm:ml-2 sm:my-2 overflow-y-auto no-scrollbar">
        <div className="flex gap-2 sm:h-full sm:w-full">{renderContent()}</div>
      </div>

      <div className="hidden sm:flex w-[20vw] h-[100vh] items-center justify-center mr-6">
        <ProfileStats />
      </div>
      <MenuButton />
    </div>
  );
};

export default ProfilePage;

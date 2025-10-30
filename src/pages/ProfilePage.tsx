import { useState } from "react";
import MenuButton from "../components/MenuButton";
import PageLocked from "../components/PageLocked";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileStats from "../components/ProfileStats";
import ReferPage from "./ReferPage";
import TermsPage from "./TermsPage";
import PrivacyPage from "./PrivacyPage";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const lockedTabs = [
    "profile",
    "ads",
    "favorite",
    "subscription",
    "feedback",
  ];

  const renderContent = () => {
        if (lockedTabs.includes(activeTab)) {
        const pageName =
            activeTab === "ads"
            ? "Ads"
            : activeTab === "favorite"
                ? "Favorite"
                : activeTab === "feedback"
                ? "Feedback"
                : activeTab === "subscription"
                    ? "Subscription"
                    : "Profile";
        return <PageLocked page={pageName} />;
        }

        switch (activeTab) {
            case "refer":
                return <ReferPage />;
            case "terms":
                return <TermsPage />;
            case "privacy":
                return <PrivacyPage />;
            default:
                return null;
        }
    };

  return (
    <div className="overflow-y-hidden flex sm:justify-between h-[100vh] w-[100vw] items-center bg-[#ededed]">
      <div className="h-full">
        <ProfileSidebar active={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="flex items-center justify-center sm:w-[65vw] sm:mr-6 sm:ml-2 sm:my-2 overflow-y-hidden">
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

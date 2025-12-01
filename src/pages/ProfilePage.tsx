import { useState } from "react";
import MenuButton from "../components/MenuButton";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileStats from "../components/ProfileStats";
// import AccountPage from "./AccountPage";
import AdsPage from "./AdsPage";
import EditProfilePage from "./EditProfilePage";
import FavouritesPage from "./FavouritesPage";
import FeedbackPage from "./FeedbackPage";
import PrivacyPage from "./PrivacyPage";
import ProfileView from "./ProfileView";
import ReferPage from "./ReferPage";
import SubscriptionPage from "./SubscriptionPage";
import TermsAndConditionsPage from "./TermsAndConditionsPage";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);

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
        return <FeedbackPage />;
      default:
        return <p>Page not found.</p>;
    }
  };

  return (
    <div className="overflow-y-hidden no-scrollbar flex sm:justify-between h-[100vh] w-[100vw] items-start sm:items-center bg-[#ededed]">
      <div className="h-full">
        <ProfileSidebar active={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="flex no-scrollbar h-full items-start sm:items-center justify-center sm:w-[65vw] sm:mr-6 sm:ml-2 overflow-y-auto no-scrollbar">
        <div className="flex gap-2 sm:h-full sm:w-full items-center">
          {activeTab === "profile" ? (
            isEditing ? (
              <EditProfilePage onClose={() => setIsEditing(false)} />
            ) : (
              <ProfileView onEdit={() => setIsEditing(true)} />
            )
          ) : (
            renderContent()
          )}
        </div>
      </div>

      <div className="hidden sm:flex w-[20vw] h-[100vh] items-center justify-center mr-[2.125vw]">
        <ProfileStats />
      </div>
      <MenuButton />
    </div>
  );
};

export default ProfilePage;

import { useState } from "react";
import MenuButton from "../components/MenuButton";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileStats from "../components/ProfileStats";
import AccountPage from "./AccountPage";
import AdsPage from "./AdsPage";
import FavouritesPage from "./FavouritesPage";
import FeedbackPage from "./FeedbackPage";
import PrivacyPage from "./PrivacyPage";
import ReferPage from "./ReferPage";
import SubscriptionPage from "./SubscriptionPage";
import TermsAndConditionsPage from "./TermsAndConditionsPage";

import useUserProfile from "../features/userProfile/useUserProfile";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { profile, loading, error, refetchProfile } = useUserProfile();

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <AccountPage />;
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
    <div className="overflow-y-hidden no-scrollbar flex sm:justify-between h-[100vh] w-[100vw] items-center bg-[#ededed]">
      {/* show a simple loading / error state while profile loads */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60">
          <div>Loading profile...</div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-100 text-red-700 p-3 rounded">
          <div>Error loading profile</div>
          <button onClick={() => refetchProfile()} className="underline">
            Retry
          </button>
        </div>
      )}
      <div className="h-full">
        <ProfileSidebar active={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="flex no-scrollbar h-full items-center justify-center sm:w-[65vw] sm:mr-6 sm:ml-2 overflow-y-auto no-scrollbar">
        <div className="flex gap-2 sm:h-full sm:w-full">{renderContent()}</div>
      </div>

      <div className="hidden sm:flex w-[20vw] h-[100vh] items-center justify-center mr-[2.125vw]">
        <ProfileStats user={profile} />
      </div>
      <MenuButton />
    </div>
  );
};

export default ProfilePage;

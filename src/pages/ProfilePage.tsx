import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import MenuButton from "../components/MenuButton";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileStats from "../components/ProfileStats";
// import AccountPage from "./AccountPage";
import AdsPage from "./AdsPage";
import EditProfilePage from "./EditProfilePage";
import FavouritesPage from "./FavouritesPage";
import FeedbackPage from "./FeedbackPage";
import PrivacyPage from "./PrivacyPage";
import ReferPage from "./ReferPage";
import SubscriptionPage from "./SubscriptionPage";
import TermsAndConditionsPage from "./TermsAndConditionsPage";

const tabLabels: Record<string, string> = {
  profile: "Profile",
  favorite: "Favourites",
  ads: "Ads",
  refer: "Refer & Earn",
  terms: "Terms & Conditions",
  privacy: "Privacy Policy",
  subscription: "Subscription",
  feedback: "Feedback",
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const isSmall = useIsSmallScreen();
  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("profile_active_tab");
      return saved || "profile";
    } catch {
      return "profile";
    }
  });

  // Persist the active tab so it remains selected across page reloads
  useEffect(() => {
    try {
      localStorage.setItem("profile_active_tab", activeTab);
    } catch {
      // ignore write failures (e.g., storage disabled)
    }
  }, [activeTab]);

  const handleBackClick = () => {
    const previousPage = localStorage.getItem("profile_previous_page");
    if (previousPage && previousPage !== "/profile") {
      navigate(previousPage);
      localStorage.removeItem("profile_previous_page");
    } else {
      navigate(-1);
    }
  };

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
    <div className="overflow-y-hidden no-scrollbar flex sm:justify-between h-[100vh] w-[100vw] items-center bg-[#ededed]">
      {isSmall && (
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="text-sm whitespace-nowrap font-medium text-gray-700 hover:text-gray-900"
          >
            <img className="inline" src="/arrowleft.svg" alt="<" />
            Back
          </button>
          <p className="font-semibold text-gray-800 text-base">
            {tabLabels[activeTab] || "Profile"}
          </p>
          <div className="w-12" />
        </div>
      )}
      <div className="h-full">
        <ProfileSidebar active={activeTab} onSelect={setActiveTab} />
      </div>

      <div className="flex no-scrollbar h-full items-start sm:items-center justify-center sm:w-[63vw] sm:mr-6 sm:ml-2 overflow-y-hidden no-scrollbar">
        <div className="flex gap-2 sm:h-full sm:w-[60vw]">
          {renderContent()}
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

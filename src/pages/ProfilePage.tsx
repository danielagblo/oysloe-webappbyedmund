import { useState } from "react";
import MenuButton from "../components/MenuButton";
import PageLocked from "../components/PageLocked";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileStats from "../components/ProfileStats";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const lockedTabs = [
    "profile",
    "ads",
    "favorite",
    "subscription",
    "refer",
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
                : activeTab === "refer"
                  ? "Refer & Earn"
                  : "Profile";
      return <PageLocked page={pageName} />;
    }

    switch (activeTab) {
      case "terms":
        return (
          <div className="relative flex items-center justify-center w-[100vw] sm:w-full h-full text-center">
            <div
              className={`
                                shadow-lg rounded-2xl bg-white px-6 py-10 sm:px-5 sm:py-6 w-full 
                                flex flex-col items-center justify-center sm:shadow-lg sm:rounded-2xl 
                                h-[100vh] sm:h-auto
                            `}
            >
              <div className="flex pt-5 px-5 flex-col justify-start gap-2 mb-2 w-full sm:h-[85vh]">
                <h3 className="text-2xl">Terms & Conditions</h3>
                <h3>Help us improve on our app</h3>
              </div>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="relative flex items-center justify-center w-[100vw] sm:w-full h-full text-center">
            <div
              className={`
                                shadow-lg rounded-2xl bg-white px-6 py-10 sm:px-5 sm:py-6 w-full 
                                flex flex-col items-center justify-center sm:shadow-lg sm:rounded-2xl 
                                h-[100vh] sm:h-auto
                            `}
            >
              <div className="flex pt-5 px-5 flex-col justify-start gap-2 mb-2 w-full sm:h-[85vh]">
                <h3 className="text-2xl">Privacy Policy</h3>
                <h3>Help us improve on our app</h3>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex sm:justify-between h-[100vh] w-[100vw] items-center bg-[var(--div-active)]">
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

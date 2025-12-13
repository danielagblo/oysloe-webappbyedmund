import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../features/Auth/useAuth";
import Tooltip from "./Tooltip";

export type MenuItem = {
  key: string;
  label: string;
  icon?: string;
};

const MENU_ITEMS: MenuItem[] = [
  { key: "profile", label: "Profile", icon: "/profile.svg" },
  { key: "ads", label: "Ads", icon: "/ads.svg" },
  { key: "favorite", label: "Favourites", icon: "/favorite.svg" },
  { key: "subscription", label: "Subscription", icon: "/subecribe.svg" },
  { key: "refer", label: "Refer & Earn", icon: "/refer and earn.svg" },
  { key: "feedback", label: "Feedback", icon: "/feedback.svg" },
  { key: "terms", label: "T&C", icon: "/terms and conditions.svg" },
  { key: "privacy", label: "Privacy Policy", icon: "/privacypolicy.svg" },
];

type Props = {
  items?: MenuItem[];
  active: string;
  onSelect: (key: string) => void;
};

const ProfileSidebar = ({ items = MENU_ITEMS, active, onSelect }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [Logout, setLogout] = useState(false);

  const handleSelect = (key: string) => {
    onSelect(key);
    setIsOpen(false);
  };

  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    if (logoutMutation.status === "pending") return;
    console.log("ProfileSidebar: starting logout mutation");
    try {
      await logoutMutation.mutateAsync();
      console.log("ProfileSidebar: logout mutation resolved");
      setLogout(false);
      navigate("/login");
    } catch (err) {
      console.error("ProfileSidebar: logout mutation failed", err);
      // close dialog and navigate to login to force unauthenticated state
      setLogout(false);
      navigate("/login");
    }
  };

  return (
    <>
      {/* ---------- DESKTOP SIDEBAR ---------- */}
      <div className="hidden sm:flex flex-col h-full w-[18vw] sm:w-[14vw] justify-between items-center bg-white pt-[7vh]">
        <div className="flex flex-col h-full max-h-[65vh] justify-around w-full">
          {items.map((item) => {
            const isActive = item.key === active;
            return (
              <Tooltip key={item.key} content={item.label} position="right">
                <button
                  type="button"
                  onClick={() => handleSelect(item.key)}
                  className={`text-left py-[2vh] px-2 pl-3 flex items-center gap-3 w-full cursor-pointer transition-all ${
                    isActive
                      ? "border-r-[0.425vw] border-(--dark-def) bg-gray-50"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {item.icon && (
                    <img
                      src={item.icon}
                      alt={item.label}
                      className="h-auto shrink-0 w-[2vw]"
                    />
                  )}
                  <span
                    className="text-[1.25vw] whitespace-nowrap overflow-hidden text-ellipsis"
                    title={item.label}
                  >
                    {item.label}
                  </span>
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* Logout button for desktop */}
        <div className="w-full flex items-center justify-center pb-[5vh]">
          <Tooltip content="Logout" position="right">
            <button
              className="text-left h-[14vh] hover:rounded-2xl hover:bg-gray-100 flex items-center w-9/10 px-4"
              onClick={() => setLogout(true)}
            >
              <img src="/logout.svg" alt="Logout" className="w-[2vw] h-auto" />
              <span
                className={`text-left text-[1.25vw] flex items-center justify-center gap-3 w-full cursor-pointer transition            `}
              >
                Logout
              </span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* ---------- MOBILE MENU BUTTON ---------- */}
      <div className="sm:hidden fixed top-2 right-3 z-[100]">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-md bg-white/80 backdrop-blur-md shadow-md border-gray-200"
        >
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      {/* ---------- MOBILE SIDEBAR DRAWER ---------- */}
      {isOpen && (
        <div className="sm:hidden fixed inset-0 z-[200] flex justify-end">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-64 h-full bg-white shadow-2xl flex flex-col justify-between animate-slide-in-right">
            <div className="flex flex-col gap-6 pt-8">
              <button
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200"
                onClick={() => setIsOpen(false)}
              >
                <XMarkIcon className="w-5 h-5 text-gray-700" />
              </button>

              <div className="flex flex-col mt-10">
                {items.map((item) => {
                  const isActive = item.key === active;
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleSelect(item.key)}
                      className={`flex items-center gap-3 px-6 py-3 text-left transition-all ${
                        isActive
                          ? "bg-[var(--div-active)] border-r-7 border-[var(--dark-def)]"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {item.icon && (
                        <img
                          src={item.icon}
                          alt={item.label}
                          className="w-5 h-auto"
                        />
                      )}
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile logout button */}
            <div className="w-full mb-6 px-6">
              <button
                className="flex items-center gap-2 w-full py-3 rounded-lg hover:bg-gray-100"
                onClick={() => setLogout(true)}
              >
                <img src="/logout.svg" alt="Logout" className="w-4 h-auto" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {Logout && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[300] px-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm flex flex-col items-center gap-5">
            <svg
              className="h-35 w-auto"
              viewBox="0 0 65 77"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="12" y="17" width="28" height="46" fill="#374957" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 32.264C0 20.0064 3.20375e-07 13.8777 1.35278 11.8159C2.70552 9.75407 8.09231 7.78151 18.8659 3.83636L20.9185 3.08476C26.5346 1.02825 29.3425 0 32.25 0C35.1575 0 37.9654 1.02825 43.5816 3.08476L45.6341 3.83636C56.4078 7.78151 61.7946 9.75407 63.1473 11.8159C64.5 13.8777 64.5 20.0064 64.5 32.264V38.3004C64.5 59.9127 49.3102 70.4011 39.78 74.8546C37.195 76.0625 35.9025 76.6667 32.25 76.6667C28.5975 76.6667 27.305 76.0625 24.7198 74.8546C15.1896 70.4011 0 59.9127 0 38.3004V32.264ZM32.25 20.125C33.7342 20.125 34.9375 21.4122 34.9375 23V38.3333C34.9375 39.9211 33.7342 41.2083 32.25 41.2083C30.7658 41.2083 29.5625 39.9211 29.5625 38.3333V23C29.5625 21.4122 30.7658 20.125 32.25 20.125ZM32.25 53.6667C34.2291 53.6667 35.8333 51.9505 35.8333 49.8333C35.8333 47.7162 34.2291 46 32.25 46C30.2709 46 28.6667 47.7162 28.6667 49.8333C28.6667 51.9505 30.2709 53.6667 32.25 53.6667Z"
                fill="#74FFA7"
              />
            </svg>

            <p className="text-lg font-semibold text-center sm:px-7">
              Are you sure you would like to log out?
            </p>

            <div className="flex gap-2 sm:gap-1 flex-col sm:flex-row justify-around text-xs w-4/5">
              <button
                onClick={handleLogout}
                className={`border border-[var(--div-border)] cursor-pointer px-3.5 py-4 sm:py-2 rounded-xl w-full ${
                  logoutMutation.status === "pending"
                    ? "opacity-60 pointer-events-none"
                    : "hover:bg-red-200/40"
                }`}
                disabled={logoutMutation.status === "pending"}
              >
                {logoutMutation.status === "pending"
                  ? "Logging out..."
                  : "Yes, Log out"}
              </button>
              <button
                onClick={() => setLogout(false)}
                className={`border border-[var(--div-border)] cursor-pointer px-3.5 py-4 sm:py-2 rounded-xl w-full ${
                  logoutMutation.status === "pending"
                    ? "opacity-60 pointer-events-none"
                    : "hover:bg-green-200/40"
                }`}
                disabled={logoutMutation.status === "pending"}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileSidebar;

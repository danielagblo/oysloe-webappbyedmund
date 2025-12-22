import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLogout } from "../features/Auth/useAuth";
import useAccountDeleteRequest from "../features/accountDelete/useAccountDeleteRequest";
import useUserProfile from "../features/userProfile/useUserProfile";
import { buildMediaUrl } from "../services/media";
import type { UserProfile } from "../types/UserProfile";
import { LEVELS } from "../constants/levels";
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
  const [accountDeletionRequested, setAccountDeletionRequested] =
    useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const { profile: user, loading, error } = useUserProfile();
  const { create, data } = useAccountDeleteRequest();

  let name = (user as UserProfile)?.name;
  const nameParts = name?.split(" ") || [];
  name =
    nameParts.length > 1
      ? (nameParts[0] || "") + " " + (nameParts[nameParts.length - 1] || "")
      : nameParts[0];

  const handleSelect = (key: string) => {
    onSelect(key);
    setIsOpen(false);
  };

  const navigate = useNavigate();
  const logoutMutation = useLogout();

  const handleDelete = async () => {
    if (!deleteReason) {
      toast.warning("Delete reason required");
      return;
    }

    if (typeof create !== "function") {
      toast.error("Account delete action is not available");
      return;
    }

    if (data && (data.status === "PENDING" || data.status === "APPROVED")) {
      toast.warning(
        `You already have a${data.status === "APPROVED" ? "n " : " "}${data.status.toLowerCase()} delete request.`,
      );
      return;
    }

    try {
      await create({ reason: deleteReason });
      setAccountDeletionRequested(false);
      setDeleteReason("");
      toast.success("Account delete request submitted successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(`Failed to submit delete request: ${msg}`);
    }
  };

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
          onClick={() => {
            if (accountDeletionRequested || Logout) {
              setAccountDeletionRequested(false);
              setDeleteConfirmation(false);
              setLogout(false);
              setIsOpen(true);
            } else {
              setIsOpen(!isOpen);
            }
          }}
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
          <div className="relative w-80 max-w-[90vw] h-full bg-(--bg) shadow-2xl flex flex-col animate-slide-in-right overflow-auto no-scrollbar">
            {/* Header with close button */}
            <div className="flex justify-end items-center p-4 pb-0 border-gray-200">
              <button
                className="p-1 md:p-2 rounded-full bg-(--div-active) hover:bg-gray-200"
                onClick={() => setIsOpen(false)}
              >
                <XMarkIcon className="w-5 h-5 font-bold text-gray-700" />
              </button>
            </div>

            {/* Logout button */}
            <div className="pb-3 flex items-center justify-center w-full">
              <button
                className="flex items-center bg-(--div-active) justify-center gap-2 w-fit py-2 px-3 rounded-full hover:bg-gray-200 transition text-base"
                onClick={() => setLogout(true)}
              >
                <img src="/logout.svg" alt="Logout" className="w-6 h-6" />
                <span className="font-medium">Logout</span>
              </button>
            </div>

            {/* Profile Card - New Layout */}
            <div className="px-4 pb-4">
              <div className="flex items-start bg-(--div-active) rounded-2xl p-2 gap-3">
                {/* Left: Profile Picture */}
                <div className="bg-green-300 rounded-full h-17 w-17 flex items-center justify-center flex-shrink-0">
                  <img
                    src={
                      buildMediaUrl((user as UserProfile)?.avatar) ||
                      "/userPfp2.jpg"
                    }
                    alt="pfp"
                    className="rounded-full object-cover bg-green-100 h-14 w-14 border-6 border-white"
                  />
                </div>

                {/* Right: Name, Level, Progress Bar stacked */}
                <div className="flex-1 flex flex-col gap-1.5">
                  {/* Seller Name */}
                  <h3 className="font-medium text-sm">
                    {loading || error ? "User" : name !== " " ? name : "User"}
                  </h3>

                  {/* Level Badge */}
                  <div className="flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 10 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <ellipse
                        cx="5"
                        cy="5.24271"
                        rx="5"
                        ry="4.96781"
                        fill="#74FFA7"
                      />
                      <path
                        d="M2.05218 4.39318C2.37825 4.18062 2.83842 4.2557 3.08 4.56089L4.8702 6.82242L3.6894 7.59217L1.89921 5.33064C1.65763 5.02545 1.72611 4.60574 2.05218 4.39318Z"
                        fill="#374957"
                      />
                      <rect
                        width="6.34413"
                        height="1.26744"
                        rx="0.633722"
                        transform="matrix(-0.830425 0.55713 -0.631604 -0.775291 9.14648 4.37305)"
                        fill="#374957"
                      />
                    </svg>
                    <p className="text-xs text-gray-600">
                      {loading ? "" : (user as UserProfile)?.level || " "}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  {(() => {
                    const points =
                      Number((user as UserProfile)?.referral_points ?? 0) || 0;
                    const DIAMOND = LEVELS.diamondTop;
                    let percent = Math.round(
                      (points / Math.max(1, DIAMOND)) * 100
                    );
                    if (!isFinite(percent) || percent < 0) percent = 0;
                    if (percent > 100) percent = 100;
                    return (
                      <div className="h-1.5 bg-gray-300 mt-1 rounded-full overflow-hidden w-full">
                        <div
                          className="h-full bg-green-600 transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="px-4 pb-3">
              <div className="flex gap-3">
                <div className="flex-1 text-center bg-(--div-active) p-3 rounded-lg">
                  <p className="font-semibold text-base">
                    {(user?.active_ads ?? 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Active Ads</p>
                </div>
                <div className="flex-1 text-center bg-(--div-active) p-3 rounded-lg">
                  <p className="font-semibold text-base">
                    {(user?.taken_ads ?? 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Taken Ads</p>
                </div>
              </div>
            </div>

            {/* Account Section */}
            <div className="px-4 py-3">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Account
              </p>
              <button
                onClick={() => handleSelect("profile")}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-base transition-all ${
                  active === "profile"
                    ? "bg-gray-200 text-gray-900 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="bg-(--div-active) p-1.5 rounded-full">
                  <img src="/profile.svg" alt="Edit profile" className="w-5 h-5" />
                </div>
                <span>Edit profile</span>
              </button>
            </div>

            {/* Business Section */}
            <div className="px-4 py-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Business
              </p>
              {[
                { key: "ads", label: "Ads", icon: "/ads.svg" },
                {
                  key: "favorite",
                  label: "Favourites",
                  icon: "/favorite.svg",
                },
                {
                  key: "subscription",
                  label: "Subscription",
                  icon: "/subecribe.svg",
                },
                {
                  key: "refer",
                  label: "Refer & Earn",
                  icon: "/refer and earn.svg",
                },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleSelect(item.key)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-base transition-all ${
                    active === item.key
                      ? "bg-gray-200 text-gray-900 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="bg-(--div-active) p-1.5 rounded-full">
                    <img src={item.icon} alt={item.label} className="w-5 h-5" />
                  </div>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Settings Section */}
            <div className="px-4 py-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Settings
              </p>
              {[
                { key: "feedback", label: "Feedback", icon: "/feedback.svg" },
                { key: "terms", label: "T&C", icon: "/terms and conditions.svg" },
                {
                  key: "privacy",
                  label: "Privacy Policy",
                  icon: "/privacypolicy.svg",
                },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleSelect(item.key)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-base transition-all ${
                    active === item.key
                      ? "bg-gray-200 text-gray-900 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="bg-(--div-active) p-1.5 rounded-full">
                    <img src={item.icon} alt={item.label} className="w-5 h-5" />
                  </div>
                  <span>{item.label}</span>
                </button>
              ))}
              
              {/* Delete Account Button */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  setAccountDeletionRequested(true);
                }}
                className="flex text-gray-700 items-center gap-3 w-full px-3 py-2 rounded-lg text-base transition-all hover:bg-red-50"
              >
                <div className="bg-(--div-active) p-1.5 rounded-full">
                  <img className="h-5 w-5" src="/bin-svg.svg" alt="x" />
                </div>
                <span>Delete my account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {Logout && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[300] px-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-sm:w-9/10 max-w-sm flex flex-col items-center gap-5">
            <svg
              className="h-35 max-sm:h-17.5 w-auto"
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

            <div className="flex gap-2 sm:gap-1 flex-col max-sm:grid max-sm:grid-cols-2 sm:flex-row justify-around text-xs w-4/5 max-sm:w-full">
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

      {accountDeletionRequested && (
        <div
          onClick={() => {
            setAccountDeletionRequested(false);
            setDeleteConfirmation(false);
          }}
          className="fixed inset-0 z-30 bg-black/50 flex justify-center items-center px-4"
        >
          {!deleteConfirmation ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white flex justify-center items-center flex-col p-6 gap-4 rounded-xl w-full max-w-sm"
            >
              <h2 className="text-base text-center font-semibold">
                <span>Are you sure you want to delete your account?</span>
                <br />
                <span className="text-red-600 text-lg font-bold">
                  ⚠️ This action is irreversible.
                </span>
              </h2>
              <div className="flex gap-3 w-full flex-col">
                <button
                  onClick={() => setDeleteConfirmation(true)}
                  className="text-sm bg-red-600 text-white hover:bg-red-700 cursor-pointer rounded-lg py-3 px-4 transition font-medium"
                >
                  Yes, Delete My Account
                </button>
                <button
                  onClick={() => {
                    setAccountDeletionRequested(false);
                  }}
                  className="text-sm cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-lg py-3 px-4 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white flex justify-center items-center flex-col p-6 gap-4 rounded-xl w-full max-w-sm"
            >
              <h3 className="text-lg font-semibold text-center">
                Why do you want to delete your account?
              </h3>
              <textarea
                placeholder="Please provide your reason for deleting your account here."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded resize-none text-sm"
                rows={4}
              />
              <div className="flex justify-end gap-2 w-full">
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer transition text-sm font-medium"
                  onClick={() => {
                    setAccountDeletionRequested(false);
                    setDeleteConfirmation(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer transition text-sm font-medium"
                  onClick={() => {
                    handleDelete();
                    setDeleteConfirmation(false);
                    setAccountDeletionRequested(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProfileSidebar;

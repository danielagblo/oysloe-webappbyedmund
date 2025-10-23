import { useState } from "react";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline";

export type MenuItem = {
    key: string;
    label: string;
    icon?: string;
};

const MENU_ITEMS: MenuItem[] = [
    { key: "profile", label: "Profile", icon: "/profile.svg" },
    { key: "ads", label: "Ads", icon: "/ads.svg" },
    { key: "favorite", label: "Favorite", icon: "/favorite.svg" },
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

    const handleSelect = (key: string) => {
        onSelect(key);
        setIsOpen(false); 
    };

    return (
        <>
            {/* ---------- DESKTOP SIDEBAR ---------- */}
            <div className="hidden sm:flex flex-col h-full w-[18vw] sm:w-[10vw] justify-center items-center bg-white py-10">
                <div className="flex flex-col h-full gap-10 sm:gap-2 justify-center w-full">
                    {items.map((item) => {
                        const isActive = item.key === active;
                        return (
                            <button
                                key={item.key}
                                type="button"
                                onClick={() => handleSelect(item.key)}
                                className={`text-left py-1 px-4 flex items-center gap-2 flex-col w-full transition-all ${
                                    isActive
                                        ? "border-r-4 border-[var(--dark-def)] bg-[var(--div-active)]"
                                        : "hover:bg-gray-100"
                                }`}
                            >
                                {item.icon && (
                                    <img
                                        src={item.icon}
                                        alt={item.label}
                                        className="w-5 2xl:w-7 h-auto mx-auto"
                                    />
                                )}
                                <span className="text-center text-[8px]">
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="w-full h-2/10 sm:mb-auto flex items-end mb-12 sm:mt-7 ">
                    <button
                        className="text-left py-3 px-4 hover:bg-gray-200 flex items-center gap-2 flex-col rounded-2xl w-full justify-center h-8/10"
                        onClick={() => {}}
                    >
                        <img src="/logout.svg" alt="Logout" className="w-4 h-auto" />
                        <span className="text-center text-[10px]">Logout</span>
                    </button>
                </div>
            </div>

            {/* ---------- MOBILE MENU BUTTON ---------- */}
            <div className="sm:hidden fixed top-4 left-4 z-40">
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 rounded-md bg-white/80 backdrop-blur-md shadow-md border border-gray-200"
                >
                    <Bars3Icon className="w-6 h-6 text-gray-700" />
                </button>
            </div>

            {/* ---------- MOBILE SIDEBAR DRAWER ---------- */}
            {isOpen && (
                <div className="sm:hidden fixed inset-0 z-50 flex">
                    {/* BACKDROP */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-md"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* SIDEBAR PANEL */}
                    <div className="relative w-64 h-full bg-white shadow-2xl flex flex-col justify-between animate-slide-in-left">
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
                                                    ? "bg-[var(--div-active)] border-l-4 border-[var(--dark-def)]"
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

                        <div className="w-full mb-6 px-6">
                            <button
                                className="flex items-center gap-2 w-full py-3 rounded-lg hover:bg-gray-100"
                                onClick={() => {}}
                            >
                                <img
                                    src="/logout.svg"
                                    alt="Logout"
                                    className="w-4 h-auto"
                                />
                                <span className="text-sm">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileSidebar;

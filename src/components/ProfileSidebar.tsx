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
    return (
        <div className="flex flex-col h-full w-[22vw] sm:w-[10vw] justify-center items-center bg-white">
            <div className="flex flex-col h-full gap-10 sm:gap-2 justify-center w-full">
                {items.map((item) => {
                    const isActive = item.key === active;
                    return (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => onSelect(item.key)}
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

            <div className="w-full h-2/10 flex items-end mb-12 sm:mb-4">
                <button
                    className="text-left py-3 px-4 hover:bg-gray-200 flex items-center gap-2 flex-col rounded-2xl w-full justify-center h-8/10"
                    onClick={() => {
                        /* logout handler */
                    }}
                >
                    <img src="/logout.svg" alt="Logout" className="w-4 h-auto" />
                    <span className="text-center text-[10px]">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileSidebar;

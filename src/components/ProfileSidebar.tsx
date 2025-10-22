import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type MenuItem = {
    key: string;
    label: string;
    icon?: string;
    onClick?: () => void;
    href?: string;
};

const MENU_ITEMS: MenuItem[] = [
    { key: 'profile', label: 'Profile', icon: '/profile.svg' },
    { key: 'ads', label: 'Ads', icon: '/ads.svg' },
    { key: 'favorite', label: 'Favorite', icon: '/favorited.svg' },
    { key: 'subscription', label: 'Subscription', icon: '/subecribe.svg' },
    { key: 'refer', label: 'Refer & Earn', icon: '/refer and earn.svg' },
    { key: 'feedback', label: 'Feedback', icon: '/feedback.svg' },
    { key: 'terms', label: 'T&C', icon: '/terms and conditions.svg' },
    { key: 'privacy', label: 'Privacy Policy', icon: '/privacypolicy.svg' },
];

type Props = {
    items?: MenuItem[];
};

type RouteKey = typeof MENU_ITEMS[number]['key'] | 'home';
const VALID_KEYS = new Set(MENU_ITEMS.map((m) => m.key));

const ProfileSidebar = ({ items = MENU_ITEMS }: Props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const pathToKey = useCallback((fullPath: string): RouteKey => {
        // prefer segment-based routing like '/profile/ads'
        const [pathname] = fullPath.split('?');
        const parts = pathname.split('/').filter(Boolean);
        if (parts[0] === 'profile') {
            const tab = parts[1];
            if (tab && VALID_KEYS.has(tab)) return tab as RouteKey;
            return 'profile';
        }
        return 'home';
    }, []);

    const [active, setActive] = useState<RouteKey>(() => pathToKey(location.pathname + location.search));

    useEffect(() => {
        setActive(pathToKey(location.pathname + location.search));
    }, [location.pathname, location.search, pathToKey]);

    const handleItemClick = (item: MenuItem) => {
        // call custom onClick first (if any)
        if (item.onClick) item.onClick();

        // navigate using path segments, no query params
        if (item.key === 'profile') {
            navigate('/profile');
            setActive('profile');
            return;
        }
        navigate(`/profile/${item.key}`);
        setActive(item.key as RouteKey);
    };

    return (
        <div className="flex flex-col h-full w-full justify-center items-center bg-white">
            <div className="flex flex-col h-full gap-2 justify-center w-full">
                {items.map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() => handleItemClick(item)}
                        className={`text-left py-1 px-4 active:border-r-2 active:border-gray-500 flex items-center gap-2 flex-col ${item.key === active ? 'w-full border-r-2 ' : ''
                            }`}
                    >
                        {item.icon && <img src={item.icon} alt={item.label} className="w-5 2xl:w-7 h-auto mx-auto" />}
                        <span className="text-center text-[8px]">{item.label}</span>
                    </button>
                ))}
            </div>
            <div className="w-full h-2/10 flex items-end mb-4">
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


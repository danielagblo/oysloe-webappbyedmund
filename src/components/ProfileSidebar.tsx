
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
    { key: 'account', label: 'Account', icon: '/account.svg' },
    { key: 'terms', label: 'T&C', icon: '/terms and conditions.svg' },
    { key: 'privacy', label: 'Privacy Policy', icon: '/privacypolicy.svg' },
];


type Props = {
    items?: MenuItem[];
};

import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type RouteKey = typeof MENU_ITEMS[number]['key'] | 'home';

// map logical keys to route prefixes (used by pathToKey)
const routes: Record<RouteKey, string> = {
    home: '/',
    profile: '/profile',
    ads: '/ads',
    favorite: '/favorite',
    subscription: '/subscription',
    refer: '/refer',
    feedback: '/feedback',
    account: '/account',
    terms: '/terms',
    privacy: '/privacy',
};

const ProfileSidebar = ({ items = MENU_ITEMS }: Props) => {
    const navigate = useNavigate();
    const location = useLocation();

    const pathToKey = useCallback((path: string): RouteKey => {
        const entry = Object.entries(routes).find(([, route]) => path === route || path.startsWith(route));
        return (entry?.[0] as RouteKey) || 'profile';
    }, []);

    const [active, setActive] = useState<RouteKey>(() => pathToKey(location.pathname));

    useEffect(() => {
        setActive(pathToKey(location.pathname));
    }, [location.pathname, pathToKey]);

    const handleItemClick = (item: MenuItem) => {
        const target = routes[item.key as RouteKey];
        navigate(target);
        setActive(item.key as RouteKey);
    };

    return (
        <div className='flex flex-col h-full w-full justify-center items-center bg-white'>
            <div className='flex flex-col h-full gap-2 justify-center'>
                {items.map(item => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() => handleItemClick(item)}
                        className={`text-left py-1 px-4 active:border-r-2 active:border-gray-500 flex items-center gap-2 flex-col ${item.key === active ? 'border-r-2 border-green-500' : ''}`}
                    >
                        {item.icon && <img src={item.icon} alt={item.label} className='w-3 h-auto mx-auto' />}
                        <span className='text-center text-[8px]'>{item.label}</span>
                    </button>
                ))}
            </div>
            <div className="w-full h-2/10 flex items-end mb-4">
                <button className='text-left py-3 px-4 hover:bg-gray-200 flex items-center gap-2 flex-col rounded-2xl w-full justify-center h-8/10' onClick={() => { /* logout handler */ }}>
                    <img src="/logout.svg" alt="Logout" className='w-4 h-auto' />
                    <span className='text-center text-[10px]'>Logout</span>
                </button>
            </div>
        </div>
    );
}

export default ProfileSidebar;

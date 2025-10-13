
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

const ProfileSidebar = ({ items = MENU_ITEMS }: Props) => {
    return (
        <div className='flex flex-col h-full w-full justify-center gap-10 items-center'>
            <div className='flex flex-col'>
                {items.map(item => (
                    <button
                        key={item.key}
                        onClick={item.onClick}
                        className='text-left py-2 px-4 hover:bg-gray-200 flex items-center gap-2 flex-col rounded-2xl '
                    >
                        {item.icon && <img src={item.icon} alt={item.label} className='w-6 h-auto mx-auto' />}
                        <span className='text-center text-xs'>{item.label}</span>
                    </button>
                ))}
            </div>
            <button className='text-left py-2 px-4 hover:bg-gray-200 flex items-center gap-2 flex-col rounded-2xl w-full justify-center' onClick={() => { /* logout handler */ }}>
                <img src="/logout.svg" alt="Logout" className='w-8 h-auto' />
                <span className='text-center text-xs'>Logout</span>
            </button>
        </div>
    );
}

export default ProfileSidebar;

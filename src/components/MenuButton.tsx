import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const MenuButton = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const routes = useMemo<Record<string, string>>(() => ({
        home: "/homepage",
        alerts: "/alerts",
        post: "/post",
        inbox: "/inbox",
        profile: "/profile",
    }), []);

    const icons: Record<string, string> = {
        home: "/home.svg",
        alerts: "/Alert.svg",
        post: "/Post.svg",
        inbox: "/inbox.svg",
        profile: "/profile.svg",
    };

    const pathToKey = useCallback((path: string) => {
        const entry = Object.entries(routes).find(([, route]) => path === route || path.startsWith(route));
        return entry ? entry[0] : "home";
    }, [routes]);

    const [active, setActive] = useState(() => pathToKey(location.pathname));

    useEffect(() => {
        setActive(pathToKey(location.pathname));
    }, [location.pathname, pathToKey]);

    const handleClick = (id: string) => {
        const target = routes[id];
        if (location.pathname === target) {
            window.location.reload();
            return;
        }
        navigate(target);
        setActive(id);
    };

    const btnBase = "relative p-2 flex flex-col items-center gap-1 focus:outline-none";

    return (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 w-2/5 bg-white border-t border-gray-300 flex justify-around items-center h-20 rounded-lg shadow-lg z-10 overflow-visible">
            <button onClick={() => handleClick("home")} id="home" aria-current={active === "home"} className={btnBase}>
                {active === "home" && (
                    <img src="/active button.svg" alt="" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 pointer-events-none z-20" />
                )}
                <img src={icons.home} alt="Home" className="w-9 h-6" />
                <span className="text-xs text-center">Home</span>
            </button>

            <button onClick={() => handleClick("alerts")} id="alerts" aria-current={active === "alerts"} className={btnBase}>
                {active === "alerts" && (
                    <img src="/active button.svg" alt="" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 pointer-events-none z-20" />
                )}
                <img src={icons.alerts} alt="Alerts" className="w-9 h-6" />
                <span className="text-xs text-center">Alerts</span>
            </button>

            <button onClick={() => handleClick("post")} id="post" aria-current={active === "post"} className={btnBase}>
                {active === "post" && (
                    <img src="/active button.svg" alt="" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 pointer-events-none z-20" />
                )}
                <img src={icons.post} alt="Post" className="w-9 h-6" />
                <span className="text-xs text-center">Post</span>
            </button>

            <button onClick={() => handleClick("inbox")} id="inbox" aria-current={active === "inbox"} className={btnBase}>
                {active === "inbox" && (
                    <img src="/active button.svg" alt="" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 pointer-events-none z-20" />
                )}
                <img src={icons.inbox} alt="Inbox" className="w-9 h-6" />
                <span className="text-xs text-center">Inbox</span>
            </button>

            <button onClick={() => handleClick("profile")} id="profile" aria-current={active === "profile"} className={btnBase}>
                {active === "profile" && (
                    <img src="/active button.svg" alt="" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 pointer-events-none z-20" />
                )}
                <img src={icons.profile} alt="Profile" className="w-9 h-6" />
                <span className="text-xs text-center">Profile</span>
            </button>
        </div>
    );
}

export default MenuButton;

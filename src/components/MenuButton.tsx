// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// import "../App.css";

// const MenuButton = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     const routes = useMemo<Record<string, string>>(() => ({
//         home: "/homepage",
//         alerts: "/alerts",
//         post: "/post",
//         inbox: "/inbox",
//         profile: "/profile",
//     }), []);

//     const icons: Record<string, string> = {
//         home: "/home.svg",
//         alerts: "/Alert.svg",
//         post: "/Post.svg",
//         inbox: "/inbox.svg",
//         profile: "/profile.svg",
//     };

//     const pathToKey = useCallback((path: string) => {
//         const entry = Object.entries(routes).find(([, route]) => path === route || path.startsWith(route));
//         return entry ? entry[0] : "home";
//     }, [routes]);

//     const [active, setActive] = useState(() => pathToKey(location.pathname));

//     useEffect(() => {
//         setActive(pathToKey(location.pathname));
//     }, [location.pathname, pathToKey]);

//     const handleClick = (id: string) => {
//         const target = routes[id];
//         if (location.pathname === target) {
//             window.location.reload();
//             return;
//         }
//         navigate(target);
//         setActive(id);
//     };

//     const btnBase = "relative p-2 flex flex-col items-center gap-1 focus:outline-none";

//     return (
//         <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white border-t border-gray-300 flex justify-around items-center gap-4 h-20 rounded-lg shadow-lg z-10 overflow-visible bottom-nav">
//             <button onClick={() => handleClick("home")} id="home" aria-current={active === "home"} className={btnBase}>
//                 {active === "home" && (
//                     <img src="/active button.svg" alt="" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 pointer-events-none z-20" />
//                 )}
//                 <img src={icons.home} alt="Home" className="w-9 h-6" />
//                 <span className="text-xs text-center">Home</span>
//             </button>

//             <button onClick={() => handleClick("alerts")} id="alerts" aria-current={active === "alerts"} className={btnBase}>
//                 {active === "alerts" && (
//                     <img src="/active button.svg" alt="" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 pointer-events-none z-20" />
//                 )}
//                 <img src={icons.alerts} alt="Alerts" className="w-9 h-6" />
//                 <span className="text-xs text-center">Alerts</span>
//             </button>

//             <button onClick={() => handleClick("post")} id="post" aria-current={active === "post"} className={btnBase}>
//                 {active === "post" && (
//                     <img src="/active button.svg" alt="" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 pointer-events-none z-20" />
//                 )}
//                 <img src={icons.post} alt="Post" className="w-9 h-6" />
//                 <span className="text-xs text-center">Post</span>
//             </button>

//             <button onClick={() => handleClick("inbox")} id="inbox" aria-current={active === "inbox"} className={btnBase}>
//                 {active === "inbox" && (
//                     <img src="/active button.svg" alt="" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 pointer-events-none z-20" />
//                 )}
//                 <img src={icons.inbox} alt="Inbox" className="w-9 h-6" />
//                 <span className="text-xs text-center">Inbox</span>
//             </button>

//             <button onClick={() => handleClick("profile")} id="profile" aria-current={active === "profile"} className={btnBase}>
//                 {active === "profile" && (
//                     <img src="/active button.svg" alt="" className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 pointer-events-none z-20" />
//                 )}
//                 <img src={icons.profile} alt="Profile" className="w-9 h-6" />
//                 <span className="text-xs text-center">Profile</span>
//             </button>
//         </div>
//     );
// }

// export default MenuButton;


import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

// Shared type for navigation keys
type RouteKey = "home" | "alerts" | "post" | "inbox" | "profile";

// Shared route + icon configs
const routes: Record<RouteKey, string> = {
  home: "/homepage",
  alerts: "/alerts",
  post: "/post",
  inbox: "/inbox",
  profile: "/profile",
};

const icons: Record<RouteKey, string> = {
  home: "/home.svg",
  alerts: "/Alert.svg",
  post: "/Post.svg",
  inbox: "/inbox.svg",
  profile: "/profile.svg",
};

// Reusable Nav Button
const NavButton = ({
  id,
  active,
  icon,
  label,
  onClick,
}: {
  id: RouteKey;
  active: boolean;
  icon: string;
  label: string;
  onClick: (id: RouteKey) => void;
}) => {
  const btnBase =
    "relative p-2 flex flex-col items-center gap-1 focus:outline-none";
  return (
    <button onClick={() => onClick(id)} id={id} aria-current={active} className={btnBase}>
      {active && (
        <img
          src="/active button.svg"
          alt=""
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 pointer-events-none z-20"
        />
      )}
      <img src={icon} alt={label} className="w-9 h-6" />
      <span className="text-xs text-center">{label}</span>
    </button>
  );
};

// Desktop, Tablet Navigation 
const MenuButton = ({
  active,
  onClick,
}: {
  active: RouteKey;
  onClick: (id: RouteKey) => void;
}) => (
  <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white border-t border-gray-300 flex justify-around items-center gap-4 h-20 rounded-lg shadow-lg z-10 overflow-visible bottom-nav hidden lg:flex">
    {Object.entries(icons).map(([id, icon]) => {
      const key = id as RouteKey;
      return (
        <NavButton
          key={id}
          id={key}
          icon={icon}
          label={id.charAt(0).toUpperCase() + id.slice(1)}
          active={active === key}
          onClick={onClick}
        />
      );
    })}
  </div>
);

// Mobile Footer
const MobileFooter = ({
  active,
  onClick,
}: {
  active: RouteKey;
  onClick: (id: RouteKey) => void;
}) => (
  <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-gray-200 p-2 flex justify-around items-center z-10">
    {Object.entries(icons).map(([id, icon]) => {
      const key = id as RouteKey;
      return key === "post" ? (
        <button
          key={id}
          onClick={() => onClick(key)}
          className="p-3 bg-green-500 rounded-full shadow-lg -translate-y-2"
        >
          <img src={icon} alt={id} className="w-8 h-8 text-white" />
        </button>
      ) : (
        <div
          key={id}
          onClick={() => onClick(key)}
          className={`flex flex-col items-center text-xs ${
            active === key ? "text-green-500" : "text-gray-500"
          }`}
        >
          <img src={icon} alt={id} className="w-6 h-6" />
          {id.charAt(0).toUpperCase() + id.slice(1)}
        </div>
      );
    })}
  </div>
);

// Combined Responsive Menu
export default function ResponsiveMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  const pathToKey = useCallback((path: string): RouteKey => {
    const entry = Object.entries(routes).find(
      ([, route]) => path === route || path.startsWith(route)
    );
    return (entry?.[0] as RouteKey) || "home";
  }, []);

  const [active, setActive] = useState<RouteKey>(() => pathToKey(location.pathname));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setActive(pathToKey(location.pathname));
  }, [location.pathname, pathToKey]);

  const handleClick = (id: RouteKey) => {
    const target = routes[id];
    if (location.pathname === target) {
      window.location.reload();
      return;
    }
    navigate(target);
    setActive(id);
  };

  return isMobile ? (
    <MobileFooter active={active} onClick={handleClick} />
  ) : (
    <MenuButton active={active} onClick={handleClick} />
  );
}

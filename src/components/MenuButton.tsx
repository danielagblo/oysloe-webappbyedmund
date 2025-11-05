import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

type RouteKey = "home" | "alerts" | "post" | "inbox" | "profile";

const routes: Record<RouteKey, string> = {
  home: "/homepage",
  alerts: "/alerts",
  post: "/postad",
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
}) => (
  <button
    onClick={() => onClick(id)}
    id={id}
    aria-current={active}
    className="relative p-2 flex flex-col items-center gap-1 focus:outline-none"
  >
    {/* Active indicator (top bar on desktop) */}
    {active && (
      <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-[5px] bg-[var(--dark-def)]  rounded-[0_0_20px_20px]"></div>
    )}
    <img
      src={icon}
      alt={label}
      className={`w-6 h-6 transition-all ${
        active ? "opacity-100 scale-110" : "opacity-70"
      }`}
    />
    <span
      className={`text-xs text-center transition-colors ${
        active ? "text-[var(--dark-def)] font-semibold" : "text-gray-500"
      }`}
    >
      {label}
    </span>
  </button>
);

// Desktop/Tablet menu bar
const MenuBar = ({
  active,
  onClick,
}: {
  active: RouteKey;
  onClick: (id: RouteKey) => void;
}) => (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 flex justify-around items-center gap-4 h-16 rounded-2xl shadow-lg z-10 px-6 hidden sm:flex">
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

// Mobile footer bar
const MobileFooter = ({
  active,
  onClick,
}: {
  active: RouteKey;
  onClick: (id: RouteKey) => void;
}) => (
  <div className="fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-gray-300 flex justify-around items-center h-16 shadow-[0_-2px_6px_rgba(0,0,0,0.1)] z-20">
    {Object.entries(icons).map(([id, icon]) => {
      const key = id as RouteKey;
      return (
        <button
          key={id}
          onClick={() => onClick(key)}
          className={`relative flex flex-col items-center justify-center gap-1 text-xs transition-colors`}
        >
          {/* Active top bar for mobile */}
          {active === key && (
            <div className="absolute top-[-7px] left-1/2 transform -translate-x-1/2 w-12 h-[7px] bg-[var(--dark-def)] rounded-[0_0_20px_20px]"></div>
          )}
          <img
            src={icon}
            alt={id}
            className={`mt-2 w-6 h-6 transition-all ${
              active ? "opacity-100 scale-110" : "opacity-70"
            }`}
          />
          <span
            className={`text-[11px] font-medium ${
              active ? "text-[var(--dark-def)]" : "text-gray-500"
            }`}
          >
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </span>
        </button>
      );
    })}
  </div>
);

// Main responsive navigation component
export default function ResponsiveMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  const pathToKey = useCallback((path: string): RouteKey => {
    const entry = Object.entries(routes).find(
      ([, route]) => path === route || path.startsWith(route),
    );
    return (entry?.[0] as RouteKey) || "home";
  }, []);

  const [active, setActive] = useState<RouteKey>(() =>
    pathToKey(location.pathname),
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
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
    <MenuBar active={active} onClick={handleClick} />
  );
}

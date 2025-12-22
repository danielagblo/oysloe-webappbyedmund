import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";
import { useAlertsQuery } from "../features/alerts/useAlertsQuery";
import chatService from "../services/chatService";
import { useScrollDirection } from "../hooks/useScrollDirection";

type RouteKey = "home" | "alerts" | "post" | "inbox" | "profile";

const routes: Record<RouteKey, string> = {
  home: "/homepage",
  alerts: "/alerts",
  post: "/postad",
  inbox: "/inbox",
  profile: "/profile",
};

const profileSubPages = [
  "/edit-profile",
  "/feedback",
  "/tc",
  "/privacy",
  "/subscription",
];

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
  count,
}: {
  id: RouteKey;
  active: boolean;
  icon: string;
  label: string;
  onClick: (id: RouteKey) => void;
  count?: number;
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
    <div className="relative">
      <img
        src={icon}
        alt={label}
        className={`w-6 h-6 transition-all ${
          active ? "opacity-100 scale-110" : "opacity-70"
        }`}
      />
      {count !== undefined && count > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </div>
      )}
    </div>
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
  alertCount,
  inboxCount,
}: {
  active: RouteKey;
  onClick: (id: RouteKey) => void;
  alertCount?: number;
  inboxCount?: number;
}) => (
  <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 flex justify-around items-center gap-4 h-16 rounded-2xl shadow-lg z-10 px-6 hidden sm:flex">
    {Object.entries(icons).map(([id, icon]) => {
      const key = id as RouteKey;
      const count =
        key === "alerts"
          ? alertCount
          : key === "inbox"
            ? inboxCount
            : undefined;
      return (
        <NavButton
          key={id}
          id={key}
          icon={icon}
          label={id.charAt(0).toUpperCase() + id.slice(1)}
          active={active === key}
          onClick={onClick}
          count={count}
        />
      );
    })}
  </div>
);

// Mobile footer bar with hide-on-scroll
const MobileFooter = ({
  active,
  onClick,
  alertCount,
  inboxCount,
}: {
  active: RouteKey;
  onClick: (id: RouteKey) => void;
  alertCount?: number;
  inboxCount?: number;
}) => {
  const direction = useScrollDirection();
  // Only hide on scroll down, show on scroll up
  // Only on mobile (sm:hidden)
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 sm:hidden bg-white border-t border-gray-300 flex justify-around items-center h-16 shadow-[0_-2px_6px_rgba(0,0,0,0.1)] z-20 transition-transform duration-300 ease-in-out ${
        direction === 'down' ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
      aria-hidden={direction === 'down'}
    >
      {Object.entries(icons).map(([id, icon]) => {
        const key = id as RouteKey;
        const count =
          key === "alerts"
            ? alertCount
            : key === "inbox"
              ? inboxCount
              : undefined;
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
            <div className="relative mt-2">
              <img
                src={icon}
                alt={id}
                className={`w-6 h-6 transition-all ${
                  active === key ? "opacity-100 scale-110" : "opacity-70"
                }`}
              />
              {count !== undefined && count > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {count > 99 ? "99+" : count}
                </div>
              )}
            </div>
            <span
              className={`text-[11px] font-medium ${
                active === key ? "text-[var(--dark-def)]" : "text-gray-500"
              }`}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

// Main responsive navigation component
export default function ResponsiveMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const { alerts } = useAlertsQuery();

  // Fetch chat rooms to get unread inbox count
  const { data: chatRooms = [] } = useQuery({
    queryKey: ["chatRooms"],
    queryFn: () => chatService.listChatRooms(),
    staleTime: 30000, // 30 seconds
    retry: false,
  });

  const pathToKey = useCallback((path: string): RouteKey => {
    const entry = Object.entries(routes).find(
      ([, route]) => path === route || path.startsWith(route),
    );
    if (profileSubPages?.includes(path)) {
      return "profile";
    }
    return (entry?.[0] as RouteKey) || "home";
  }, []);

  const [active, setActive] = useState<RouteKey>(() =>
    pathToKey(location.pathname),
  );

  // Count unread alerts
  const unreadAlertCount = alerts.filter((a) => !a.is_read).length;

  // Count unread inbox messages
  const unreadInboxCount = chatRooms.reduce(
    (sum, room) => sum + (room.total_unread || 0),
    0,
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
    <MobileFooter
      active={active}
      onClick={handleClick}
      alertCount={unreadAlertCount}
      inboxCount={unreadInboxCount}
    />
  ) : (
    <MenuBar
      active={active}
      onClick={handleClick}
      alertCount={unreadAlertCount}
      inboxCount={unreadInboxCount}
    />
  );
}

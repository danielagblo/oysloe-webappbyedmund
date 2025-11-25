import { useEffect, useState } from "react";
import "../App.css";
import MenuButton from "../components/MenuButton";
import MobileBanner from "../components/MobileBanner";
import ProfileStats from "../components/ProfileStats";
import { timeAgo } from "../utils/timeAgo";
const AlertsPanel = () => {
  type Alert = { id: string; title: string; body: string; created_at: string };

  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // simulate a fetch for alerts (replace with real fetch as needed)
    const t = setTimeout(() => {
      setAlerts([
        {
          id: "1",
          title: "Welcome",
          body: "Thanks for joining our platform.",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Maintenance",
          body: "Scheduled maintenance tonight at 11pm.",
          created_at: new Date().toISOString(),
        },
      ]);
      setLoading(false);
    }, 400);

    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center lg:w-full text-[var(--dark-def)] ">
      {/* Fixed-height container only for desktop */}
      <div className="bg-white w-full mr-2 lg:w-[75vw] lg:h-[93vh] lg:rounded-2xl shadow-sm flex flex-col">
        {/* Header (desktop only) */}
        <div className="p-4 sm:p-6 border-b hidden sm:block border-gray-100 flex-shrink-0">
          <h2 className="sm:text-center sm:text-3xl sm:font-semibold">Alerts</h2>
        </div>

        {/* Desktop alerts */}
        <div className="hidden lg:flex flex-1 overflow-y-auto no-scrollbar p-4 lg:p-6 pb-24">
          <div className="space-y-4 w-full">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-2 rounded-lg bg-gray-100 animate-pulse"
                  >
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-300 flex-shrink-0" />
                    <div className="flex flex-col w-full">
                      <span className="text-xs text-gray-400">...</span>
                      <div className="text-sm lg:text-base">
                        <span className="font-semibold">...</span>
                        <span className="ml-1 break-words">loading...Please wait</span>
                      </div>
                    </div>
                  </div>
                ))
              : alerts.length === 0 ? <p className="w-full text-center">You have no alerts</p>
                : alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                    >
                      <img
                        src="/building.svg"
                        alt="alert source"
                        className="w-8 h-8 lg:w-10 lg:h-10 object-cover rounded-full flex-shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400">
                          {timeAgo(alert.created_at)}
                        </span>
                        <div className="text-sm lg:text-base">
                          <span className="font-semibold">{alert.title}</span>
                          <span className="ml-1 break-words">{alert.body}</span>
                        </div>
                      </div>
                    </div>
                  )
                )
              }
          </div>
        </div>

        {/* Mobile alerts */}
        <div className="flex lg:hidden flex-col w-full p-4 bg-white">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2 rounded-lg bg-gray-100 animate-pulse"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
                  <div className="flex flex-col w-full">
                    <span className="text-xs text-gray-400">...</span>
                    <div className="text-sm">
                      <span className="font-semibold">Loading...</span>
                      <span className="ml-1 text-gray-400">Please wait</span>
                    </div>
                  </div>
                </div>
              ))
            : alerts.length === 0 ? <p className="w-full text-center">You have no alerts</p>
                : alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    <img
                      src="/building.svg"
                      alt="alert source"
                      className="w-8 h-8 object-cover rounded-full flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">
                        {timeAgo(alert.created_at)}
                      </span>
                      <div className="text-sm">
                        <span className="font-semibold">{alert.title}</span>
                        <span className="ml-1 text-gray-400">{alert.body}</span>
                      </div>
                    </div>
                  </div>
                ))}
        </div>

        <div className="h-15" />
      </div>
    </div>
  );
};


const AlertsPage = () => (
  <div className="flex flex-col lg:flex-row items-center justify-center w-[100vw] min-h-screen bg-[#ededed]">
    <div className="sm:hidden w-full">
      <MobileBanner page="Alerts" />
    </div>

    <div className="hidden lg:flex w-[25vw] h-[100vh] items-center justify-center pl-2">
      <ProfileStats />
    </div>

    <div className="flex items-center justify-center w-full lg:w-[75vw] lg:h-full">
      <AlertsPanel />
    </div>

    <MenuButton />
  </div>
);

export default AlertsPage;

import "../App.css";
import MenuButton from "../components/MenuButton";
import MobileBanner from "../components/MobileBanner";
import ProfileStats from "../components/ProfileStats";

const AlertsPanel = () => (
  <div className="flex flex-col items-center lg:w-full text-[var(--dark-def)] ">
    {/* Fixed-height container only for desktop */}
    <div className="bg-white w-full mr-2 lg:w-[75vw] lg:h-[93vh] lg:rounded-2xl shadow-sm flex flex-col">

      {/* Header (desktop only) */}
      <div className="p-4 sm:p-6 border-b hidden sm:block border-gray-100 flex-shrink-0">
        <h2 className="sm:text-center sm:text-3xl sm:font-semibold">Alerts</h2>
      </div>

      {/* Scrollable desktop list ONLY */}
      <div className="hidden lg:flex flex-1 overflow-y-auto no-scrollbar p-4 lg:p-6 pb-24">
        <div className="space-y-4 w-full">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
            >
              <img
                src="/building.svg"
                alt="alert source"
                className="w-8 h-8 lg:w-10 lg:h-10 object-cover rounded-full flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">10 mins ago</span>
                <div className="text-sm lg:text-base">
                  <span className="font-semibold">Oysloe</span>
                  <span className="ml-1 break-words">
                    We’re excited to have you onboard. You’ve taken the first
                    step toward smarter shopping and selling. Big things await — stay tuned!
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile full-page list */}
      <div className="flex lg:hidden flex-col w-full p-4 bg-white">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
          >
            <img
              src="/building.svg"
              alt="alert source"
              className="w-8 h-8 object-cover rounded-full flex-shrink-0"
            />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">10 mins ago</span>
              <div className="text-sm">
                <span className="font-semibold">Oysloe</span>
                <span className="ml-1 text-gray-400">
                  We’re excited to have you onboard. You’ve taken the first
                  step toward smarter shopping and selling. Big things await — stay tuned!
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-15" />
    </div>
  </div>
);

const AlertPage = () => (
  <div className="flex flex-col lg:flex-row items-center justify-center w-[100vw] min-h-screen bg-[var(--div-active)]">
    {/* Mobile header */}
    <div className="sm:hidden w-full">
      <MobileBanner page="Alerts" />
    </div>

    {/* Profile sidebar (desktop only) */}
    <div className="hidden lg:flex w-[25vw] h-[100vh] items-center justify-center pl-2">
      <ProfileStats />
    </div>

    {/* Alerts panel (centered, minimal edge gap) */}
    <div className="flex items-center justify-center w-full lg:w-[75vw] lg:h-full">
      <AlertsPanel />
    </div>

    <MenuButton />
  </div>
);

export default AlertPage;

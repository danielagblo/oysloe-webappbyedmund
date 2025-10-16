import MenuButton from "../components/MenuButton";
import ProfileStats from "../components/ProfileStats";
import "../App.css";

const AlertsPanel = () => (
  <div className="flex flex-col items-center w-full h-full p-3 sm:p-4 bg-gray-100 text-gray-600">
    <div className="bg-white w-full max-w-3xl rounded-3xl shadow-sm flex flex-col h-[80vh] sm:h-[85vh] overflow-hidden mx-auto">
      
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100 flex-shrink-0">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold">Alerts</h2>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto custom-scroll p-4 sm:p-6 pb-24">
        <div className="space-y-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
            >
              <img
                src="/building.svg"
                alt="alert source"
                className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full flex-shrink-0"
              />
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">10 mins ago</span>
                <div className="text-sm sm:text-base">
                  <span className="font-semibold">Oysloe</span>
                  <span className="ml-1 break-words">
                    We’re excited to have you onboard. You’ve taken the first
                    step toward smarter shopping and selling. Big things await —
                    stay tuned!
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-14" />
      </div>
    </div>

    <MenuButton />
  </div>
);

const AlertPage = () => (
  <div className="flex flex-col lg:flex-row items-start justify-center w-full min-h-screen bg-[#f3f4f6] -mt-3 overflow-hidden">
    {/* Profile section */}
    <div className="w-full lg:w-[25%] p-4 lg:p-6 flex-shrink-0">
      <ProfileStats />
    </div>

    {/* Alerts section */}
    <div className="flex items-center justify-center w-full lg:flex-grow p-4 lg:min-h-screen">
      <AlertsPanel />
    </div>
  </div>
);

export default AlertPage;

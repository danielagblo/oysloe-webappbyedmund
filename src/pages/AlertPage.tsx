import MenuButton from "../components/MenuButton";
import ProfileStats from "../components/ProfileStats";
import "../App.css";

const AlertsPanel = () => (
  <div className="flex flex-col items-center w-full h-full p-2 bg-gray-100 text-gray-600 gap-8">
    <div className="m-4 bg-white w-full max-w-3xl rounded-3xl shadow-sm flex flex-col h-full overflow-hidden">
      {/* title stays fixed inside card */}
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-center text-3xl font-semibold">Alerts</h2>
      </div>

      {/* scrollable content */}
      <div className="flex-1 overflow-y-auto custom-scroll p-6 pb-24">
        <section className="mb-8">
          <h3 className="text-2xl font-medium mb-3">Today</h3>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3 p-2">
                <img
                  src="/building.svg"
                  alt="alert source"
                  className="w-10 h-10 object-cover rounded-full flex-shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">10 mins ago</span>
                  <div className="text-sm">
                    <span className="font-semibold">Oysloe</span>
                    <span className="ml-1 break-words">
                      We’re excited to have you onboard. You’ve taken the first
                      step toward smarter shopping and selling. Big things
                      await — stay tuned!
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-medium mb-3">Yesterday</h3>
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="flex items-start gap-3 p-2">
                <img
                  src="/building.svg"
                  alt="alert source"
                  className="w-10 h-10 object-cover rounded-full flex-shrink-0"
                />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">10 mins ago</span>
                  <div className="text-sm">
                    <span className="font-semibold">Oysloe</span>
                    <span className="ml-1 break-words">
                      We’re excited to have you onboard. You’ve taken the first
                      step toward smarter shopping and selling. Big things
                      await — stay tuned!
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-14" />
      </div>
    </div>

    <MenuButton />
  </div>
);

const AlertPage = () => (
  <div className="flex flex-col lg:flex-row items-start justify-center w-full h-screen overflow-hidden -mt-3">
    <div className="flex-shrink-0 w-[25%] bg-[#f3f4f6]" style={{ padding:"1.5rem 1rem" }}>
      <ProfileStats />
    </div>
    <div className="flex-grow w-full h-full">
      <AlertsPanel />
    </div>
  </div>
);

export default AlertPage;

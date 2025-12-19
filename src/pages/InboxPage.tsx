import { useState } from "react";
import { useLocation } from "react-router-dom";
import LiveChat from "../components/LiveChat";
import MenuButton from "../components/MenuButton";
import MobileBanner from "../components/MobileBanner";
import ProfileStats from "../components/ProfileStats";
import SupportAndCases from "../components/SupportAndCases";

export default function InboxPage() {
  const location = useLocation();
  const initialOpen = (location.state as any)?.openRoom ?? null;
  const [selectedCase, setSelectedCase] = useState<string | null>(initialOpen);

  return (
    <div className="relative bg-[#ededed] min-h-screen h-screen w-full overflow-hidden">
      <div className="lg:hidden w-full">
        <MobileBanner page="Inbox" />
      </div>

      {/* Page content */}
      <div className="flex w-full h-full overflow-hidden lg:items-center">
        {/* Profile Stats (Desktop only) */}
        <div className="hidden lg:flex w-[25vw] h-[100vh] items-center justify-center pl-2">
          <ProfileStats />
        </div>

        {/* Live Chat — desktop: right column; mobile: full-screen when open */}
        {/* Support list is hidden on mobile when chat is open; chat becomes full-screen */}
        <div
          className={`lg:w-[50vw] w-full h-screen overflow-y-auto no-scrollbar lg:py-5 lg:pr-1 ${selectedCase ? "hidden lg:block" : ""}`}
        >
          <SupportAndCases
            onSelectCase={(caseId) =>
              setSelectedCase((prev) => (prev === caseId ? null : caseId))
            }
            onSelectChat={(chatId) =>
              setSelectedCase((prev) => (prev === chatId ? null : chatId))
            }
          />
        </div>

        {/* Desktop right column */}
        <div className="hidden lg:flex lg:w-[50%] lg:grow lg:justify-center lg:items-center w-full h-screen overflow-y-auto lg:py-5 lg:px-1.5 lg:mr-1">
          <LiveChat
            caseId={selectedCase}
            onClose={() => setSelectedCase(null)}
          />
        </div>

        {/* Mobile full-screen chat overlay */}
        {selectedCase && (
          <div className="lg:hidden fixed inset-0 z-400 bg-white">
            <div className="h-full w-full">
              <LiveChat
                caseId={selectedCase}
                onClose={() => setSelectedCase(null)}
              />
            </div>
          </div>
        )}

        {/* Bottom nav */}
        <MenuButton />
      </div>
    </div>
  );
}

import { useState } from "react";
import LiveChat from "../components/LiveChat";
import MenuButton from "../components/MenuButton";
import MobileBanner from "../components/MobileBanner";
import ProfileStats from "../components/ProfileStats";
import SupportAndCases from "../components/SupportAndCases";

export default function InboxPage() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  return (
    <div className="relative bg-[var(--div-active)] min-h-screen h-screen w-full overflow-hidden">
      {/* Mobile top banner */}
      <div className="block sm:hidden w-full">
        <MobileBanner page="Inbox" />
      </div>

      {/* Page content */}
      <div className="flex flex-col sm:flex-row w-full h-full">
        {/* Profile Stats (Desktop only) */}
        <div className="hidden lg:block w-[25%] pl-3 h-full">
          <ProfileStats />
        </div>

        {/* Support & Cases */}
        <div
          className={`sm:w-[40%] w-full h-screen overflow-y-auto sm:py-5 sm:px-1.5 ${
            selectedCase ? "hidden sm:block" : ""
          }`}
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

        {/* Live Chat */}
        <div className="hidden sm:block sm:w-[35%] w-full h-screen overflow-y-auto sm:py-5 sm:pr-1.5">
          <LiveChat caseId={selectedCase} onClose={() => setSelectedCase(null)} />
        </div>
      </div>

      {/* Mobile full-screen chat overlay */}
      {selectedCase && (
        <div className="sm:hidden fixed inset-0 z-40 bg-white">
          <div className="h-full w-full">
            <LiveChat caseId={selectedCase} onClose={() => setSelectedCase(null)} />
          </div>
        </div>
      )}

      {/* Bottom nav (Mobile only) */}
      <MenuButton />
    </div>
  );
}

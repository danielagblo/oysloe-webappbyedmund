import { useState } from "react";
import LiveChat from "../components/LiveChat";
import MenuButton from "../components/MenuButton";
import MobileBanner from '../components/MobileBanner';
import ProfileStats from "../components/ProfileStats";
import SupportAndCases from "../components/SupportAndCases";

export default function InboxPage() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  return (
    <div className="relative bg-[var(--div-active)] min-h-screen h-screen w-full overflow-hidden">
      <div className="block sm:hidden w-full">
        <MobileBanner page="Inbox" />
      </div>

      {/* Page content */}
      <div className="flex w-full h-full">
        {/* Profile Stats (Desktop only) */}
        <div className="hidden lg:block pl-3 h-full">
          <ProfileStats />
        </div>

        {/* Support and Cases */}
        {/* <div className="sm:w-1/2 w-full h-screen overflow-y-auto sm:py-5 sm:px-4">
          <SupportAndCases
            onSelectCase={(caseId) => setSelectedCase(prev => (prev === caseId ? null : caseId))}
            onSelectChat={(chatId) => setSelectedCase(prev => (prev === chatId ? null : chatId))}
          />
        </div> */}

        {/* Live Chat — desktop: right column; mobile: full-screen when open */}
        {/* Support list is hidden on mobile when chat is open; chat becomes full-screen */}
        <div className={`sm:w-1/2 w-full h-screen overflow-y-auto sm:py-5 sm:px-4 ${selectedCase ? 'hidden sm:block' : ''}`}>
          <SupportAndCases
            onSelectCase={(caseId) => setSelectedCase(prev => (prev === caseId ? null : caseId))}
            onSelectChat={(chatId) => setSelectedCase(prev => (prev === chatId ? null : chatId))}
          />
        </div>

        {/* Desktop right column */}
        <div className="hidden sm:block sm:w-1/2 w-full h-screen overflow-y-auto sm:py-5 sm:px-4">
          <LiveChat
            caseId={selectedCase}
            onClose={() => setSelectedCase(null)}
          />
        </div>

        {/* Mobile full-screen chat overlay */}
        {selectedCase && (
          <div className="sm:hidden fixed inset-0 z-40 bg-white">
            <div className="h-full w-full">
              <LiveChat caseId={selectedCase} onClose={() => setSelectedCase(null)} />
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <MenuButton />
    </div>
  );
}

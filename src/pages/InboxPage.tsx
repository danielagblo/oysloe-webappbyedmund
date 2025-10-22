import { useState } from "react";
import LiveChat from "../components/LiveChat";
import MenuButton from "../components/MenuButton";
import MobileBanner from '../components/MobileBanner';
import ProfileStats from "../components/ProfileStats";
import SupportAndCases from "../components/SupportAndCases";

export default function InboxPage() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  return (
    <div className="relative bg-[#EDEDED] min-h-screen h-screen w-full overflow-hidden">
      <div className="sm:hidden w-full">
        <MobileBanner page="Inbox"/>
      </div>

      {/* Page content */}
      <div className="flex w-full h-full">
        {/* Profile Stats (Desktop only) */}
        <div className="hidden lg:block pl-3 h-full">
          <ProfileStats />
        </div>

        {/* Support and Cases */}
        <div className="w-1/2 h-screen overflow-y-auto py-8 px-2">
          <SupportAndCases onSelectCase={(caseId) => setSelectedCase(caseId)} />
        </div>

        {/* Live Chat — slides in when a case is selected */}
        <div className="w-1/2 h-screen overflow-y-auto py-8 px-4">
          <LiveChat
            caseId={selectedCase}
            onClose={() => setSelectedCase(null)}
          />
        </div>
      </div>

      {/* Bottom nav */}
      <MenuButton />
    </div>
  );
}

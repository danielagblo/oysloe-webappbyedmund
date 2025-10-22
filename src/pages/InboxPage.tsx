import { useState } from "react";
import MenuButton from "../components/MenuButton";
import MobileBanner from '../components/MobileBanner';
import ProfileStats from "../components/ProfileStats";
import SupportAndCases from "../components/SupportAndCases";
import LiveChat from "../components/LiveChat";

export default function InboxPage() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  return (
    <div className="relative bg-[#EDEDED] min-h-screen h-screen w-full overflow-hidden">
      <div className="sm:hidden w-full">
        <MobileBanner page="Inbox"/>
      </div>

      {/* Page content */}
      <div className="grid grid-cols-12 gap-2 pt-[4.5rem] lg:pt-0 h-full">
        {/* Profile Stats (Desktop only) */}
        <div className="hidden lg:block col-span-3 h-full">
          <ProfileStats />
        </div>

        {/* Support and Cases */}
        <div className="col-span-12 lg:col-span-5 h-full overflow-y-auto custom-scroll">
          <SupportAndCases onSelectCase={(caseId) => setSelectedCase(caseId)} />
        </div>

        {/* Live Chat — slides in when a case is selected */}
        <LiveChat
          caseId={selectedCase}
          onClose={() => setSelectedCase(null)}
        />
      </div>

      {/* Bottom nav */}
      <MenuButton popup />
    </div>
  );
}

// import MenuButton from "../components/MenuButton"
// import ProfileStats from "../components/ProfileStats"
// import SupportAndCases from "../components/SupportAndCases"
// import LiveChat from "../components/LiveChat"

// export default function InboxPage () {
//   return (
//     <div style={{ backgroundColor:"#EDEDED", height: "100vh", padding: "0.75rem"}}>
//         <div>
//             <div className="grid grid-cols-12 gap-2 pb-20 lg:pb-0">

//                 {/* Column 1: Profile Stats */}
//                 <ProfileStats />

//                 {/* Column 2: Support and Cases */}
//                 <SupportAndCases />

//                 {/* Column 3: Live Chat */}
//                 <LiveChat />
//             </div>
//         </div>

//       {/* Navigation */}
//       <MenuButton popup /> 
//     </div>
//   );
// }

import { useState } from "react";
import MenuButton from "../components/MenuButton";
import ProfileStats from "../components/ProfileStats";
import SupportAndCases from "../components/SupportAndCases";
import LiveChat from "../components/LiveChat";

export default function InboxPage() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  return (
    <div className="relative bg-[#EDEDED] min-h-screen h-screen w-full overflow-hidden">
      {/* Profile banner on mobile */}
      <div className="lg:hidden fixed top-0 left-0 w-full z-20">
        <ProfileStats />
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

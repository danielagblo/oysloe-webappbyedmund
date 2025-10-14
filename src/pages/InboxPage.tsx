import MenuButton from "../components/MenuButton"
import ProfileStats from "../components/ProfileStats"
import SupportAndCases from "../components/SupportAndCases"
import LiveChat from "../components/LiveChat"

export default function InboxPage () {
  return (
    <div style={{ backgroundColor:"#EDEDED", height: "100vh", padding: "0.75rem"}}>
        <div>
            <div className="grid grid-cols-12 gap-2 pb-20 lg:pb-0">

                {/* Column 1: Profile Stats */}
                <div className="col-span-12 lg:col-span-3 rounded-xl z">
                    <ProfileStats />
                </div>

                {/* Column 2: Support and Cases */}
                <div className="col-span-12 lg:col-span-5 rounded-xl overflow-hidden shadow-lg border border-gray-100">
                    <SupportAndCases />
                </div>

                {/* Column 3: Live Chat */}
                <div className="col-span-12 lg:col-span-4 rounded-xl overflow-hidden shadow-lg border border-gray-100">
                    <LiveChat />
                </div>
            </div>
        </div>

      {/* Navigation */}
      <MenuButton popup /> 
    </div>
  );
}
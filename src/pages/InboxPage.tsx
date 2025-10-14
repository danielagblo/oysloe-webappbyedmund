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
                <ProfileStats />

                {/* Column 2: Support and Cases */}
                <SupportAndCases />

                {/* Column 3: Live Chat */}
                <LiveChat />
            </div>
        </div>

      {/* Navigation */}
      <MenuButton popup /> 
    </div>
  );
}
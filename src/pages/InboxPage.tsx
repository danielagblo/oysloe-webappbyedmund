import {
  ChatBubbleLeftIcon,
  TagIcon
} from "@heroicons/react/24/outline";
import MenuButton from "../components/MenuButton"

const ProfileStats = () => {

    const Profile = () => (
        <div className="flex flex-col items-center pb-6 border-b border-gray-100">
            <img
                src="avatar.jpg" // Placeholder for the avatar image
                alt="pfp"
                className="w-24 h-24 rounded-full object-cover mb-4"
                style={{ height:"3rem", width:"3rem", backgroundColor:"pink" }}
            />
            <h2 className="text-xl font-semibold mb-1">Alexander Kowri</h2>
            <span className="text-xs text-green-500 font-medium bg-green-500/10 px-2 py-0.5 rounded">High Level</span>
        </div>
    )

    const AdStats = () => (
        <div style={{ display:"flex", gap:"1rem", width:"100%", justifyContent:"center", alignContent:"center", fontSize:"80%" }}>
            <div className="text-center" style={{ width:"100%", backgroundColor:"#EDEDED", padding:"0.2rem", borderRadius:"8px" }}>
                <p className="font-bold">900k</p>
                <p className="text-sm text-gray-500" style={{fontSize:"80%"}}>Active Ads</p>
            </div>
            <div className="text-center" style={{ width:"100%", backgroundColor:"#EDEDED", padding:"0.2rem", borderRadius:"8px" }}>
                <p className="font-bold">900k</p>
                <p className="text-sm text-gray-500" style={{fontSize:"80%"}}>Sold Ads</p>
            </div>
        </div>
    )

    const RatingReviews = () => (
        <div className="flex-grow" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <h3 className="text-5xl font-extrabold mb-1">4.5</h3>
            <p>★  ★  ★  ★  <span style={{color:"gray"}}>★</span></p>
            <p className="text-lg text-gray-600 mb-6">234 Reviews</p>
            <div style={{fontSize:"80%", width:"100%"}}>
                {[5, 5, 5, 5, 1].map((stars, index) => (
                    <div key={index} className="flex items-center mb-1.5" style={{ width: '100%' }}>
                        <span className="text-black w-8 text-sm">★ {stars}</span>
                            <div className="flex-1 h-1.25 bg-gray-200 rounded mx-2">
                                <div className="h-full bg-black rounded" style={{ width: '40%' }}></div>
                            </div>
                        <span className="text-sm text-gray-500 w-8" style={{fontSize:"80%"}}>50%</span>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div className="flex flex-col" style={{gap:"0.5rem"}}>
            <div style={{ padding: "2rem 1.5rem", borderRadius:"12px", backgroundColor:"#ffffff" }}>
                <Profile />
                <AdStats />
            </div>
            <div style={{ padding: "1rem 2rem", borderRadius:"12px", backgroundColor:"#ffffff" }}>
                <RatingReviews />
            </div>
        </div>
    )
};

const SupportAndCases = () => {

    const HeaderTabs = () => (
        <div className="flex w-[100%] justify-between">
            <div className="text-black px-8 py-1.5 rounded-lg flex gap-4" style={{ backgroundColor:"#EDEDED" }}>
                <ChatBubbleLeftIcon className="w-4 fill-black" />
                <div style={{ display:"flex", flexDirection:"column" }}>
                    <p style={{margin: "0", display:"inline"}}>Chat</p>
                    <span className=" text-gray-500" style={{fontSize: "70%"}}>0 unread</span>
                </div>
            </div>
            <div className="text-black px-8 py-1.5 rounded-lg flex gap-4" style={{backgroundColor:"#b1fab6"}}>
                <TagIcon className="w-4 inline" />
                <div style={{ display:"flex", flexDirection:"column" }}>
                    <p style={{margin: "0", display:"inline"}}>Support</p>
                    <span className="text-gray-500" style={{fontSize: "70%"}}>14 active</span>
                </div>
            </div>
        </div>
    )

    const GetHelp = () => (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mt-3 mb-1">Get Help Anytime</h2>
            <p className="text-gray-400 text-[80%] mb-4">
                If you are facing an issue, send us a report, we will respond to you immediately. Our support is active 24/7.
            </p>
            <div className="w-[100%] flex items-center justify-center">
                <button className="flex items-center justify-center bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-lg shadow-sm hover:bg-gray-200">
                    <p>Add case</p>
                    <span className="w-5 h-5 ml-2 text-green-500 bg-green-200 flex justify-center align-center" style={{borderRadius:"2rem", fontWeight:"bold", textAlign:"center"}}>
                        <p>+</p>
                    </span>
                </button>
            </div>
        </div>
    )

    const OpenCases = () => (
        <div>
            <h3 className="text-[1.2rem] font-semibold mb-2">Open Cases</h3>

            <div className="flex flex-col gap-2.5">
                {[
                    { date: 'Aug 21, 2025', status: 'Active', supportNum: "S678432", color: 'text-green-500', bg: "#acf3b1" },
                    { date: 'Aug 21, 2025', status: 'Active', supportNum: "S678432", color: 'text-green-500', bg: "#acf3b1" },
                    { date: 'Aug 21, 2025', status: 'Active', supportNum: "S678432", color: 'text-green-500', bg: "#acf3b1" },
                    { date: 'Aug 21, 2025', status: 'Closed', supportNum: "S678432", color: 'text-red-500', bg: "#e49995" },
                ].map((caseData, index) => (
                    <div key={index} style={{ display:"flex", flexDirection:"column"}}>
                        <p className="text-xs text-gray-400" style={{fontSize:"60%"}}>{caseData.date}</p>
                        <p style={{fontSize:"90%"}}>Support: {caseData.supportNum}</p>
                        <p className={`text-xs font-semibold ${caseData.color}`} style={{maxWidth:"fit-content", fontSize:"60%", backgroundColor: caseData.bg, padding: "0.15rem 0.3rem", borderRadius: "12px"}}>{caseData.status}</p>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div className="bg-white px-5 py-3 h-full flex flex-col">
            <HeaderTabs />
            <GetHelp />
            <OpenCases />
        </div>
    )    
};

// This component will probably be rewritten when we add functionality so here is a static, hard coded ver for now -N
const LiveChat = () => {

    const messages = [
        <div className="flex justify-start" style={{ position:"relative", height:"6.5rem" }}>
            <img src="kofi.jpg" alt="pfp" className="w-8 h-8 rounded-full object-cover z-10 mr-2 self-start" style={{ backgroundColor:"lightblue" }}/>
            <div className="max-w-xs">
                <p className="font-semibold text-sm mb-1">Kofi</p>
                <div style={{ position:"absolute", left:"8px" }}>
                    <div className="bg-gray-100 p-3 rounded-xl rounded-tl-none">
                        <p className="text-sm">Hi,can i grab? your product.i need this item to buy</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">12:00</p>
                </div>    
            </div>
        </div>,
        <div className="flex justify-end" style={{ position:"relative", height:"6.5rem" }}>
            <div className="max-w-xs">
                <p className="font-semibold text-sm mb-1 text-right">You</p>
                <div style={{ position:"absolute", right:"8px" }}>
                    <div className="bg-[#e9fcef] text-black p-3 rounded-xl rounded-tr-none">
                        <p className="text-sm">Hi,can i grab? your product.i need this item to buy</p>
                    </div>
                    <p className="text-xs text-gray-200 mt-1 text-left">12:00</p>
                </div>
            </div>
            <img src="your-avatar.jpg" alt="You" className="w-8 h-8 rounded-full object-cover ml-2 z-10 self-start" style={{ height:"2rem", width:"2rem", backgroundColor:"lightblue" }}/>
        </div>,
        <div className="flex justify-end" style={{ position:"relative", height:"6.5rem" }}>
            <div className="max-w-xs">
                <p className="font-semibold text-sm mb-1 text-right">You</p>
                <div style={{ position:"absolute", right:"8px" }}>
                    <div className="bg-[#e9fcef] text-black p-3 rounded-xl rounded-tr-none">
                        <p className="text-sm">Hi,can i grab?</p>
                    </div>
                    <p className="text-xs text-gray-200 mt-1 text-left">12:00</p>
                </div>
            </div>
            <img src="your-avatar.jpg" alt="You" className="w-8 h-8 rounded-full object-cover ml-2 z-10 self-start"  style={{ height:"2rem", width:"2rem", backgroundColor:"lightblue" }}/>
        </div>

    ]

    const ChatInput = () => (
        <div className="border-gray-200 flex justify-center items-center absolute bottom-6 w-full">
            <div className="flex flex-row justify-center items-center w-80%" style={{ border: "1px solid #00000030", borderRadius:"20px", padding:"0.5rem 1rem" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 19C24 19.553 23.552 20 23 20H20V23C20 23.553 19.552 24 19 24C18.448 24 18 23.553 18 23V20H15C14.448 20 14 19.553 14 19C14 18.447 14.448 18 15 18H18V15C18 14.447 18.448 14 19 14C19.552 14 20 14.447 20 15V18H23C23.552 18 24 18.447 24 19ZM16 7C16.551 7 17 6.552 17 6C17 5.448 16.551 5 16 5C15.449 5 15 5.448 15 6C15 6.552 15.449 7 16 7ZM4.808 9.151L0 13.959V5C0 2.243 2.243 0 5 0H17C19.757 0 22 2.243 22 5V12H19C17.415 12 16.115 13.235 16.008 14.793L10.366 9.151C8.833 7.618 6.34 7.618 4.808 9.151ZM13 6C13 7.654 14.346 9 16 9C17.654 9 19 7.654 19 6C19 4.346 17.654 3 16 3C14.346 3 13 4.346 13 6ZM12 19C12 17.537 13.052 16.316 14.44 16.053L8.952 10.565C8.2 9.814 6.976 9.813 6.222 10.565L0 16.787V17C0 19.757 2.243 22 5 22H12V19Z" fill="#374957"/>
                </svg>

                <input
                    type="text"
                    placeholder="   Type a message..."
                    className="flex-1 border-0 focus:ring-0 text-gray-700"
                />
                <svg width="16" height="16" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.00391 9C1.65694 20.4026 16.1613 18.8902 16.1667 9.00827" stroke="#374957" stroke-width="2"/>
                    <rect x="4.66406" y="0.5" width="7" height="12" rx="3.5" fill="#374957" stroke="#374957"/>
                    <rect x="7.66406" y="19.5" width="2" height="4" fill="#374957" stroke="#374957"/>
                </svg>
            </div>
        </div>
    )
    return (
        <div className="bg-white h-full flex flex-col relative">
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                <p className="text-xs text-gray-400 text-center mb-6">Yesterday</p>

                {messages}

                <p className="text-xs text-gray-400 text-center my-6">Today</p>
            </div>
            <ChatInput />
        </div>
    )
};

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
      <MenuButton /> 
    </div>
  );
}
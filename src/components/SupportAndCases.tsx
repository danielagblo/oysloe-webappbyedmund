import {
  ChatBubbleLeftIcon,
  TagIcon
} from "@heroicons/react/24/outline";

export default function SupportAndCases () {

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
        <div className="col-span-12 lg:col-span-5 rounded-xl overflow-hidden shadow-lg border border-gray-100">
            <div className="bg-white px-5 py-3 h-full flex flex-col">
                <HeaderTabs />
                <GetHelp />
                <OpenCases />
            </div>
        </div>
    )    
};

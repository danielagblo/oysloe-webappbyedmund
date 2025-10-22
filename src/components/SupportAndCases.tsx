import {
    ChatBubbleLeftIcon,
    TagIcon
} from "@heroicons/react/24/outline";

type SupportAndCasesProps = {
    onSelectCase?: (caseId: string) => void;
};

export default function SupportAndCases({ onSelectCase }: SupportAndCasesProps) {

    const HeaderTabs = () => (
        <div className="flex w-[100%] gap-5">
            <div className="text-black w-1/4 pl-2 py-1.5 rounded-2xl flex gap-4" style={{ backgroundColor: "#EDEDED" }}>
                <ChatBubbleLeftIcon className="w-4 fill-black" />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ margin: "0", display: "inline" }}>Chat</p>
                    <span className=" text-gray-500" style={{ fontSize: "70%" }}>0 unread</span>
                </div>
            </div>
            <div className="text-black w-1/4 pl-2 py-1.5 rounded-2xl flex gap-4" style={{ backgroundColor: "#b1fab6" }}>
                <TagIcon className="w-4 inline" />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ margin: "0", display: "inline" }}>Support</p>
                    <span className="text-gray-500" style={{ fontSize: "70%" }}>14 active</span>
                </div>
            </div>
        </div>
    )

    const GetHelp = () => (
        <div className="mb-8">
            <h2 className="text-xl font-medium mt-3 mb-1">Get Help Anytime</h2>
            <p className="text-gray-400 text-xs mb-4">
                If you are facing an issue, send us a report, we will respond to you immediately. Our support is active 24/7.
            </p>
            <div className="w-[100%] flex items-center justify-center">
                <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-2xl hover:bg-gray-200">
                    <p>Add case</p>
                    <span className="w-5 h-5 ml-2 text-green-500 bg-green-200 flex justify-center align-center" style={{ borderRadius: "2rem", fontWeight: "bold", textAlign: "center" }}>
                        <p>+</p>
                    </span>
                </button>
            </div>
        </div>
    )

    const OpenCases = () => (
        <div>
            <h3 className="text-sm font-medium mb-2">Open Case</h3>

            <div className="flex flex-col gap-2.5">
                {[
                    { date: 'Aug 21, 2025', status: 'Active', supportNum: "S678432", color: 'text-[var(--dark-def)]', bg: "#acf3b1" },
                    { date: 'Aug 21, 2025', status: 'Active', supportNum: "S678432", color: 'text-[var(--dark-def)]', bg: "#acf3b1" },
                    { date: 'Aug 21, 2025', status: 'Active', supportNum: "S678432", color: 'text-[var(--dark-def)]', bg: "#acf3b1" },
                    { date: 'Aug 21, 2025', status: 'Closed', supportNum: "S678432", color: 'text-[var(--some-gray)]', bg: "#e49995" },
                ].map((caseData, index) => (
                    <button
                        key={index}
                        onClick={() => onSelectCase?.(caseData.supportNum)}
                        className="text-left p-2 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                        style={{ display: "flex", flexDirection: "column" }}
                        aria-pressed="false"
                    >
                        <p className="text-xs text-gray-400" style={{ fontSize: "60%" }}>{caseData.date}</p>
                        <p style={{ fontSize: "90%" }}>Support: {caseData.supportNum}</p>
                        <p className={`text-xs font-medium ${caseData.color}`} style={{ maxWidth: "fit-content", fontSize: "60%", backgroundColor: caseData.bg, padding: "0.08rem 0.3rem" }}>{caseData.status}</p>
                    </button>
                ))}
            </div>
        </div>
    )

    return (
        <div className="flex border h-full border-gray-100">
            <div className="rounded-2xl bg-white px-5 py-3 h-full w-full flex flex-col">
                <HeaderTabs />
                <GetHelp />
                <OpenCases />
            </div>
        </div>
    )
};

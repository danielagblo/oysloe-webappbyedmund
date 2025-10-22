import {
    ChatBubbleLeftIcon,
    TagIcon
} from "@heroicons/react/24/outline";
import { useState } from "react";

type SupportAndCasesProps = {
    onSelectCase?: (caseId: string) => void;
    onSelectChat?: (chatId: string) => void; // added prop for chats
};

export default function SupportAndCases({ onSelectCase, onSelectChat }: SupportAndCasesProps) {

    const [activeTab, setActiveTab] = useState<'chat' | 'support'>('chat');

    const HeaderTabs = () => (
        <div className="flex w-[100%] gap-5">
            <button
                type="button"
                onClick={() => setActiveTab('chat')}
                aria-pressed={activeTab === 'chat'}
                className={`text-black w-2/5 pl-3 py-1.5 rounded-2xl flex gap-4 items-center justify-start bg-[#EDEDED] ${activeTab === 'chat' ? 'bg-[#b1fab6]' : 'bg-[#EDEDED]'}`}
            >
                <ChatBubbleLeftIcon className="w-4 fill-black" />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ margin: "0", display: "inline" }}>Chat</p>
                    <span className=" text-gray-500" style={{ fontSize: "70%" }}>0 unread</span>
                </div>
            </button>
            <button
                type="button"
                onClick={() => setActiveTab('support')}
                aria-pressed={activeTab === 'support'}
                className={`text-black w-2/5 pl-3 py-1.5 rounded-2xl flex gap-4 items-center justify-start bg-[#EDEDED] ${activeTab === 'support' ? 'bg-[#b1fab6]' : 'bg-[#EDEDED]'}`}
            >
                <TagIcon className="w-4 inline" />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <p style={{ margin: "0", display: "inline" }}>Support</p>
                    <span className="text-gray-500" style={{ fontSize: "70%" }}>14 active</span>
                </div>
            </button>
        </div>
    )

    // Chats block (new) - matches style of GetHelp/OpenCases
    const GetChats = () => (
        <div className="mb-6">
            <h2 className="text-xl font-medium mt-3 mb-1">Recent Chats</h2>
            <p className="text-gray-400 text-xs mb-4">
                Continue conversations with support or other users. Tap a chat to open it.
            </p>
            <div className="w-[100%] flex items-center justify-center mb-8">
                <button
                    className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-2xl hover:bg-gray-200"
                    onClick={() => onSelectChat?.("new")}
                >
                    <p>Start new chat</p>
                    <span className="w-5 h-5 ml-2 text-green-500 bg-green-200 flex justify-center items-center" style={{ borderRadius: "2rem", fontWeight: "bold", textAlign: "center" }}>
                        <p>+</p>
                    </span>
                </button>
            </div>
            <div className="flex flex-col gap-2 mb-3">
                {[
                    { id: "C1235", name: "John Doe", last: "Thanks, I'll check it out", time: "1d" },
                    { id: "C1236", name: "Seller X", last: "Are you still interested?", time: "3d" },
                ].map((c) => (
                    <button
                        key={c.id}
                        onClick={() => onSelectChat?.(c.id)}
                        className="text-left p-2 rounded hover:bg-gray-50 focus:outline-none flex items-start gap-3"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">
                            {c.name.split(" ").map(s => s[0]).slice(0, 2).join("")}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">{c.name}</p>
                                <span className="text-xs text-gray-400">{c.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{c.last}</p>
                        </div>
                    </button>
                ))}
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
                <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-2xl hover:bg-gray-200" onClick={() => onSelectChat?.("new")}>
                    <p>Add case</p>
                    <span className="w-5 h-5 ml-2 text-green-500 bg-green-200 flex justify-center items-center" style={{ borderRadius: "2rem", fontWeight: "bold", textAlign: "center" }}>
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
                        className="text-left p-2 rounded hover:bg-gray-50 focus:outline-none"
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
            <div className="rounded-2xl bg-white px-5 py-3 h-full w-full flex flex-col no-scrollbar overflow-y-auto">
                <HeaderTabs />
                {activeTab === 'chat' ? (
                    <GetChats />
                ) : (
                    <>
                        <GetHelp />
                        <OpenCases />
                    </>
                )}
            </div>
        </div>
    )
};

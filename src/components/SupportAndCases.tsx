import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import type { ChatRoom } from "../services/chatService";
import chatService from "../services/chatService";

type SupportAndCasesProps = {
  onSelectCase?: (caseId: string) => void;
  onSelectChat?: (chatId: string) => void; // added prop for chats
};

export default function SupportAndCases({
  onSelectCase,
  onSelectChat,
}: SupportAndCasesProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "support">("chat");

  const HeaderTabs = () => (
    <div className="flex items-center justify-center w-[100%] gap-5">
      <button
        type="button"
        onClick={() => setActiveTab("chat")}
        aria-pressed={activeTab === "chat"}
        className={`text-black w-2/5 pl-3 py-1.5 rounded-2xl flex gap-4 items-center justify-start bg-[#EDEDED] ${activeTab === "chat" ? "bg-[#b1fab6]" : "bg-[#EDEDED]"}`}
      >
        <ChatBubbleLeftIcon className="w-4 fill-[var(--dark-def)]" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ margin: "0", display: "inline" }}>Chat</p>
          <span className=" text-gray-500" style={{ fontSize: "70%" }}>
            0 unread
          </span>
        </div>
      </button>
      <button
        type="button"
        onClick={() => setActiveTab("support")}
        aria-pressed={activeTab === "support"}
        className={`text-black w-2/5 pl-3 py-1.5 rounded-2xl flex gap-4 items-center justify-start bg-[#EDEDED] ${activeTab === "support" ? "bg-[#b1fab6]" : "bg-[#EDEDED]"}`}
      >
        <svg
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.94737 0C7.6023 0 5.35327 0.884998 3.69506 2.4603C2.03684 4.03561 1.10526 6.17218 1.10526 8.4V10.395C0.771842 10.671 0.501683 11.0091 0.311553 11.3884C0.121423 11.7677 0.0153781 12.1801 0 12.6C0.025175 13.2088 0.243365 13.7963 0.62598 14.2853C1.00859 14.7743 1.53779 15.1421 2.14421 15.3405C3.58105 18.606 6.46579 21 9.94737 21H13.2632V18.9H9.94737C7.44947 18.9 5.18368 17.115 4.04526 14.2905L3.81316 13.713L3.16105 13.65C2.89548 13.6143 2.65262 13.4882 2.47774 13.295C2.30286 13.1018 2.20789 12.8548 2.21053 12.6C2.21169 12.4168 2.26331 12.237 2.36026 12.0786C2.45721 11.9202 2.59611 11.7886 2.76316 11.697L3.31579 11.3925V9.45C3.31579 9.17152 3.43224 8.90445 3.63951 8.70754C3.84679 8.51062 4.12792 8.4 4.42105 8.4H15.4737C15.7668 8.4 16.0479 8.51062 16.2552 8.70754C16.4625 8.90445 16.5789 9.17152 16.5789 9.45V14.7H12.0584C11.9581 14.4327 11.7836 14.1961 11.5534 14.0153C11.3232 13.8344 11.0458 13.716 10.7506 13.6726C10.4554 13.6291 10.1533 13.6623 9.87631 13.7685C9.5993 13.8747 9.35765 14.0501 9.17689 14.276C8.99614 14.502 8.88301 14.7701 8.84945 15.0521C8.81589 15.3341 8.86315 15.6194 8.98625 15.878C9.10934 16.1366 9.30369 16.3588 9.54874 16.5211C9.7938 16.6834 10.0805 16.7797 10.3784 16.8H18.7895C19.3757 16.8 19.938 16.5787 20.3526 16.1849C20.7671 15.7911 21 15.257 21 14.7V12.6C21 12.043 20.7671 11.5089 20.3526 11.1151C19.938 10.7212 19.3757 10.5 18.7895 10.5V8.4C18.7895 6.17218 17.8579 4.03561 16.1997 2.4603C14.5415 0.884998 12.2924 0 9.94737 0Z"
            fill="#374957"
          />
        </svg>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{ margin: "0", display: "inline" }}>Support</p>
          <span className="text-gray-500" style={{ fontSize: "70%" }}>
            14 active
          </span>
        </div>
      </button>
    </div>
  );

  // Chats block (new) - matches style of GetHelp/OpenCases
  const GetChats = () => (
    <div className="mb-6">
      <h2 className="text-xl font-medium mt-3 mb-1">Recent Chats</h2>
      <p className="text-gray-400 text-xs mb-4">
        Continue conversations with support or other users. Tap a chat to open
        it.
      </p>
      <div className="w-[100%] flex items-center justify-center mb-8">
        <button
          className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-2xl hover:bg-gray-200"
          onClick={() => onSelectChat?.("new")}
        >
          <p>Start new chat</p>
          <span
            className="w-5 h-5 ml-2 text-green-500 bg-green-200 flex justify-center items-center"
            style={{
              borderRadius: "2rem",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            <p>+</p>
          </span>
        </button>
      </div>
      <ChatsList />
    </div>
  );

  function ChatsList() {
    const [rooms, setRooms] = useState<ChatRoom[] | null>(null);

    useEffect(() => {
      let mounted = true;
      (async () => {
        try {
          const data = await chatService.listChatRooms();
          if (mounted) setRooms(data);
        } catch (e) {
          console.error("Failed to load chat rooms", e);
          if (mounted) setRooms([]);
        }
      })();
      return () => {
        mounted = false;
      };
    }, []);

    if (!rooms) return <p className="text-sm text-gray-500">Loading chats…</p>;
    if (rooms.length === 0) return <p className="text-sm text-gray-500">No recent chats</p>;

    return (
      <div className="flex flex-col gap-2 mb-3">
        {rooms.map((r) => (
          <button
            key={r.id}
            onClick={() => onSelectChat?.(String(r.id))}
            className="text-left p-2 rounded hover:bg-gray-50 focus:outline-none flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold">
              {r.name
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{r.name}</p>
                <span className="text-xs text-gray-400">{r.messages?.length ? `${Math.max(0, r.messages!.length - 1)}m` : ""}</span>
              </div>
              <p className="text-xs text-gray-500 truncate">{r.messages && r.messages.length ? r.messages[r.messages.length - 1].content : ""}</p>
            </div>
          </button>
        ))}
      </div>
    );
  }

  const GetHelp = () => (
    <div className="mb-8">
      <h2 className="text-xl font-medium mt-3 mb-1">Get Help Anytime</h2>
      <p className="text-gray-400 text-xs mb-4">
        If you are facing an issue, send us a report, we will respond to you
        immediately. Our support is active 24/7.
      </p>
      <div className="w-[100%] flex items-center justify-center">
        <button
          className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-medium py-4 px-6 rounded-2xl hover:bg-gray-200"
          onClick={() => onSelectChat?.("new")}
        >
          <p>Add case</p>
          <span
            className="w-5 h-5 ml-2 text-green-500 bg-green-200 flex justify-center items-center"
            style={{
              borderRadius: "2rem",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            <p>+</p>
          </span>
        </button>
      </div>
    </div>
  );

  const OpenCases = () => (
    <div>
      <h3 className="text-sm font-medium mb-2">Open Case</h3>

      <div className="flex flex-col gap-2.5">
        {[
          {
            date: "Aug 21, 2025",
            status: "Active",
            supportNum: "S678432",
            color: "text-[var(--dark-def)]",
            bg: "#acf3b1",
          },
          {
            date: "Aug 21, 2025",
            status: "Active",
            supportNum: "S678432",
            color: "text-[var(--dark-def)]",
            bg: "#acf3b1",
          },
          {
            date: "Aug 21, 2025",
            status: "Active",
            supportNum: "S678432",
            color: "text-[var(--dark-def)]",
            bg: "#acf3b1",
          },
          {
            date: "Aug 21, 2025",
            status: "Closed",
            supportNum: "S678432",
            color: "text-[var(--some-gray)]",
            bg: "#e49995",
          },
        ].map((caseData, index) => (
          <button
            key={index}
            onClick={() => onSelectCase?.(caseData.supportNum)}
            className="text-left p-2 rounded hover:bg-gray-50 focus:outline-none"
            style={{ display: "flex", flexDirection: "column" }}
            aria-pressed="false"
          >
            <p className="text-xs text-gray-400" style={{ fontSize: "60%" }}>
              {caseData.date}
            </p>
            <p style={{ fontSize: "90%" }}>Support: {caseData.supportNum}</p>
            <p
              className={`text-xs font-medium ${caseData.color}`}
              style={{
                maxWidth: "fit-content",
                fontSize: "60%",
                backgroundColor: caseData.bg,
                padding: "0.08rem 0.3rem",
              }}
            >
              {caseData.status}
            </p>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full">
      <div className="rounded-2xl bg-white px-5 py-3 h-full w-full flex flex-col ">
        <HeaderTabs />
        <div className="no-scrollbar overflow-y-auto mt-4 flex-1">
          {activeTab === "chat" ? (
            <GetChats />
          ) : (
            <>
              <GetHelp />
              <OpenCases />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

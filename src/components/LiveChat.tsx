import { useEffect, useRef, useState } from "react";
import useChat from "../hooks/useChat";
import type { Message as ChatMessage } from "../services/chatService";
type LiveChatProps = {
  caseId: string | null;
  onClose: () => void;
};

export default function LiveChat({ caseId, onClose }: LiveChatProps) {
  const { messages, sendMessage, addLocalMessage } = useChat(caseId);
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!caseId) return;

    let mounted = true;

    // hook handles loading and websocket lifecycle
    // nothing to do here anymore
    return () => {
      mounted = false;
    };
  }, [caseId]);

  useEffect(() => {
    // scroll to bottom on new message
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  if (!caseId) return null;

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    // optimistic UI
    const optimistic: ChatMessage = {
      id: Date.now(),
      room: Number(caseId as any),
      sender: { id: 0, name: "Me" },
      content: text,
      created_at: new Date().toISOString(),
    };
    addLocalMessage(optimistic);

    try {
      await sendMessage(text);
    } catch (e) {
      console.error("Failed to send message", e);
    }
  };

  const ChatInput = () => (
    <div className="relative flex gap-2 w-full">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void handleSend();
          }
        }}
        type="text"
        placeholder="Start a chat"
        style={{ border: "1px solid var(--div-border)" }}
        className="rounded-2xl px-10 py-3 bg-[url('/send.svg')] bg-[length:20px_20px] bg-[center_right_12px] bg-no-repeat sm:bg-white text-sm w-full sm:border-[var(--dark-def)]"
      />
      <button
        onClick={() => void handleSend()}
        style={{ border: "1px solid var(--div-border)" }}
        className="p-2 rounded-2xl hover:bg-gray-300 sm:bg-white"
      >
        <img src="/audio.svg" alt="" className="w-7 h-5" />
      </button>
      <button className="absolute bottom-3 left-3">
        <img src="/image.png" alt="" className="w-5 h-auto" />
      </button>
    </div>
  );

  return (
    <div className="flex h-full border-gray-100 ">
      <div ref={containerRef} className="relative rounded-2xl bg-white px-4 py-3 h-full w-full flex flex-col">
        <button className="absolute right-1 block sm:hidden" onClick={onClose}>
          <img src="/close.svg" alt="" className="p-2" />
        </button>
        <div className="flex-1 p-3 overflow-y-auto space-y-6">
          <p className="text-xs text-gray-400 text-center mb-6">Chat</p>

          {messages.map((msg) => (
            <div key={msg.id} className={msg.sender?.id === 0 ? "flex justify-end" : "flex justify-start"}>
              <div className={`flex flex-col items-${msg.sender?.id === 0 ? "end" : "start"}`}>
                <div className="inline-flex items-center  z-20 -mb-2 gap-2">
                  {msg.sender?.id !== 0 && <img src="/face.svg" alt="User" className="w-8 h-8 rounded-full" />}
                  <p className="text-sm inline">{msg.sender?.name ?? (msg.sender?.id === 0 ? "Me" : "User")}</p>
                </div>
                <div className={`border border-gray-200 p-3 rounded-xl ${msg.sender?.id === 0 ? "bg-green-100 rounded-tr-none text-black" : "rounded-tl-none"}`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}

        </div>

        <ChatInput />
      </div>
    </div>
  );
}

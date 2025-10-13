import { useEffect, useRef, useState } from "react";
import MenuButton from "../components/MenuButton";
import ProfileCard from "../components/ProfileCard";

type Message = { id: number; fromMe: boolean; text: string; author: string; ts: string }; // ts = ISO timestamp

const InboxPage = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, fromMe: false, author: 'Oysloe Support', ts: new Date().toISOString(), text: "Hi, how can I help you?" },
        { id: 2, fromMe: true, author: 'You', ts: new Date().toISOString(), text: "I have a question about my order." },
    ]);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const sendMessage = () => {
        const text = input.trim();
        if (!text) return;
        setMessages((prev) => [...prev, { id: Date.now(), fromMe: true, author: 'You', ts: new Date().toISOString(), text }]);
        setInput("");
    };

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") sendMessage();
    };

    return (
        <div className="flex flex-col items-center w-screen h-screen p-10 bg-gray-100 text-gray-600 gap-12 overflow-hidden">
            <div className="h-full w-full flex justify-center items-center gap-5 rounded-2xl">
                <div className="flex w-3/4 rounded-2xl bg-white h-full justify-center items-center pt-12">
                    <div className="w-2/5 m-4 flex flex-col h-full ">
                        <div className="flex gap-3 mb-4">
                            <div className="bg-gray-100 rounded-lg py-2 px-4 w-2/3 h- text-xs flex justify-start items-start gap-2">
                                <img src="/quick chat.svg" alt="" className="w-3 h-auto" />
                                <div>
                                    <h2>Chat</h2>
                                    <h2>9 unread</h2>
                                </div>
                            </div>
                            <div className="bg-gray-100 rounded-lg py-2 px-4 w-2/3 h- text-xs flex justify-start items-start gap-2">
                                <img src="/support.svg" alt="" className="w-3 h-auto" />
                                <div>
                                    <h2>Support</h2>
                                    <h2>2 unread</h2>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold">Get Help Anytime</h2>
                            <p className="font-light">If you are facing an issue,send us a report,we will respond to you immediately.Our support is active 24/7.  </p>
                        </div>
                        <div className="m-auto">
                            <button className="flex items-center gap-2 bg-gray-100 p-3 rounded-2xl">New Message <img src="/home.svg" className="h-6 w-6" alt="" /></button>
                        </div>
                    </div>
                    <div className="w-2/5 m-4 flex flex-col h-full">
                        <div className="bg-gray-100 h-9/10 w-full rounded-2xl ">
                            {/* Message area */}
                            <div className="flex flex-col h-full min-h-0">
                                <div className="p-4 flex flex-row-reverse items-center gap-3">
                                    <img src="/skip.svg" className="w-4 h-4 rounded-full" alt="contact" />
                                    <div>
                                        <div className="font-medium text-sm">Oysloe Support</div>
                                    </div>
                                </div>

                                <div ref={scrollRef} className="flex-1 min-h-0 overflow-auto p-4 space-y-3 custom-scroll">
                                    {messages.map((m, idx) => {
                                        // date separator when day changes (or first item)
                                        const showDate = (() => {
                                            if (idx === 0) return true;
                                            const prev = new Date(messages[idx - 1].ts);
                                            const cur = new Date(m.ts);
                                            return prev.toDateString() !== cur.toDateString();
                                        })();

                                        return (
                                            <div key={m.id}>
                                                {showDate && (
                                                    <div className="w-full flex justify-center my-2">
                                                        <div className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">{new Date(m.ts).toDateString()}</div>
                                                    </div>
                                                )}

                                                <div className={`w-full ${m.fromMe ? 'flex justify-end' : 'flex justify-start'}`}>
                                                    <div className="max-w-[75%]">
                                                        <div className={`flex items-center gap-2 ${m.fromMe ? 'justify-end' : 'justify-start'}`}>
                                                            {!m.fromMe && (
                                                                <img src="/building.svg" alt="contact" className="w-6 h-6 rounded-full" />
                                                            )}
                                                            <div className="text-xs text-gray-500 font-medium">{m.author}</div>
                                                            {m.fromMe && (
                                                                <img src="/home.svg" alt="you" className="w-6 h-6 rounded-full" />
                                                            )}
                                                        </div>

                                                        <div className={`${m.fromMe ? 'bg-green-600 text-white' : 'bg-white text-gray-800'} mt-2 p-3 rounded-lg shadow-sm`}>
                                                            {m.text}
                                                        </div>

                                                        <div className={`text-xs text-gray-500 mt-1 ${m.fromMe ? 'text-right' : 'text-left'}`}>
                                                            {new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="p-3 border-t border-gray-200 bg-white">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Start a chat"
                                            className="flex-1 border border-gray-200 rounded-lg px-3 py-3 bg-[url('/send.svg')] bg-[length:20px_20px] bg-[center_right_12px] bg-no-repeat text-sm w-full"
                                            onKeyDown={handleKey}
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                        />
                                        <button onClick={sendMessage} className="bg-white border-2 border-gray-200 p-2 rounded-lg hover:bg-gray-300">
                                            <img src="/audio.svg" alt="" className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div className="h-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ProfileCard />
            </div>
            <MenuButton />
        </div>
    );
}

export default InboxPage;

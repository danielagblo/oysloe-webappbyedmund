type LiveChatProps = {
  caseId: string | null;
  onClose: () => void;
};

export default function LiveChat({ caseId, onClose }: LiveChatProps) {
  if (!caseId) return null;

  const ChatInput = () => (
    <div className="relative flex gap-2 w-full">
      <input
        type="text"
        placeholder="Start a chat"
        style={{ border: "1px solid var(--div-border)" }}
        className="rounded-2xl px-10 py-3 bg-[url('/send.svg')] bg-[length:20px_20px] bg-[center_right_12px] bg-no-repeat sm:bg-white text-sm w-full sm:border-[var(--dark-def)]"
      />
      <button style={{ border: "1px solid var(--div-border)" }} className="p-2 rounded-2xl hover:bg-gray-300 sm:bg-white">
        <img src="/audio.svg" alt="" className="w-7 h-5" />
      </button>
      <button className="absolute bottom-3 left-3" >
        <img src="/image.png" alt="" className="w-5 h-auto" />
      </button>
    </div>
  );

  return (
    <div className="flex h-full border-gray-100 ">
      <div className="relative rounded-2xl bg-white px-5 py-3 h-full w-full flex flex-col">
        <button className="absolute right-1 block sm:hidden" onClick={onClose}><img src="/close.svg" alt="" className="p-2" /></button>
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-gray-400 text-center mb-6">Yesterday</p>
          {/* Hardcoded messages for now */}
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-xl rounded-tl-none">
              <p className="text-sm">Hi, can I grab your product?</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-green-100 text-black p-3 rounded-xl rounded-tr-none">
              <p className="text-sm">Sure! Which one?</p>
            </div>
          </div>
        </div>

        <ChatInput />
      </div>
    </div>
  );
}

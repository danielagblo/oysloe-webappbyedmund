import React from "react";

interface QuickChatProps {
  quickChatInput: string;
  setQuickChatInput: (val: string) => void;
  openChatWithOwnerAndSend: (text: string) => Promise<void> | void;
}

const QuickChat: React.FC<QuickChatProps> = ({
  quickChatInput,
  setQuickChatInput,
  openChatWithOwnerAndSend,
}) => (
  <div className="w-full">
    <div className="pt-4 w-full">
      <div className="flex items-center gap-2 mb-3">
        <img src="/quick chat.svg" alt="" className="w-5 h-5" />
        <h6 className="font-semibold text-xs md:text-[1vw]">Quick Chat</h6>
      </div>
      <div className="flex flex-wrap max-sm:grid max-sm:grid-cols-2 flex-row gap-2 mb-4 w-full text-(--dark-def) font-medium justify-start">
        {[
          "Is this Original?",
          "Do you have delivery options?",
          "What is the warranty period?",
          "Can I see the service history?",
        ].map((text, i) => (
          <button
            key={i}
            className="px-1 py-2 bg-(--div-active) sm:bg-white rounded text-[11px] md:text-[0.9vw] max-sm:w-full max-sm:py-3 hover:bg-gray-100 whitespace-nowrap w-fit"
            onClick={async () => {
              await openChatWithOwnerAndSend(text);
            }}
          >
            {text}
          </button>
        ))}
      </div>

      <div className="flex gap-2 w-full items-center">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Start a chat"
            value={quickChatInput}
            onChange={(e) => setQuickChatInput(e.target.value)}
            style={{ border: "1px solid var(--div-border)" }}
            className="rounded-2xl px-3 py-3 bg-no-repeat sm:bg-white text-sm md:text-[1.125vw] w-full sm:border-(--dark-def)"
          />
          <img
            src="/send.svg"
            alt="Send"
            className="w-6 h-6 absolute top-3 right-2 cursor-pointer"
            role="button"
            tabIndex={0}
            onClick={async () => {
              if (!quickChatInput || quickChatInput.trim().length === 0) return;
              await openChatWithOwnerAndSend(quickChatInput.trim());
              setQuickChatInput("");
            }}
          />
        </div>

        <button
          style={{ border: "1px solid var(--div-border)" }}
          className="p-2 rounded-2xl hover:bg-gray-300 sm:bg-white shrink-0"
        >
          <svg className="w-6 h-6" viewBox="0 0 25 39" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.998535 14.625C1.98883 33.1542 23.9842 30.6966 23.9924 14.6384" stroke="#374957" strokeWidth="2" />
            <rect x="6.49268" y="0.5" width="11" height="20" rx="5.5" fill="#374957" stroke="#374957" />
            <rect x="10.4927" y="31.5" width="4" height="7" fill="#374957" stroke="#374957" />
          </svg>
        </button>
      </div>
      <div className="mt-4 whitespace-nowrap text-[10px] flex flex-nowrap gap-2 text-gray-600 justify-center items-center">
        <div className="flex items-center justify-end relative">
          <h4 className="bg-(--green) h-fit p-0 pl-1 pr-8 rounded-2xl md:text-[0.8vw]">
            Chat is secured
          </h4>
          <img
            src="/lock-on-svgrepo-com.svg"
            alt=""
            className="bg-(--green) z-10 rounded-full w-6 h-6 p-1 absolute"
          />
        </div>
        <div className="flex items-center gap-1 md:text-[0.8vw]">
          <img
            src="/shield.svg"
            alt=""
            className="w-3 h-3 md:w-[0.9vw] md:h-[0.9vw]"
          />
          <h4>Always chat here for Safety reasons!</h4>
        </div>
      </div>
    </div>
  </div>
);

export default React.memo(QuickChat);

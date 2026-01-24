import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import useFeedbacks, {
  useCreateFeedback,
} from "../features/feedback/useFeedback";
import { useChatRooms } from "../hooks/useChatRooms";
import type { ChatRoom } from "../services/chatService";
import { getCaseId, getCaseStatus } from "../utils/chatFilters";
import { formatReviewDate } from "../utils/formatReviewDate";
import MobileBanner from "./MobileBanner";
type SupportAndCasesProps = {
  onSelectCase?: (caseId: string) => void;
  onSelectChat?: (chatId: string) => void;
};
const NewCaseContent = ({ setText, text, isSendable, setIsSendable, onSelectChat, setNewCaseOpen }: {
  setText: (value: string) => void,
  text: string,
  isSendable: boolean,
  setIsSendable: (value: boolean) => void,
  onSelectChat?: (chatId: string) => void,
  setNewCaseOpen: (value: boolean) => void,
}) => {
  useFeedbacks();
  const create = useCreateFeedback();
  // Touch optional prop to satisfy TS; actual uses are optional chaining where passed
  void onSelectChat;
  return (
    <div className=" max-sm:px-1 bg-white flex flex-col items-center justify-center gap-4 z-[60]">
      <p className="sm:hidden max-sm:pt-2 text-xl font-medium text-gray-700 w-full text-left">Request Support</p>
      <p className="max-sm:pt-1 max-sm:text-lg"><span className="font-medium">Need Help?</span> Send a message to our support team.</p>
      <div className="w-full flex items-center justify-center mt-2">
        <textarea
          placeholder="Let us know how we can help you..."
          value={text}
          onChange={(e) => {
            const value = e.target.value
            setText(value)
            setIsSendable(value.length >= 10)
          }}
          className="w-11/12 max-sm:text-base min-h-[20vh] border-2 border-gray-300 max-sm:w-full h-40 rounded-2xl text-base resize-none p-4  outline-0"
        />
      </div>
      <p>Please provide at least 10 characters.</p>
      <button
        onClick={async () => {
          if (!isSendable) {
            toast.error("Please provide more details before sending.")
            return;
          }
          else {
            //add logic to send message to admin - currently, endpoint does not exist
            await create.mutateAsync({ rating: 20, message: text });
            setNewCaseOpen(false);
            setText("");
            setIsSendable(false);
            toast.success("Your message has been sent to an admin.")
          }
        }}
        className={`hover:bg-gray-200 max-sm:text-lg rounded-xl transition w-11/12 max-sm:w-full p-3 ${!isSendable ? "cursor-not-allowed opacity-50 bg-gray-200" : "cursor-pointer bg-gray-100 hover:scale-95 text-(--dark-def)"}`}
      >
        Send to Admin
      </button>
    </div>
  );
}


export default function SupportAndCases({
  onSelectChat,
}: SupportAndCasesProps) {
  // Touch the optional prop so TS doesn't treat it as unused; actual usage via optional chaining below
  void onSelectChat;
  const [activeTab, setActiveTab] = useState<"chat" | "support">("chat");
  const [newCaseOpen, setNewCaseOpen] = useState<boolean>(false);
  const [text, setText] = useState("");
  const [isSendable, setIsSendable] = useState<boolean>(false);


  // --- Mobile bottom sheet drag state ---
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const lastY = useRef<number>(0);
  const dragging = useRef(false);
  const [translate, setTranslate] = useState(0);

  // Prevent pull-to-refresh while open (mobile only)
  useEffect(() => {
    if (!newCaseOpen) return;
    const prevent = (e: TouchEvent) => {
      if (sheetRef.current && e.touches[0]?.clientY < 80) {
        e.preventDefault();
      }
    };
    document.body.style.overscrollBehavior = 'contain';
    window.addEventListener('touchmove', prevent, { passive: false });
    return () => {
      document.body.style.overscrollBehavior = '';
      window.removeEventListener('touchmove', prevent);
    };
  }, [newCaseOpen]);

  // --- End mobile drag state ---

  // derive API origin for asset URL fallbacks (may include a path like /api-v1)
  const _apiRaw = (import.meta.env.VITE_API_URL as string);
  let apiOriginFallback = "";
  try {
    apiOriginFallback = new URL(_apiRaw).origin;
  } catch {
    apiOriginFallback = _apiRaw.replace(/\/+$/, "");
  }

  // Helper: convert data: URLs to object URLs (used for persisted ad images)
  const dataUrlToObjectUrl = (dataUrl: string) => {
    try {
      const comma = dataUrl.indexOf(",");
      if (comma === -1) return dataUrl;
      const meta = dataUrl.substring(0, comma);
      const base64 = dataUrl.substring(comma + 1);
      const m = /data:([^;]+);base64/.exec(meta);
      const mime = m ? m[1] : "application/octet-stream";
      const binary = atob(base64);
      const len = binary.length;
      const u8 = new Uint8Array(len);
      for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
      const blob = new Blob([u8], { type: mime });
      const url = URL.createObjectURL(blob);
      return url;
    } catch {
      return dataUrl;
    }
  };



  // Use hook which provides canonical-derived lists and manages websocket internally
  const { userRooms, supportRooms, unreadCount } = useChatRooms();

  // Calculate active support cases (exclude closed ones)
  const supportActive = supportRooms.filter(room => {
    const status = getCaseStatus(room);
    return status === 'active';
  }).length;

  useEffect(() => {
    try {
      console.debug("SupportAndCases: userRooms count", { count: userRooms.length, sample: userRooms.slice(0, 3) });
    } catch { }
  }, [userRooms]);

  // Rendering reads from saved lists provided by the hook
  const staffRoomsMemo = supportRooms;
  const userRoomsMemo = userRooms;

  const HeaderTabs = () => (
    <div className="flex items-center justify-center lg:mt-4 max-lg:mb-3 max-sm:px-5 w-full md:gap-10 gap-7.5">
      <button
        type="button"
        onClick={() => setActiveTab("chat")}
        aria-pressed={activeTab === "chat"}
        className={`text-black w-full cursor-pointer max-w-[150px] lg:max-w-[200px] md:py-3 py-1.5 rounded-2xl flex gap-4 items-center justify-center bg-(--div-active) ${activeTab === "chat" ? "bg-(--green)" : "bg-(--div-active) hover:bg-gray-100"}`}
      >
        <ChatBubbleLeftIcon className="w-6 fill-(--dark-def)" />
        <div className="flex flex-col items-start justify-center">
          <p className="inline m-0 lg:text-[1.2vw]">Chat</p>
          <span className=" text-gray-500 text-xs md:text-sm lg:text-[0.9vw]">
            {`${unreadCount} unread`}
          </span>
        </div>
      </button>
      <button
        type="button"
        onClick={() => setActiveTab("support")}
        aria-pressed={activeTab === "support"}
        className={`text-black w-full cursor-pointer max-w-[150px] lg:max-w-[200px] md:py-3 py-1.5 rounded-2xl flex gap-4 items-center justify-center bg-(--div-active) ${activeTab === "support" ? "bg-(--green)" : "bg-(--div-active) hover:bg-gray-100"}`}
      >
        <svg
          className="w-6"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.94737 0C7.6023 0 5.35327 0.884998 3.69506 2.4603C2.03684 4.03561 1.10526 6.17218 1.10526 8.4V10.395C0.771842 10.671 0.501683 11.0091 0.311553 11.3884C0.121423 11.7677 0.0153781 12.1801 0 12.6C0.025175 13.2088 0.243365 13.7963 0.62598 14.2853C1.00859 14.7743 1.53779 15.1421 2.14421 15.3405C3.58105 18.606 6.46579 21 9.94737 21H13.2632V18.9H9.94737C7.44947 18.9 5.18368 17.115 4.04526 14.2905L3.81316 13.713L3.16105 13.65C2.89548 13.6143 2.65262 13.4882 2.47774 13.295C2.30286 13.1018 2.20789 12.8548 2.21053 12.6C2.21169 12.4168 2.26331 12.237 2.36026 12.0786C2.45721 11.9202 2.59611 11.7886 2.76316 11.697L3.31579 11.3925V9.45C3.31579 9.17152 3.43224 8.90445 3.63951 8.70754C3.84679 8.51062 4.12792 8.4 4.42105 8.4H15.4737C15.7668 8.4 16.0479 8.51062 16.2552 8.70754C16.4625 8.90445 16.5789 9.17152 16.5789 9.45V14.7H12.0584C11.9581 14.4327 11.7836 14.1961 11.5534 14.0153C11.3232 13.8344 11.0458 13.716 10.7506 13.6726C10.4554 13.6291 10.1533 13.6623 9.87631 13.7685C9.5993 13.8747 9.35765 14.0501 9.17689 14.276C8.99614 14.502 8.88301 14.7701 8.84945 15.0521C8.81589 15.3341 8.86315 15.6194 8.98625 15.878C9.10934 16.1366 9.30369 16.3588 9.54874 16.5211C9.7938 16.6834 10.0805 16.7797 10.3784 16.8H18.7895C19.3757 16.8 19.938 16.5787 20.3526 16.1849C20.7671 15.7911 21 15.257 21 14.7V12.6C21 12.043 20.7671 11.5089 20.3526 11.1151C19.938 10.7212 19.3757 10.5 18.7895 10.5V8.4C18.7895 6.17218 17.8579 4.03561 16.1997 2.4603C14.5415 0.884998 12.2924 0 9.94737 0Z"
            fill="#374957"
          />
        </svg>

        <div className="flex flex-col items-start justify-center">
          <p className="m-0 inline lg:text-[1.2vw]">Support</p>
          <span className="text-gray-500 text-xs md:text-sm lg:text-[0.9vw]">
            {`${supportActive} active`}
          </span>
        </div>
      </button>
    </div>
  );

  // Chats block (new) - matches style of GetHelp/OpenCases
  const GetChats = () => (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl lg:text-[1.5vw] font-medium mt-3 mb-1 text-(--dark-def)">Recent Chats</h2>
      <ChatsList rooms={userRoomsMemo} />
    </div>
  );

  function ChatsList({ rooms }: { rooms: ChatRoom[] }) {
    if (rooms.length === 0) {
      return (
        <div>
          <div className="flex flex-col gap-2 md:gap-4 lg:gap-6 items-center justify-center mt-6 md:mt-10">
            <img className="h-40 w-40" src="/nothing-to-show.png" alt="" />
            <p className="text-base md:text-xl lg:text-[1.1vw] text-gray-500">You have no active chat rooms</p>
          </div>
        </div>
      );
    }

    // Sort rooms by last-message timestamp (prefer payload.last_message then messages array)
    const getLastMsgTime = (room: ChatRoom) => {
      try {
        const payloadLast = (room as any).last_message ?? (room as any).lastMessage ?? (room as any).last;
        if (payloadLast && typeof payloadLast === "object") {
          const t = payloadLast.created_at ?? payloadLast.createdAt ?? payloadLast.timestamp ?? null;
          if (t) return new Date(String(t)).getTime();
        }
        if (Array.isArray(room.messages) && room.messages.length > 0) {
          const lm = room.messages[room.messages.length - 1];
          if (lm && lm.created_at) return new Date(String(lm.created_at)).getTime();
        }
      } catch {
        /* ignore */
      }
      return 0;
    };

    const sortedRooms = [...rooms].sort((a, b) => getLastMsgTime(b) - getLastMsgTime(a));

    return (
      <div className="flex flex-col gap-2 my-3 lg:gap-3">
        {sortedRooms.map((r) => {
          const lastMessage =
            r.messages && r.messages.length
              ? r.messages[r.messages.length - 1]
              : null;

          // Prefer explicit last_message fields from websocket payload if present
          const payloadLast =
            (r as any).last_message ??
            (r as any).lastMessage ??
            (r as any).last;
          const payloadLastContent = (() => {
            if (!payloadLast) return null;
            if (typeof payloadLast === "string") return payloadLast;
            if (typeof payloadLast?.content === "string")
              return String(payloadLast.content);
            if (typeof payloadLast?.text === "string")
              return String(payloadLast.text);
            if (typeof payloadLast?.message === "string")
              return payloadLast.message;
            if (typeof payloadLast?.message?.content === "string")
              return String(payloadLast.message.content);
            return null;
          })();

          const lastContent =
            lastMessage && typeof (lastMessage as any).content === "string"
              ? String((lastMessage as any).content)
              : (payloadLastContent ?? "");

          // If the last message content is a data URL (base64), show a friendly label instead
          const previewText = (() => {
            if (!lastContent) return "";
            if (lastContent.startsWith("data:")) {
              const semi = lastContent.indexOf(";", 5);
              const mime = semi === -1 ? lastContent.substring(5) : lastContent.substring(5, semi);
              if (mime.startsWith("audio/")) return "audio";
              if (mime.startsWith("image/")) return "picture";
              if (mime.startsWith("video/")) return "video";
              return "file";
            }
            return lastContent;
          })();

          const member = r.members[0];
          // Prefer ad_name initials for fallback if provided by the chatrooms_list
          const adNamePayload = (r as any).ad_name ?? (r as any).adName ?? null;
          const titleForInitials = adNamePayload ? String(adNamePayload) : (r.name ?? "");
          const initials = titleForInitials
            ?.split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase();

          // determine thumbnail source: prefer persisted ad metadata, then member/avatar
          let thumbSrc: string | null = null;
          // Prefer ad_image from websocket payload (normalized into room) first
          try {
            const adFromPayload = (r as any).ad_image ?? (r as any).adImage ?? null;
            if (adFromPayload) {
              const img = String(adFromPayload);
              if (img.startsWith("data:")) {
                thumbSrc = dataUrlToObjectUrl(img);
              } else if (/^https?:\/\//i.test(img)) {
                thumbSrc = img;
              } else if (img.startsWith("//")) {
                thumbSrc = window.location.protocol + img;
              } else if (img.startsWith("/")) {
                if (/^\/assets\//i.test(img) || /^\/media\//i.test(img) || /^\/uploads\//i.test(img)) {
                  thumbSrc = apiOriginFallback + img;
                } else {
                  thumbSrc = (typeof window !== "undefined" ? window.location.origin : "") + img;
                }
              } else {
                thumbSrc = img;
              }
            }
          } catch {
            /* ignore */
          }
          try {
            if (typeof window !== "undefined") {
              const raw = localStorage.getItem("oysloe_chatroom_meta");
              if (raw) {
                const map = JSON.parse(raw || "{}");
                const meta = map[String(r.room_id ?? r.id)];
                if (meta && meta.ad_image) {
                  let img = String(meta.ad_image);
                  if (img.startsWith("data:")) {
                    thumbSrc = dataUrlToObjectUrl(img);
                  } else if (img.startsWith("/")) {
                    // prefer API origin for known asset paths
                    if (/^\/assets\//i.test(img) || /^\/media\//i.test(img) || /^\/uploads\//i.test(img)) {
                      thumbSrc = apiOriginFallback + img;
                    } else {
                      thumbSrc = (typeof window !== "undefined" ? window.location.origin : "") + img;
                    }
                  } else {
                    thumbSrc = img;
                  }
                }
              }
            }
          } catch {
            /* ignore */
          }
          // fallback to member avatar or room other_user_avatar
          if (!thumbSrc) {
            try {
              // If an `ad_name` exists prefer using ad-based thumbnail/initials
              // and do not fall back to the member/current-user avatar.
              const s = !adNamePayload ? (member?.avatar || (r as any).other_user_avatar) : ((r as any).other_user_avatar ?? null);
              if (s) {
                if (/^https?:\/\//i.test(s)) thumbSrc = s;
                else if (s.startsWith("//")) thumbSrc = window.location.protocol + s;
                else if (s.startsWith("/")) {
                  if (/^\/assets\//i.test(s) || /^\/media\//i.test(s) || /^\/uploads\//i.test(s)) {
                    thumbSrc = apiOriginFallback + s;
                  } else {
                    thumbSrc = (typeof window !== "undefined" ? window.location.origin : "") + s;
                  }
                } else thumbSrc = s;
              }
            } catch {
              /* ignore */
            }
          }

          return (
            <button
              key={String(r.room_id ?? r.id)}
              onClick={() => onSelectChat?.(String(r.room_id ?? r.id))}
              className={`relative text-left p-3 cursor-pointer rounded-xl ${(r.total_unread && r.total_unread > 0) ? "max-lg:bg-white hover:bg-gray-50" : "max-lg:hover:bg-gray-100"}  focus:outline-none flex items-start gap-3`}
            >
              {thumbSrc ? (
                <img src={thumbSrc} alt={String(r.name || "chat")} className="flex-shrink-0 w-11 h-11 md:h-13 md:w-13 lg:h-[3.25vw] lg:w-[3.25vw] rounded-xl object-cover" />
              ) : (
                <div className="flex-shrink-0 w-11 h-11 md:h-13 md:w-13 lg:h-[3.25vw] lg:w-[3.25vw] rounded-xl bg-gray-200 flex items-center justify-center text-sm md:text-base lg:text-[1.2vw] text-(--dark-def) font-semibold">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-base md:text-[18px] text-(--dark-def) lg:text-[1.2vw] font-medium">{(r as any).ad_name ? (r as any).ad_name : r.name}</p>
                  {
                    r.total_unread ? (
                      <span className="ml-2 absolute bottom-2 right-2 bg-(--green) text-green-700 text-xs md:text-sm lg:text-[0.8vw] px-2 py-0.5 rounded-full">
                        {r.total_unread}
                      </span>
                    ) : null
                  }
                  <span className="text-xs italic md:text-sm lg:text-[0.9vw] text-gray-400 flex items-center gap-2">
                    {(() => {
                      try {
                        const payloadLast = (r as any).last_message ?? (r as any).lastMessage ?? (r as any).last;
                        if (payloadLast && typeof payloadLast === "object") {
                          const t = payloadLast.created_at ?? payloadLast.createdAt ?? payloadLast.timestamp ?? null;
                          if (t) return formatReviewDate(String(t));
                        }
                        if (r.messages && r.messages.length > 0 && r.messages[r.messages.length - 1]?.created_at) {
                          return formatReviewDate(String(r.messages[r.messages.length - 1].created_at));
                        }
                      } catch {
                        /* ignore */
                      }
                      return "";
                    })()}
                  </span>
                </div>
                <p className={`text-xs md:text-sm lg:text-[0.9vw] ${r.total_unread && "font-semibold"} text-gray-500 truncate`}>
                  {/* there's no logic to check if the chat is closed or not so i'll write this below just in case its implemented in the future */}
                  {/* {r.is_closed ? (
                    <span className="bg-red-400 text-white p-1">
                      Closed
                    </span>
                  ) : (
                    <span>{previewText || "No messages yet"}</span>
                  )} */}
                  {/* for now, we'll just show the preview text */}
                  {previewText || "No messages yet"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  const GetHelp = () => (
    <div className="mb-8">
      <h2 className="text-xl md:text-2xl lg:text-[1.5vw] font-medium mt-3 mb-1 text-(--dark-def)">Get Help Anytime</h2>
      <p className="text-gray-400 text-base md:text-xl lg:text-[1.1vw] mb-4">
        If you are facing an issue, send us a report, we will respond to you
        immediately. Our support is active 24/7.
      </p>
      <div className="w-full flex items-center justify-center">
        <button
          className="flex items-center justify-center gap-3 bg-(--div-active) max-lg:bg-white max-lg:hover:bg-green-100/50 cursor-pointer text-(--dark-def) lg:font-medium max-lg:py-4 lg:px-4 max-lg:px-6 lg:w-[5vw] lg:h-[3vw] lg:max-w-[150px] lg:max-h-[60px] lg:min-h-[50px] lg:min-w-[125px] rounded-2xl hover:bg-gray-200"
          onClick={() => {
            setNewCaseOpen(true);
          }}
        >
          <p className="text-base lg:text-[1vw] whitespace-nowrap">Add case</p>
          <div
            className="relative w-7 h-7  max-w-7 max-h-7 p-0 rounded-full font-medium text-(--dark-def) bg-green-200 flex justify-center items-center"
          >
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl md:text-4xl lg:text-[1.7vw] inline m-0 -mt-0.5">+</p>
          </div>
        </button>
      </div>
    </div>
  );

  const OpenCases = ({ supportRooms }: { supportRooms: ChatRoom[] }) => {
    if (supportRooms.length === 0)
      return (
        <div>
          <h3 className="text-xl md:text-2xl lg:text-[1.5vw] text-(--dark-def) font-medium mb-2">Open Case</h3>
          <div className="flex flex-col gap-2 md:gap-4 lg:gap-6 items-center justify-center mt-6 md:mt-10">
            <img className="h-40 w-40" src="/nothing-to-show.png" alt="" />
            <p className="text-base md:text-xl lg:text-[1.1vw] text-gray-500">You have no support cases</p>
          </div>
        </div>
      );

    // Sort rooms by created_at descending (latest first)
    const sortedRooms = [...supportRooms].sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });

    return (
      <div>
        <h3 className="text-sm md:text-base lg:text-[1.25vw] font-medium mb-4 lg:mb-0">Support Cases</h3>

        <div className="flex flex-col gap-2 my-3 lg:gap-3">
          {sortedRooms.map((room) => {
            const caseId = getCaseId(room);
            const status = getCaseStatus(room);
            const hasUnread = (room.total_unread ?? 0) > 0;

            return (
              <button
                key={String(room.room_id ?? room.id)}
                onClick={() => onSelectChat?.(String(room.room_id ?? room.id))}
                className={`relative text-left p-3 cursor-pointer rounded-xl ${(room.total_unread && room.total_unread > 0) ? "max-lg:bg-white hover:bg-gray-50" : "max-lg:hover:bg-gray-100"}  focus:outline-none flex items-start justify-between gap-3`}
              >
                <div className="flex-1">
                  {/* Date and Case Info */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs italic md:text-sm lg:text-[0.9vw] text-gray-400">
                      {room.created_at ? formatReviewDate(room.created_at) : "Unknown"}
                    </span>
                  </div>

                  {/* Case Title */}
                  <p className="text-base md:text-[18px] text-(--dark-def) lg:text-[1.2vw] font-semibold">
                    Support: {caseId}
                  </p>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={`text-xs md:text-sm lg:text-[0.9vw] font-medium px-2 py-0.5 rounded-lg whitespace-nowrap ${status === "closed"
                        ? "bg-red-300 text-red-700"
                        : "bg-green-200 text-green-700"
                        }`}
                    >
                      {status === "closed" ? "Closed" : "Active"}
                    </span>
                  </div>
                </div>

                {/* Unread Count Badge */}
                {hasUnread && (
                  <span className="ml-2 absolute bottom-2 right-2 bg-red-500 text-white text-xs md:text-sm lg:text-[0.8vw] px-2 py-0.5 rounded-full">
                    {room.total_unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full lg:items-center">
      <div className="lg-hidden">
        <MobileBanner page="Inbox" />
      </div>
      <div className="lg:rounded-2xl max-lg:mt-10 bg-white lg:h-[93vh] lg:px-5 py-3 h-full w-full flex flex-col ">
        <HeaderTabs />
        <div className="no-scrollbar overflow-y-auto mt-4 flex-1 max-sm:bg-(--div-active) max-sm:rounded-2xl max-sm:pb-4">
          {activeTab === "chat" ? (
            <div className="max-lg:bg-(--div-active) max-lg:pt-1 max-lg:min-h-[83vh] max-lg:w-screen max-lg:px-5">
              <GetChats />
            </div>
          ) : (
            <div className="max-lg:bg-(--div-active) max-lg:pt-1 max-lg:min-h-[83vh] max-lg:w-screen max-lg:px-5">
              <GetHelp />
              <OpenCases supportRooms={staffRoomsMemo} />
            </div>
          )}
          <div className="w-1 h-13" />
        </div>

        {/* Mobile bottom sheet modal with drag-to-close */}
        <div
          className={
            `${newCaseOpen ? "block" : "hidden"} fixed inset-0 z-20 sm:hidden flex items-end justify-center`
          }
        >
          <div
            onClick={() => setNewCaseOpen(false)}
            className="fixed inset-0 bg-black/40 bg-opacity-50 z-10"
          />
          <div
            ref={sheetRef}
            className="relative z-20 w-full rounded-t-2xl bg-white p-4 pt-2 pb-6 animate-[slideUp_0.3s_ease-out] min-h-[30vh] max-sm:pb-20"
            style={{ transform: `translateY(${translate}px)`, touchAction: 'none' }}
            onTouchStart={(e) => {
              if (e.touches.length !== 1) return;
              dragging.current = true;
              startY.current = e.touches[0].clientY;
              lastY.current = 0;
            }}
            onTouchMove={(e) => {
              if (!dragging.current || startY.current === null) return;
              const delta = e.touches[0].clientY - startY.current;
              if (delta > 0) {
                setTranslate(delta);
                lastY.current = delta;
              }
            }}
            onTouchEnd={() => {
              dragging.current = false;
              if (lastY.current > 80) {
                setTranslate(0);
                setNewCaseOpen(false);
              } else {
                setTranslate(0);
              }
              startY.current = null;
              lastY.current = 0;
            }}
          >
            <div className="mx-auto mb-3 mt-2 h-1.5 w-12 rounded-full bg-gray-300 cursor-pointer active:bg-gray-400" />
            <NewCaseContent
              setText={setText}
              text={text}
              isSendable={isSendable}
              setIsSendable={setIsSendable}
              onSelectChat={onSelectChat}
              setNewCaseOpen={setNewCaseOpen}
            />
          </div>
        </div>

        {/* Desktop modal (unchanged) */}
        <div className={`${newCaseOpen ? "flex" : "hidden"} max-sm:hidden items-center justify-center fixed inset-0 z-20`}>
          <div onClick={() => { setNewCaseOpen(false) }} className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-10" />
          <div className="relative bg-white z-20 rounded-xl p-6 w-11/12 max-w-md text-(--dark-def)">
            <button onClick={() => setNewCaseOpen(false)} className="cursor-pointer absolute -top-14 -right-10 inline rotate-45 font-bold text-6xl">+</button>
            <NewCaseContent setText={setText} text={text} isSendable={isSendable} setIsSendable={setIsSendable} onSelectChat={onSelectChat} setNewCaseOpen={setNewCaseOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}

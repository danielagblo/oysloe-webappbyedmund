import { useEffect, useRef, useState, type JSX, type KeyboardEvent } from "react";
import useWsChat from "../features/chat/useWsChat";
import type { Message as ChatMessage } from "../services/chatService";
import * as productService from "../services/productService";
import userProfileService from "../services/userProfileService";
import type { Product } from "../types/Product";
import type { UserProfile } from "../types/UserProfile";
import { formatReviewDate } from "../utils/formatReviewDate";
import MenuButton from "./MenuButton";
type LiveChatProps = {
  caseId: string | null;
  onClose: () => void;
};

type ChatInputProps = {
  value: string;
  onValueChange: (v: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onSend: () => void;
  disabled?: boolean;
  onAttach?: () => void;
  onRecord?: (recordingOrFile: boolean | File) => void;
  onTyping?: (isTyping: boolean) => void;
  onRecorded?: (file: File) => void;
};

function ChatInput({
  value,
  onValueChange,
  onKeyDown,
  onSend,
  disabled,
  onAttach,
  onRecord,
  onTyping,
}: ChatInputProps) {
  const [recording, setRecording] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);

  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const sendOnStopRef = useRef<boolean>(true);
  const startTimeRef = useRef<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const elapsedIntervalRef = useRef<number | null>(null);

  const startRecording = async () => {
    if (disabled) return;
    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const mr: MediaRecorder = new (window as any).MediaRecorder(stream);
      mediaRecRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e: any) => {
        if (e?.data) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        try {
          const send = sendOnStopRef.current !== false;
          if (send && (chunksRef.current || []).length > 0) {
            const blob = new Blob(chunksRef.current || [], { type: "audio/webm" });
            chunksRef.current = [];
            const file = new File([blob], `recording-${Date.now()}.webm`, { type: blob.type });
              try {
                onRecord?.(file);
              } catch (e) {
                void e;
              }
          } else {
            // discard
            chunksRef.current = [];
          }
        } finally {
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((t) => t.stop());
            mediaStreamRef.current = null;
          }
          mediaRecRef.current = null;
          setRecording(false);
          setElapsed(0);
          if (elapsedIntervalRef.current) {
            window.clearInterval(elapsedIntervalRef.current);
            elapsedIntervalRef.current = null;
          }
          try {
            onRecord?.(false);
          } catch {
            // ignore
          }
        }
      };
      mr.start();
      setRecording(true);
      startTimeRef.current = Date.now();
      setElapsed(0);
      if (elapsedIntervalRef.current) window.clearInterval(elapsedIntervalRef.current);
      elapsedIntervalRef.current = window.setInterval(() => {
        if (startTimeRef.current) setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 500) as unknown as number;
      try {
        onRecord?.(true);
      } catch {
        // ignore
      }
    } catch (err) {
      console.error("Recording start failed", err);
    }
  };

  const stopRecording = (send = true) => {
    try {
      sendOnStopRef.current = send;
      mediaRecRef.current?.stop();
    } catch (e) {
      void e;
      setRecording(false);
      setElapsed(0);
      try {
        onRecord?.(false);
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    return () => {
      try {
        mediaRecRef.current?.stop();
      } catch {
        // ignore
      }
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      if (elapsedIntervalRef.current) window.clearInterval(elapsedIntervalRef.current);
      if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current as unknown as number);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="relative pb-18 md:pb-22 lg:pb-0 max-sm:bg-gray-200 items-center justify-center flex gap-2 w-full">
      {recording ? (
        <div className="flex items-center bg-white gap-2 w-full rounded-2xl px-10 py-3" style={{ border: "1px solid var(--div-border)", background: "white" }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <div className="text-sm font-medium text-gray-700">Recording</div>
          </div>
          <div className="flex-1 text-center text-sm text-gray-700">
            {Math.floor(elapsed / 60).toString().padStart(2, "0")}:{(elapsed % 60).toString().padStart(2, "0")}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => stopRecording(false)}
              type="button"
              aria-label="Cancel recording"
              className="p-2 rounded-2xl hover:bg-gray-300 sm:bg-white flex items-center justify-center"
              style={{ border: "1px solid var(--div-border)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button
              onClick={() => stopRecording(true)}
              type="button"
              aria-label="Send recording"
              className={`p-2 rounded-2xl hover:bg-gray-300 sm:bg-white flex items-center justify-center ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <img src="/send.svg" alt="Send" className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex lg:py-3 items-center justify-center max-lg:w-9/10 gap-2 w-full">
          <div className="relative lg:flex-1 lg:max-w-7/10">
            <input
              value={value}
                  onChange={(e) => {
                    onValueChange(e.target.value);
                    try {
                      onTyping?.(true);
                    } catch {
                      // ignore
                    }
                    if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current as unknown as number);
                    typingTimeoutRef.current = window.setTimeout(() => {
                      try { onTyping?.(false); } catch { /* ignore */ }
                      typingTimeoutRef.current = null;
                    }, 1500) as unknown as number;
                  }}
                  onKeyDown={(e) => {
                    try {
                      onKeyDown(e as unknown as KeyboardEvent<HTMLInputElement>);
                    } catch {
                      // ignore
                    }
                    if (e.key === "Enter") {
                      try { onTyping?.(false); } catch { /* ignore */ }
                      if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current as unknown as number);
                      typingTimeoutRef.current = null;
                    }
                  }}
              type="text"
              placeholder="Start a chat"
              className="rounded-2xl border-2 lg:rounded-[0.75vw] lg:border outline-0 border-gray-300 px-10 py-3 lg:pl-[3vw] bg-no-repeat bg-white text-sm md:text-base lg:text-[1.25vw] w-full"
            />
            {!recording && (
              <button
                onClick={() => onAttach?.()}
                className="absolute bottom-3 left-3"
                type="button"
              >
                <img src="/image.png" alt="Attach" className="w-5 lg:w-[1.75vw] h-auto" />
              </button>
            )}
          </div>
          <button
            onClick={onSend}
            type="button"
            aria-label="Send"
            disabled={disabled}
            className={`p-2 lg:p-3 rounded-2xl lg:rounded-[0.75vw] border-2 lg:border outline-0 border-gray-300 hover:bg-gray-300 bg-white flex items-center justify-center ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <img src="/send.svg" alt="Send" className="w-6 lg:w-[1.75vw] h-auto" />
          </button>
          <button
            onClick={() => startRecording()}
            type="button"
            aria-label={recording ? "Stop recording" : "Start recording"}
            disabled={disabled}
            className={`p-2 lg:p-3 rounded-2xl lg:rounded-[0.75vw] border-2 lg:border outline-0 border-gray-300 hover:bg-gray-300 bg-white flex items-center justify-center ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <img src="/audio.svg" alt="Record" className="w-6 lg:w-[1.75vw] h-6 lg:h-[1.75vw]" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function LiveChat({ caseId, onClose }: LiveChatProps) {
  // validatedRoomId will be set to `caseId` only after we confirm the room exists on the backend
  const [validatedRoomId, setValidatedRoomId] = useState<string | null>(null);
  const [isValidRoom, setIsValidRoom] = useState<boolean | null>(null); // null = unknown/loading

  // use the websocket hook (we call connectToRoom after validation)
  const {
    messages,
    chatrooms,
    roomUserMap,
    sendMessage,
    addLocalMessage,
    isRoomConnected,
    connectToRoom,
    leaveRoom,
    markAsRead,
    connectToChatroomsList,
    connectToUnreadCount,
    typing,
    sendTyping,
  } = useWsChat();
  // ensure the chatrooms websocket is connected and log updates for debugging
  useEffect(() => {
    try {
      connectToChatroomsList();
    } catch (e) {
      void e;
    }
  }, [connectToChatroomsList]);

  useEffect(() => {
    try {
      try {
        // If the websocket hook provided a roomUserMap prefer it as the source of truth
        // but only short-circuit if it contains at least one non-empty avatar value.
        if (
          roomUserMap &&
          Object.keys(roomUserMap).length > 0 &&
          Object.keys(roomUserMap).some((k) => !!(roomUserMap[k]?.avatar))
        ) {
          const m: Record<string, string> = {};
          for (const k of Object.keys(roomUserMap)) {
            try {
              const avatar = roomUserMap[k]?.avatar ?? null;
              const url = normalizeAvatarUrl(avatar) || "";
              if (url) m[k] = url;
            } catch {
              // ignore per-item
            }
          }
          setRoomAvatarMap(m);
          return;
        }

        const map: Record<string, string> = {};
        if (Array.isArray(chatrooms)) {
          for (const r of chatrooms) {
            try {
              const roomId = r?.room_id || r?.id || null;
              if (!roomId) continue;
              const rawAvatar = (r as any)?.other_user_avatar;
              const url = normalizeAvatarUrl(rawAvatar) || "";
              if (url) map[String(roomId)] = url;
            } catch {
              // ignore per-item errors
            }
          }
        }
        setRoomAvatarMap(map);
      } catch {
        // ignore mapping errors
      }
    } catch {
      // ignore
    }
  }, [chatrooms, roomUserMap]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    id?: number;
    name?: string;
    avatar?: string | null;
  } | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [avatarMap, setAvatarMap] = useState<Record<number, string>>({});
  const [roomAvatarMap, setRoomAvatarMap] = useState<Record<string, string>>({});
  const [roomInfo, setRoomInfo] = useState<any | null>(null);
  const [headerProduct, setHeaderProduct] = useState<Product | null>(null);
  // cache for object URLs created from data: URLs to avoid recreating blobs repeatedly
  const dataUrlObjectUrlRef = useRef<Record<string, string>>({});

  // Helper: convert data:...;base64,... into a Blob and return an object URL (cached)
  const dataUrlToObjectUrl = (dataUrl: string) => {
    try {
      const cache = dataUrlObjectUrlRef.current;
      if (cache[dataUrl]) return cache[dataUrl];
      const comma = dataUrl.indexOf(",");
      if (comma === -1) return dataUrl;
      const meta = dataUrl.substring(0, comma);
      const base64 = dataUrl.substring(comma + 1);
      const m = /data:([^;]+);base64/.exec(meta);
      const mime = m ? m[1] : "application/octet-stream";
      // decode base64
      const binary = atob(base64);
      const len = binary.length;
      const u8 = new Uint8Array(len);
      for (let i = 0; i < len; i++) u8[i] = binary.charCodeAt(i);
      const blob = new Blob([u8], { type: mime });
      const url = URL.createObjectURL(blob);
      cache[dataUrl] = url;
      return url;
    } catch {
      return dataUrl;
    }
  };

  // Helper: normalize avatar/source URLs that may be returned as relative paths like '/assets/avatars/..'
  // Prefer serving avatar assets from API origin when configured (VITE_API_URL), otherwise use page origin.
  const normalizeAvatarUrl = (src?: string | null) => {
    if (!src) return null;
    try {
      // full URL -> return as-is
      if (/^https?:\/\//i.test(src)) return src;
      // protocol-relative -> use current protocol
      if (src.startsWith("//")) return window.location.protocol + src;

      // derive API origin from VITE_API_URL (may include a path like /api-v1)
      const apiRaw = (import.meta.env.VITE_API_URL as string) || "https://api.oysloe.com/api-v1";
      let apiOrigin = "";
      try {
        apiOrigin = new URL(apiRaw).origin;
      } catch {
        apiOrigin = apiRaw.replace(/\/+$/, "");
      }

      // If src is an absolute-root path, prefer API origin for known asset paths (avatars, media, uploads)
      if (src.startsWith("/")) {
        if (/^\/assets\/avatars\//i.test(src) || /^\/media\//i.test(src) || /^\/uploads\//i.test(src)) {
          return apiOrigin + src;
        }
        return (typeof window !== "undefined" ? window.location.origin : "") + src;
      }

      return src;
    } catch {
      return src;
    }
  };

  // compute a header avatar for the current room (prefer websocket-provided roomAvatarMap)
  const headerAvatar = (() => {
    try {
      const key = String(validatedRoomId ?? caseId ?? "");
      if (key && roomAvatarMap && roomAvatarMap[key]) return roomAvatarMap[key];
      if (roomInfo && (roomInfo as any).other_user_avatar) return normalizeAvatarUrl((roomInfo as any).other_user_avatar) || null;
      return null;
    } catch {
      return null;
    }
  })();

  // Precompute API origin for use in onError fallbacks and debugging
  const _apiRaw = (import.meta.env.VITE_API_URL as string) || "https://api.oysloe.com/api-v1";
  let apiOriginFallback = "";
  try {
    apiOriginFallback = new URL(_apiRaw).origin;
  } catch {
    apiOriginFallback = _apiRaw.replace(/\/+$/, "");
  }

  // Small helper audio player to guarantee visible controls (play/pause, progress, times)
  function AudioPlayer({ src }: { src: string }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);
    const [current, setCurrent] = useState(0);
    const [dur, setDur] = useState(0);

    useEffect(() => {
      if (!src) return;
      const a = new Audio(src);
      a.preload = "metadata";
      audioRef.current = a;

      const onLoaded = () => setDur(a.duration || 0);
      const onTime = () => setCurrent(a.currentTime || 0);
      const onEnd = () => setPlaying(false);

      a.addEventListener("loadedmetadata", onLoaded);
      a.addEventListener("timeupdate", onTime);
      a.addEventListener("ended", onEnd);

      return () => {
        try {
          a.pause();
          a.removeEventListener("loadedmetadata", onLoaded);
          a.removeEventListener("timeupdate", onTime);
          a.removeEventListener("ended", onEnd);
          audioRef.current = null;
        } catch {
          // ignore
        }
      };
    }, [src]);

    const toggle = async () => {
      const a = audioRef.current;
      if (!a) return;
      if (playing) {
        a.pause();
        setPlaying(false);
        return;
      }
      try {
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    };

    const seek = (v: number) => {
      const a = audioRef.current;
      if (!a) return;
      a.currentTime = v;
      setCurrent(v);
    };

    const fmt = (s: number) => {
      if (!isFinite(s) || isNaN(s)) return "0:00";
      const m = Math.floor(s / 60);
      const sec = Math.floor(s % 60).toString().padStart(2, "0");
      return `${m}:${sec}`;
    };

    return (
      <div className="flex items-center gap-3 w-full">
        {/* range styling for a thinner, visible progress bar */}
        <style>{`
          .livechat-range{ -webkit-appearance:none; appearance:none; height:6px; background:transparent; border-radius:9999px; padding:0; margin:0; }
          .livechat-range::-webkit-slider-runnable-track{ height:6px; border-radius:9999px; background:transparent; }
          .livechat-range::-webkit-slider-thumb{ -webkit-appearance:none; width:14px; height:14px; border-radius:50%; background:#fff; border:2px solid #9ca3af; box-shadow:0 0 0 2px rgba(0,0,0,0.03); margin-top:-4px; transform:translateY(0); }
          .livechat-range:focus{ outline:none; }
          /* Firefox */
          .livechat-range::-moz-range-track{ height:6px; background:transparent; border-radius:9999px; }
          .livechat-range::-moz-range-progress{ height:6px; background:#10b981; border-radius:9999px; }
          .livechat-range::-moz-range-thumb{ width:14px; height:14px; border-radius:50%; background:#fff; border:2px solid #9ca3af; transform:translateY(0); }
          /* make sure the thumb is vertically centered in common browsers */
          @supports (-webkit-appearance: none) {
            .livechat-range{ padding-top:4px; padding-bottom:4px; }
            .livechat-range::-webkit-slider-thumb{ margin-top:-4px; }
          }
        `}</style>
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={toggle}
          className="p-2 rounded-full border bg-white flex items-center justify-center"
        >
          {playing ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 3v18l15-9z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          {
            (() => {
              const pct = dur > 0 ? Math.max(0, Math.min(100, (current / dur) * 100)) : 0;
              return (
                <input
                  type="range"
                  min={0}
                  max={dur || 0}
                  value={current}
                  step={0.1}
                  onChange={(e) => seek(Number((e.target as HTMLInputElement).value))}
                  className="w-full livechat-range"
                  style={{ background: `linear-gradient(90deg, #10b981 ${pct}%, #e5e7eb ${pct}%)` }}
                />
              );
            })()
          }
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{fmt(current)}</span>
            <span>{fmt(dur)}</span>
          </div>
        </div>
      </div>
    );
  }

  const openImage = (src: string) => {
    setLightboxSrc(src);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxSrc(null);
  };

  const formatTime = (iso?: string | null) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const getMessageDelivery = (m: unknown) => {
    // returns 'sent' | 'received' | null
    try {
      const msg = m as any;
      if (!currentUser) return null;
      if (!msg || !msg.sender) return null;
      if (Number(msg.sender?.id) !== Number(currentUser?.id)) return null;
      // heuristics for received/read (also consider `is_read`)
      if (
        (msg as any).__read_by_me === true ||
        msg.is_read === true ||
        msg.read === true ||
        msg.read_at ||
        msg.seen === true ||
        msg.seen_at ||
        msg.status === "read" ||
        msg.delivered === true
      ) {
        return "received";
      }
      return "sent";
    } catch {
      return null;
    }
  };

  const prevCounts = useRef<Record<string, number>>({});
  const readMarkedRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const p: UserProfile = await userProfileService.getUserProfile();
        if (!mounted) return;
        setCurrentUser({ id: p.id, name: p.name, avatar: p.avatar ?? null });
      } catch {
        // ignore if unauthenticated
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Ensure we request the chatrooms list (websocket) when the LiveChat mounts so
  // the `chatrooms` array is populated by the websocket server. Also open unread count.
  useEffect(() => {
    try {
      connectToChatroomsList();
    } catch {
      // ignore
    }
    try {
      connectToUnreadCount();
    } catch {
      // ignore
    }
    // only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Prefetch avatars for message senders using product data if sender.avatar missing
  useEffect(() => {
    const senders = new Set<number>();
    Object.values(messages).forEach((roomMsgs) => {
      (roomMsgs || []).forEach((m: any) => {
        if (m?.sender?.id != null) senders.add(Number(m.sender.id));
      });
    });

    const missing = Array.from(senders).filter((id) => !avatarMap[id]);
    if (missing.length === 0) return;

    let cancelled = false;
    (async () => {
      for (const id of missing) {
        try {
          // First try to fetch products for owner; use product image or owner.avatar if available
          const prods = await productService.getProductsForOwner(id);
          if (cancelled) return;
          if (Array.isArray(prods) && prods.length > 0) {
            const p = prods[0] as any;
            const ownerAvatar = p?.owner?.avatar || p?.owner?.image || null;
            const prodImage = p?.image || (Array.isArray(p?.images) && p.images[0]?.image) || null;
            const avatar = ownerAvatar || prodImage || null;
            if (avatar) {
              setAvatarMap((s) => ({ ...s, [id]: String(avatar) }));
              continue;
            }
          }


        } catch (e) {
          void e;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [messages]);

  // Helpers to group messages by day and render date headers
  const getDateKey = (iso?: string | null) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    } catch {
      return "";
    }
  };

  // const formatDateHeader = (iso?: string | null) => {
  //   if (!iso) return "";
  //   try {
  //     const d = new Date(iso);
  //     const today = new Date();
  //     const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  //     const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  //     const diff = Math.round((t0.getTime() - d0.getTime()) / (24 * 60 * 60 * 1000));
  //     if (diff === 0) return "Today";
  //     if (diff === 1) return "Yesterday";
  //     return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  //   } catch {
  //     return "";
  //   }
  // };

  // Fetch room details and try to resolve a product for the chat header
  useEffect(() => {
    // Without REST access we can't fetch room details here. Clear any previous
    // room info and product header; room metadata should be provided via
    // websocket messages if needed by the server-side implementation.
    if (!validatedRoomId) {
      setRoomInfo(null);
      setHeaderProduct(null);
      return;
    }
    setRoomInfo(null);
    setHeaderProduct(null);
  }, [validatedRoomId]);

  // If the websocket provides a chatrooms list, use it to set roomInfo for the current room
  useEffect(() => {
    // use chatrooms payload if available
    if (!chatrooms || !Array.isArray(chatrooms)) return;
    const idToMatch = validatedRoomId ?? caseId;
    if (!idToMatch) return;
    const found = chatrooms.find((r: any) => String(r.room_id) === String(idToMatch) || String(r.id) === String(idToMatch) || String(r.name) === String(idToMatch));
    if (found) {
      setRoomInfo(found);
      try {
        const roomKey = String(found.room_id ?? found.name ?? found.id ?? idToMatch);
        const otherAvatar = (found as any).other_user_avatar;
        if (otherAvatar) {
          try {
            const normalized = normalizeAvatarUrl(String(otherAvatar)) || String(otherAvatar);
            setRoomAvatarMap((s) => ({ ...s, [roomKey]: normalized }));
          } catch {
            setRoomAvatarMap((s) => ({ ...s, [roomKey]: String(otherAvatar) }));
          }
        }
      } catch {
        // ignore
      }
    }
  }, [chatrooms, validatedRoomId, caseId]);

  // cleanup any created object URLs when component unmounts
  useEffect(() => {
    return () => {
      try {
        Object.values(dataUrlObjectUrlRef.current).forEach((u) => {
          try {
            URL.revokeObjectURL(u);
          } catch {/*ignore*/ }
        });
      } catch {/*ignore*/ }
      dataUrlObjectUrlRef.current = {};
    };
  }, []);

  // Debug: show incoming caseId changes
  useEffect(() => {

    // reset validation state and validated id whenever the incoming caseId changes
    setIsValidRoom(null);
    setValidatedRoomId(null);

    if (!caseId) return;

    // Try to connect via websocket only. If connection succeeds we treat the room
    // as valid. We avoid any REST validation/fallback entirely.
    let cancelled = false;
    (async () => {
      try {
        const normalized = await connectToRoom(caseId);
        if (cancelled) return;
        setIsValidRoom(true);
        setValidatedRoomId(normalized ?? caseId);
      } catch (err) {
        if (cancelled) return;
        setIsValidRoom(false);
        setValidatedRoomId(null);
        try {
          leaveRoom(caseId);
        } catch {
          // ignore
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [caseId, connectToRoom, leaveRoom]);

  // Note: we initiate websocket connection eagerly when `caseId` changes.

  // When the room's websocket becomes connected, ensure we mark messages read once.
  useEffect(() => {
    if (!validatedRoomId) return;
    if (!isRoomConnected(validatedRoomId)) return;
    if (readMarkedRef.current[validatedRoomId]) return;

    void markAsRead(String(validatedRoomId));
    readMarkedRef.current[validatedRoomId] = true;
  }, [validatedRoomId, isRoomConnected, markAsRead, messages]);



  useEffect(() => {
    // Only auto-scroll on initial load for a room or when the last message is from the current user.
    const el = containerRef.current;
    if (!el || !validatedRoomId) return;

    const roomMsgs = messages[validatedRoomId] || [];
    const prev = prevCounts.current[validatedRoomId] ?? 0;
    const now = roomMsgs.length;

    // initial load: scroll to bottom
    if (prev === 0 && now > 0) {
      el.scrollTop = el.scrollHeight;
    } else if (now > prev) {
      // new messages appended: only scroll if last message is from current user
      const last = roomMsgs[roomMsgs.length - 1];
      if (last && currentUser && Number(last.sender?.id) === Number(currentUser.id)) {
        el.scrollTop = el.scrollHeight;
      }
    }

    prevCounts.current[validatedRoomId] = now;
  }, [messages, validatedRoomId, currentUser]);

  // Mark messages as read when the user is viewing the room and there are unread incoming messages
  useEffect(() => {
    if (!validatedRoomId) return;
    if (!currentUser) return;
    const roomMsgs = messages[validatedRoomId] || [];
    if (roomMsgs.length === 0) return;

    // Find any incoming messages not authored by current user and not marked read
    const hasUnread = roomMsgs.some(
      (m) =>
        m.sender?.id !== currentUser.id &&
        !(m as unknown as { is_read?: boolean; read_at?: string }).is_read &&
        !(m as unknown as { is_read?: boolean; read_at?: string }).read_at,
    );
    if (!hasUnread) return;

    // Tell the hook to mark the room as read (hook will optimistically update local state and call backend)
    void markAsRead(String(validatedRoomId));
  }, [messages, validatedRoomId, currentUser, markAsRead]);



  if (!caseId) return null;

  if (isValidRoom === false) {
    return (
      <div className="p-4">
        <p className="text-sm text-red-600">
          Chat room not found. Please use an existing chatroom ID.
        </p>
        <div className="mt-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">
            Close
          </button>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    // Only allow sending to validated, existing rooms
    if (isValidRoom !== true) return;
    if (!validatedRoomId) return;

    if (sending) return;
    setSending(true);

    const text = input.trim();
    if (!text) {
      setSending(false);
      return;
    }
    setInput("");

    // optimistic UI (do NOT set a stable `id` locally; use a temp id instead)
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimistic: Partial<ChatMessage> = {
      id: 0, // temporary id for optimistic UI
      room: Number(caseId),
      sender: { id: currentUser?.id ?? 0, name: currentUser?.name ?? "Me" },
      content: text,
      created_at: new Date().toISOString(),
    };
    // attach a client-generated temp id so we can reconcile server echo
    (optimistic as unknown as Record<string, unknown>).__temp_id = tempId;
    (optimistic as unknown as Record<string, unknown>).temp_id = tempId;
    // optimistic UI immediately (use validatedRoomId if available)
    addLocalMessage(String(validatedRoomId ?? caseId), optimistic as ChatMessage);
    // ensure we scroll to the bottom when the user sends a message
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;

    try {
      // ensure the websocket room client is connected before sending
      if (validatedRoomId && !isRoomConnected(validatedRoomId)) {
        try { await connectToRoom(validatedRoomId); } catch { }
      }

      // If websocket client still isn't open, abort to avoid REST/send endpoint fallback
      if (!validatedRoomId || !isRoomConnected(validatedRoomId)) {
        setSending(false);
        setInput(text);
        return;
      }

      await sendMessage(String(validatedRoomId ?? caseId), text, tempId);
    } catch (e) {
      console.error("Failed to send message via ws/rest fallback", e);
    } finally {
      setSending(false);
    }
  };

  // handle file selection from ref input
  const handleFileChange = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) return;
    const file = fileInput.files[0];
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimistic: Partial<ChatMessage> = {
      id: 0, // temporary id for optimistic UI
      room: Number(caseId),
      sender: { id: currentUser?.id ?? 0, name: currentUser?.name ?? "Me" },
      content: "",
      created_at: new Date().toISOString(),
    };
    (optimistic as unknown as Record<string, unknown>).__temp_id = tempId;
    (optimistic as unknown as Record<string, unknown>).temp_id = tempId;
    (optimistic as unknown as Record<string, unknown>).image_url =
      URL.createObjectURL(file);
    addLocalMessage(String(validatedRoomId ?? caseId), optimistic as ChatMessage);
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    try {
      // ensure connection for files as well
      if (validatedRoomId && !isRoomConnected(validatedRoomId)) {
        try { await connectToRoom(validatedRoomId); } catch { }
      }

      // Prevent REST fallback: require WS client open
      if (!validatedRoomId || !isRoomConnected(validatedRoomId)) {
        setSending(false);
        return;
      }

      await sendMessage(String(validatedRoomId ?? caseId), "", tempId, file);
    } catch (err) {
      console.error("Image send failed", err);
    } finally {
      // clear file input
      if (fileInput) fileInput.value = "";
    }
  };

  // Handle recorded audio file from ChatInput
  const handleRecordedFile = async (file: File) => {
    // Choose a room id to send to: prefer validatedRoomId, fall back to incoming caseId
    const roomToSend = validatedRoomId ?? caseId;
    if (!roomToSend) return;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimistic: Partial<ChatMessage> = {
      id: 0,
      room: Number(caseId),
      sender: { id: currentUser?.id ?? 0, name: currentUser?.name ?? "Me" },
      content: "",
      created_at: new Date().toISOString(),
    };
    (optimistic as unknown as Record<string, unknown>).__temp_id = tempId;
    (optimistic as unknown as Record<string, unknown>).temp_id = tempId;
    // expose audio preview URL for optimistic UI
    (optimistic as unknown as Record<string, unknown>).audio_url = URL.createObjectURL(file);
    addLocalMessage(String(roomToSend), optimistic as ChatMessage);
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;

    try {
      if (roomToSend && !isRoomConnected(roomToSend)) {
        try { await connectToRoom(roomToSend); } catch { }
      }
      if (!roomToSend || !isRoomConnected(roomToSend)) return;

      // Prefer uploading via the REST `/send` endpoint so audio is sent as multipart/form-data.
      // If that fails, fall back to the existing `sendMessage` hook which may use REST/WS.
      try {
        // Use sendMessage hook which handles file uploads correctly
        await sendMessage(String(roomToSend), "", tempId, file);
      } catch (err) {
        console.error("Recorded file send failed", err);
      }
    } catch (err) {
      console.error("Recorded send failed", err);
    }
  };

  return (
    <div className="flex h-full border-gray-100 lg:items-center lg:justify-center lg:grow">
      <div className="relative rounded-2xl lg:h-[93vh] bg-white px-0 py-0 h-full w-full flex flex-col">

        <MenuButton />

        <div className="mb-2 w-full relative">
          {/* Header: product or chat title / case number (edge-to-edge) */}
          <div className="absolute left-0 right-0 top-0 flex items-center gap-3 lg:shadow-sm rounded-b-2xl lg:py-5 lg:rounded-2xl bg-white shadow z-10 py-2">
            <button
              onClick={onClose}
              aria-label="Back"
              className="p-2 hover:bg-gray-100 curosor-pointer rounded-full ml-2"
            >
              <img src='/skip.svg' className="transform scale-x-[-1] w-3 h-3 lg:w-[1.25vw] lg:h-[1.25vw] lg:mr-[1vw]" />
            </button>

            {headerProduct?.image ? (
              <img
                src={headerProduct.image}
                alt={headerProduct.name ?? "Product"}
                className="w-12 h-10 lg:w-[2.5vw] lg:h-[2.5vw] rounded-xl object-cover"
              />
            ) : (
              <div className="w-12 h-10  lg:w-[2.5vw] lg:h-[2.5vw]  rounded-xl bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-xs md:text-sm lg:text-[1.2vw]">
                {headerProduct?.name
                  ? headerProduct.name
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word[0]?.toUpperCase())
                    .join("")
                  : "CH"}
              </div>
            )}

            <div className="flex-1">
              <div className="font-semibold text-sm md:text-base lg:text-[1.25vw] lg:pl-[1vw]">
                {roomInfo && Array.isArray(roomInfo.members) && roomInfo.members.some((m: any) => m?.is_staff || m?.is_superuser)
                  ? `Case #${validatedRoomId ?? caseId}`
                  : `${validatedRoomId ?? caseId}`}
              </div>
            </div>
            {headerAvatar && (
              <div className="pr-3">
                <img
                  src={headerAvatar}
                  alt={(roomInfo as any)?.other_user ?? "User"}
                  onError={(e) => {
                    try {
                      const el = e.target as HTMLImageElement;
                      if (el.src && el.src.indexOf("/assets/") !== -1) {
                        try {
                          el.src = apiOriginFallback + new URL(el.src).pathname;
                          return;
                        } catch {
                          // ignore URL parse errors
                        }
                      }
                    } catch {
                      // ignore
                    }
                    try {
                      (e.target as HTMLImageElement).src = "/userPfp2.jpg";
                    } catch {
                      // ignore
                    }
                  }}
                  className="w-10 h-10 lg:w-[3vw] lg:h-[3vw] rounded-full object-cover border-2 border-white shadow"
                />
              </div>
            )}
          </div>
        </div>
        <div
          ref={containerRef}
          className="flex-1 p-3 max-sm:bg-gray-200 px-6 overflow-y-auto space-y-6 no-scrollbar pt-14"
        >
          <p className="text-xs md:text-sm lg:text-[0.8vw] text-gray-400 text-center mb-6">Chat</p>

          {(() => {
            const nodes: JSX.Element[] = [];
            const roomMsgs = (messages[validatedRoomId ?? ""] || []) as any[];
            let lastKey = "";
            for (const msg of roomMsgs) {
              const created = (msg as any).created_at ?? null;
              const dateKey = getDateKey(created);
              if (dateKey && dateKey !== lastKey) {
                nodes.push(
                  <div key={`date-${dateKey}`} className="text-center text-xs md:text-sm lg:text-[0.8vw] text-gray-400 my-2 lg:my-[2vw]">
                    {formatReviewDate(created)}
                  </div>,
                );
                lastKey = dateKey;
              }

              const isMine =
                Boolean(currentUser) &&
                (Number(msg.sender?.id) === Number(currentUser?.id) ||
                  (currentUser?.name && String(msg.sender?.name) === String(currentUser?.name)));

              // Prefer lightweight local cache first (written by `wsClient`), then
              // fall back to `roomAvatarMap` or the live `chatrooms` payload.
              const idToMatch = validatedRoomId ?? caseId;
              let roomOtherAvatarFromList: string | null = null;
              try {
                // Try localStorage cache (fast, available before hook state may populate)
                if (typeof window !== "undefined" && window.localStorage && idToMatch) {
                  try {
                    const raw = localStorage.getItem("oysloe_chatrooms");
                    if (raw) {
                      const cached = JSON.parse(raw);
                      if (Array.isArray(cached) && cached.length > 0) {
                        const foundCached = (cached as any[]).find((r) =>
                          String(r.room_id) === String(idToMatch) || String(r.id) === String(idToMatch) || String(r.name) === String(idToMatch),
                        );
                        if (foundCached && (foundCached as any).other_user_avatar) {
                          roomOtherAvatarFromList = normalizeAvatarUrl((foundCached as any).other_user_avatar) || null;
                        }
                      }
                    }
                  } catch {
                    // ignore parse/storage errors and continue to other sources
                    roomOtherAvatarFromList = null;
                  }
                }

                // still not found? prefer roomAvatarMap then live chatrooms payload
                if (!roomOtherAvatarFromList) {
                  if (idToMatch && roomAvatarMap[String(idToMatch)]) {
                    roomOtherAvatarFromList = roomAvatarMap[String(idToMatch)];
                  } else if (Array.isArray(chatrooms) && idToMatch) {
                    const foundRoom = (chatrooms as any[]).find((r) =>
                      String(r.room_id) === String(idToMatch) || String(r.id) === String(idToMatch) || String(r.name) === String(idToMatch),
                    );
                    if (foundRoom && (foundRoom as any).other_user_avatar) {
                      // ensure we normalize any raw avatar path here as a fallback
                      try {
                        roomOtherAvatarFromList = normalizeAvatarUrl((foundRoom as any).other_user_avatar) || null;
                      } catch {
                        roomOtherAvatarFromList = (foundRoom as any).other_user_avatar || null;
                      }
                    }
                  }
                }
              } catch {
                roomOtherAvatarFromList = null;
              }

              // Resolve avatar with a clear preference order and handle several common fields.
              // Priority (other user): msg.sender.avatar -> avatarMap[senderId] -> msg.other_user_avatar -> roomInfo.other_user_avatar
              // Priority (mine): currentUser.avatar -> msg.sender.avatar -> avatarMap[senderId]
              let avatarCandidate: string | null = null;
              try {
                if (isMine) {
                  avatarCandidate =
                    (currentUser && currentUser.avatar) ||
                    (msg && (msg.sender as any)?.avatar) ||
                    null;
                } else {
                  // PRIORITIZE websocket-provided chatrooms list avatar (roomOtherAvatarFromList)
                  // then roomInfo.other_user_avatar, then any explicit per-message other_user_avatar,
                  // then sender.avatar or avatarMap entries.
                  avatarCandidate =
                    roomOtherAvatarFromList ||
                    (roomInfo && normalizeAvatarUrl((roomInfo as any).other_user_avatar)) ||
                    ((msg as any)?.other_user_avatar as string) ||
                    (msg && (msg.sender as any)?.avatar) ||
                    null;
                }
              } catch {
                avatarCandidate = null;
              }

              // If avatarCandidate is a data: URL, convert it to an object URL for the img src
              if (typeof avatarCandidate === "string" && avatarCandidate.startsWith("data:")) {
                avatarCandidate = dataUrlToObjectUrl(avatarCandidate);
              }

              // Normalize relative URLs like '/assets/..' to absolute URLs.
              // Use distinct fallback chains for messages authored by current user vs other user
              let normAvatar: string | null = null;
              if (isMine) {
                normAvatar =
                  normalizeAvatarUrl(currentUser?.avatar ?? undefined) ||
                  null;
              } else {
                normAvatar =
                  normalizeAvatarUrl(avatarCandidate ?? undefined) ||
                  (roomInfo && (roomInfo as any).other_user_avatar ? normalizeAvatarUrl((roomInfo as any).other_user_avatar) || null : null) ||
                  null;
              }
              // Ensure normAvatar is populated from any available chatrooms list mapping
              // IMPORTANT: do NOT consult room/chatrooms mappings for messages authored by the
              // current user — otherwise the other user's avatar can leak into "my" avatar.
              if (!normAvatar && !isMine) {
                try {
                  const idToMatchLocal = String(validatedRoomId ?? caseId ?? "");
                  if (idToMatchLocal) {
                    // direct lookup on roomAvatarMap
                    const direct = roomAvatarMap && roomAvatarMap[idToMatchLocal];
                    if (direct) {
                      normAvatar = direct;
                    } else if (roomAvatarMap) {
                      // fuzzy match: try keys that contain or are contained by id
                      const k = Object.keys(roomAvatarMap).find((kk) => kk === idToMatchLocal || kk.includes(idToMatchLocal) || idToMatchLocal.includes(kk));
                      if (k) normAvatar = roomAvatarMap[k];
                    }
                    // final attempt: search chatrooms payload for a matching room and use its other_user_avatar
                    if (!normAvatar && Array.isArray(chatrooms)) {
                      const found = (chatrooms as any[]).find((r) =>
                        String(r.room_id) === idToMatchLocal || String(r.id) === idToMatchLocal || String(r.name) === idToMatchLocal,
                      );
                      if (found && (found as any).other_user_avatar) {
                        normAvatar = normalizeAvatarUrl((found as any).other_user_avatar) || null;
                      }
                    }
                  }
                } catch {
                  // ignore
                }

              }
              const delivery = getMessageDelivery(msg as unknown);
              const DEFAULT_AVATAR = "/userPfp2.jpg";

              // avatar resolution completed

              // Determine image source from common fields or from content if it's a data URL or an image URL
              const asAny = msg as unknown as Record<string, unknown>;
              const content = typeof asAny.content === "string" ? String(asAny.content) : "";
              const explicitImage = (asAny.image_url ?? asAny.file_url ?? asAny.image) as string | undefined | null;
              // detect common attachment fields for audio: audio_url, audio, file_url, file, attachments
              const explicitAudio = (asAny.audio_url ?? asAny.audio ?? asAny.file_url ?? asAny.file ?? (Array.isArray(asAny.attachments) && asAny.attachments[0] && (asAny.attachments[0].url || (asAny.attachments[0] as any).file))) as string | undefined | null;
              const isImageDataUrl = content.startsWith("data:image/");
              const isAudioDataUrl = content.startsWith("data:audio/");
              const looksLikeImageUrl = /^https?:\/\/.+\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(content) || /^\/.*\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(content);
              // broaden audio detection: URLs with audio extensions, /media/ paths, or relative paths
              const looksLikeAudioUrl = /\.(mp3|wav|ogg|webm)(\?.*)?$/i.test(content) || (/^https?:\/\//i.test(content) && /\/media\//i.test(content)) || /^\/media\//i.test(content) || /^\/.*\.(mp3|wav|ogg|webm)(\?.*)?$/i.test(content);
              // const isAudioDataWebm = content.startsWith("data:audio/webm;");
              const maybeImageSrc = explicitImage || (isImageDataUrl || looksLikeImageUrl ? content : null);
              // prefer explicitAudio; if content is a data:audio URL convert to object URL for playback
              const maybeAudioSrc = explicitAudio || (isAudioDataUrl ? dataUrlToObjectUrl(content) : (looksLikeAudioUrl ? content : null));

              // For audio messages we want the bubble to expand so the player can show full controls
              const bubbleBaseClass = "border border-gray-200 max-sm:border-gray-300 max-sm:border-2 p-3 lg:p-[1vw] rounded-xl min-w-0 wrap-break-word";
              const bubbleSizeClass = maybeAudioSrc ? "max-w-full" : "max-w-[80%]";
              const bubbleColorClass = isMine ? "bg-green-100 max-w-[80%] text-black rounded-tr-none" : "flex-1 bg-white rounded-tl-none lg:pl-[2vw] lg:pt-[1.75vw]";
              const bubbleClass = `${bubbleBaseClass} ${bubbleSizeClass} ${bubbleColorClass}`;

              const keyId = `msg-${(msg as any).id ?? "0"}-${(msg as any).__temp_id ?? (msg as any).temp_id ?? ""}`;
              nodes.push(
                <div key={keyId} className={isMine ? "flex justify-end" : "flex justify-start"}>
                  <div className="flex flex-col">
                    {isMine ? (
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-sm md:text-base lg:text-[1.25vw] font-medium text-gray-600 mr-7 lg:mr-10">You</p>

                        <div className="relative flex items-end justify-end">
                          <div className={bubbleClass}>
                            {maybeImageSrc ? (
                              <img
                                src={String(maybeImageSrc)}
                                alt="attachment"
                                className="max-w-full max-h-60 object-contain rounded cursor-pointer"
                                onClick={() => openImage(String(maybeImageSrc))}
                                role="button"
                              />
                            ) : maybeAudioSrc ? (
                              <div className="w-full">
                                <AudioPlayer src={String(maybeAudioSrc)} />
                              </div>
                            ) : (
                              <p className="text-sm md:text-base lg:text-[1.25vw] break-words whitespace-pre-wrap">{msg.content}</p>
                            )}
                          </div>
                          <img
                            src={normAvatar || DEFAULT_AVATAR}
                            alt={msg.sender?.name ?? "You"}
                            onError={(e) => {
                              try {
                                const el = e.target as HTMLImageElement;
                                // If the src contains an assets path, try API origin fallback first
                                if (el.src && el.src.indexOf("/assets/") !== -1) {
                                  try {
                                    el.src = apiOriginFallback + new URL(el.src).pathname;
                                    return;
                                  } catch {
                                    // ignore URL parse errors
                                  }
                                }
                              } catch {
                                // ignore
                              }
                              try {
                                // image load failed; no fallback replacement
                              } catch {
                                // ignore
                              }
                            }}
                            className="w-10 h-10 lg:w-[3vw] lg:h-[3vw] rounded-full object-cover absolute -top-7 -right-3 border-2 border-white max-sm:border-gray-200 shadow"
                          />
                        </div>

                        <div className="text-[9px] md:text-xs lg:text-[0.75vw] text-gray-400 mt-1 text-right">
                          <span className="inline-flex items-center gap-1">
                            <span>{formatTime((msg as unknown as { created_at?: string }).created_at ?? null)}</span>
                            {isMine && delivery && (
                              delivery === "received" ? (
                                <svg
                                  className="w-3 lg:w-[1vw] lg:ml-[1vw] mr-3 h-auto"
                                  viewBox="0 0 9 8"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M0.296573 2.565L2.91267 4.49336L7.0169 0.35146" stroke="#374957" />
                                  <path d="M1.25775 5.15875L3.87385 7.08711L7.97808 2.94521" stroke="#374957" />
                                </svg>
                              ) : (
                                <svg className="text-gray-400 w-4 h-4 lg:mr-[1vw] lg:w-[1vw] lg:h-[1vw]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-1">
                        <p className="text-sm font-medium lg:text-[1.25vw] lg:ml-10 ml-7">{msg.sender?.name ?? "User"}</p>

                        <div className="relative flex items-start justify-start">
                          <div className={bubbleClass}>
                            {maybeImageSrc ? (
                              <img
                                src={String(maybeImageSrc)}
                                alt="attachment"
                                className="max-w-full max-h-60 object-contain rounded cursor-pointer"
                                onClick={() => openImage(String(maybeImageSrc))}
                                role="button"
                              />
                            ) : maybeAudioSrc ? (
                              <div className="w-full">
                                <AudioPlayer src={String(maybeAudioSrc)} />
                              </div>
                            ) : (
                              <p className="text-sm md:text-base lg:text-[1.25vw] break-words whitespace-pre-wrap">{msg.content}</p>
                            )}
                          </div>
                          <img
                            src={normAvatar || DEFAULT_AVATAR}
                            alt={msg.sender?.name ?? "User"}
                            onError={(e) => {
                              try {
                                const el = e.target as HTMLImageElement;
                                if (el.src && el.src.indexOf("/assets/") !== -1) {
                                  try {
                                    el.src = apiOriginFallback + new URL(el.src).pathname;
                                    return;
                                  } catch {
                                    // ignore
                                  }
                                }
                              } catch {
                                // ignore
                              }
                              try {
                                // image failed to load; no fallback
                              } catch {
                                // ignore
                              }
                            }}
                            className="w-10 h-10 lg:w-[3vw] lg:h-[3vw] rounded-full object-cover absolute -top-6 -left-3 border-2 border-white shadow"
                          />
                        </div>

                        <div className="text-[9px] md:text-xs lg:text-[0.75vw] text-gray-400 mt-1 text-left">
                          {formatTime((msg as unknown as { created_at?: string }).created_at ?? null)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>,
              );
            }
            return nodes;
          })()}
        </div>
        {
          (() => {
            try {
              const roomKey = String(validatedRoomId ?? caseId ?? "");
              const typingUsers = (typing && typing[roomKey]) || [];
              const otherTyping = typingUsers.filter((id) => Number(id) !== Number(currentUser?.id));
              if (otherTyping.length > 0) {
                const name = (roomInfo && (roomInfo as any).other_user_name) || (roomUserMap && roomUserMap[roomKey] && roomUserMap[roomKey].name) || "User";
                return (
                  <div className="px-6 pb-2">
                    <div className="text-sm text-gray-500">{`${name} is typing…`}</div>
                  </div>
                );
              }
            } catch {
              // ignore
            }
            return null;
          })()
        }
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={() => void handleFileChange()}
          />
          <ChatInput
            value={input}
            onValueChange={(v) => setInput(v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
            onSend={() => void handleSend()}
            disabled={sending}
            onAttach={() => fileInputRef.current?.click()}
            onRecord={(f) => {
              if (f instanceof File) {
                void handleRecordedFile(f);
              }
            }}
            onTyping={(isTyping) => {
              try {
                const roomToNotify = String(validatedRoomId ?? caseId ?? "");
                if (!roomToNotify) return;
                sendTyping(String(roomToNotify), !!isTyping);
              } catch {
                // ignore
              }
            }}
          />
        </div>

        {/* Lightbox modal for image preview */}
        {lightboxOpen && lightboxSrc && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="max-w-[90%] max-h-[90%]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxSrc}
                alt="preview"
                className="w-full h-full object-contain rounded"
              />
            </div>
            <button
              onClick={closeLightbox}
              aria-label="Close preview"
              className="absolute top-4 right-4 bg-white rounded-full p-2"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

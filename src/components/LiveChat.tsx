import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState, type JSX, type KeyboardEvent } from "react";
import { type UseWsChatReturn } from "../features/chat/useWsChat";
import type { Message as ChatMessage } from "../services/chatService";
import * as productService from "../services/productService";
import userProfileService from "../services/userProfileService";
import type { Product } from "../types/Product";
import type { UserProfile } from "../types/UserProfile";
import { formatReviewDate } from "../utils/formatReviewDate";
type LiveChatProps = {
  caseId: string | null;
  onClose: () => void;
  ws: UseWsChatReturn;
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
  isCaseClosed?: boolean;
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
  onRecorded,
  isCaseClosed,
}: ChatInputProps) {
  // If case is closed, show the closed message instead of input
  if (isCaseClosed) {
    return (
      <div className="w-full flex items-center justify-center p-4">
        <div className="w-11/12 max-sm:w-full rounded-2xl border-2 border-gray-300 bg-gray-100 p-4 flex items-center justify-center text-center">
          <p className="text-gray-500 font-medium">This case is closed</p>
        </div>
      </div>
    );
  }

  const [recording, setRecording] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);
  const isTypingRef = useRef(false);

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
      mr.onstop = async () => {
        try {
          const send = sendOnStopRef.current !== false;
          if (send && (chunksRef.current || []).length > 0) {
            const blob = new Blob(chunksRef.current || [], { type: "audio/webm" });
            chunksRef.current = [];
            const file = new File([blob], `recording-${Date.now()}.webm`, { type: blob.type });
            try {
              try { onRecord?.(file); } catch { /* ignore */ }
              try { onRecorded?.(file); } catch { /* ignore */ }
            } catch (e) {
              void e;
            }
          } else {
            chunksRef.current = [];
            try { onRecord?.(false); } catch { /* ignore */ }
            try { onRecorded?.(null as any); } catch { /* ignore */ }
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
        }
      };

      try {
        mr.start();
      } catch {
        /* ignore start errors */
      }
      setRecording(true);
      startTimeRef.current = Date.now();
      if (elapsedIntervalRef.current) {
        window.clearInterval(elapsedIntervalRef.current);
        elapsedIntervalRef.current = null;
      }
      elapsedIntervalRef.current = window.setInterval(() => {
        try {
          const st = startTimeRef.current ?? Date.now();
          setElapsed(Math.floor((Date.now() - st) / 1000));
        } catch {
          // ignore
        }
      }, 1000) as unknown as number;
    } catch (e) {
      try { console.warn("startRecording failed", e); } catch { /* ignore */ }
      setRecording(false);
    }
  };

  const stopRecording = (send: boolean) => {
    sendOnStopRef.current = send;
    try {
      mediaRecRef.current?.stop();
    } catch {
      // ignore
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
      try { onTyping?.(false); } catch { /* ignore */ }
      isTypingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the `value` prop is cleared externally, ensure we emit typing:stop
  useEffect(() => {
    try {
      if (!value && isTypingRef.current) {
        try { onTyping?.(false); } catch { /* ignore */ }
        isTypingRef.current = false;
        if (typingTimeoutRef.current) {
          window.clearTimeout(typingTimeoutRef.current as unknown as number);
          typingTimeoutRef.current = null;
        }
      }
    } catch {
      // ignore
    }
  }, [value, onTyping]);
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="relative pb-2.5 lg:pb-0 max-sm:bg-gray-200 items-center justify-center flex gap-2 w-full">
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
        <div className="flex items-center gap-2 w-9/10 max-sm:w-11/12 py-2">
          <div className="relative flex-1">
            <input
              value={value}
              onChange={(e) => {
                const v = e.target.value;
                onValueChange(v);
                try {
                  if (!isTypingRef.current) {
                    try { onTyping?.(true); } catch { /* ignore */ }
                    isTypingRef.current = true;
                  }
                } catch {
                  // ignore
                }
                if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current as unknown as number);
                typingTimeoutRef.current = window.setTimeout(() => {
                  try { onTyping?.(false); } catch { /* ignore */ }
                  isTypingRef.current = false;
                  typingTimeoutRef.current = null;
                }, 2000) as unknown as number;
              }}
              onKeyDown={(e) => {
                try {
                  onKeyDown(e as unknown as KeyboardEvent<HTMLInputElement>);
                } catch {
                  // ignore
                }
                if (e.key === "Enter") {
                  try { onTyping?.(false); } catch { /* ignore */ }
                  isTypingRef.current = false;
                  if (typingTimeoutRef.current) window.clearTimeout(typingTimeoutRef.current as unknown as number);
                  typingTimeoutRef.current = null;
                }
              }}
              onBlur={() => {
                try { onTyping?.(false); } catch { /* ignore */ }
                isTypingRef.current = false;
                if (typingTimeoutRef.current) {
                  window.clearTimeout(typingTimeoutRef.current as unknown as number);
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                try { onTyping?.(false); } catch { /* ignore */ }
                isTypingRef.current = false;
                if (typingTimeoutRef.current) {
                  window.clearTimeout(typingTimeoutRef.current as unknown as number);
                  typingTimeoutRef.current = null;
                }
                onSend();
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }}
              type="button"
              aria-label="Send"
              onMouseDown={(e) => e.preventDefault()}
              onTouchStart={(e) => e.preventDefault()}
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
        </div>
      )}
    </div>
  );
}

export default function LiveChat({ caseId, onClose, ws }: LiveChatProps) {
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
  } = ws;;

  const queryClient = useQueryClient();

  const currentRoomKey = String(validatedRoomId ?? caseId ?? "");

  useEffect(() => {
    try {
      // debug: log message map keys and current room key to diagnose render issues
      // remove or silence in production
      // eslint-disable-next-line no-console
      console.debug("LiveChat: messages keys", Object.keys(messages || {}), "currentRoomKey", currentRoomKey, "roomLen", (messages && messages[currentRoomKey] ? messages[currentRoomKey].length : 0));
    } catch {
      // ignore
    }
  }, [messages, currentRoomKey]);

  // When leaving/unmounting or switching rooms, ensure we emit typing:stop for the previous room
  useEffect(() => {
    const roomOnMount = String(validatedRoomId ?? caseId ?? "");
    return () => {
      try {
        if (roomOnMount) sendTyping(roomOnMount, false);
      } catch {
        // ignore
      }
    };
  }, [validatedRoomId, caseId, sendTyping]);

  // Persist messages to localStorage and restore cached messages on open.
  // Storage key holds a map: { [roomKey]: Message[] }
  useEffect(() => {
    try {
      const KEY = "oysloe_chat_messages";
      // Persist entire messages map but trim arrays to last 200 items to avoid huge storage
      const toStore: Record<string, unknown> = {};
      for (const k of Object.keys(messages || {})) {
        try {
          const arr = (messages as Record<string, any>)[k] || [];
          if (!Array.isArray(arr)) continue;
          const trimmed = arr.slice(Math.max(0, arr.length - 200));
          toStore[k] = trimmed;
          try {
            // also persist per-room into react-query cache
            try { queryClient.setQueryData(["chatMessages", k], trimmed); } catch { /* ignore */ }
          } catch {
            /* ignore cache errors */
          }
        } catch {
          // ignore per-room serialization errors
        }
      }
      try {
        localStorage.setItem(KEY, JSON.stringify(toStore));
      } catch {
        // ignore quota errors
      }
    } catch {
      // ignore
    }
  }, [messages]);

  // On mount / when caseId changes, restore cached messages for the room if websocket hasn't populated them yet
  useEffect(() => {
    try {
      const KEY = "oysloe_chat_messages";
      const roomKey = String(validatedRoomId ?? caseId ?? "");
      if (!roomKey) return;
      let raw: string | null = null;
      try {
        raw = localStorage.getItem(KEY);
      } catch {
        raw = null;
      }
      if (!raw) raw = null;
      // Prefer react-query cache first
      try {
        const cachedFromQ = queryClient.getQueryData(["chatMessages", roomKey]) as any[] | undefined;
        if (Array.isArray(cachedFromQ) && cachedFromQ.length > 0) {
          const existing = (messages && messages[roomKey]) || [];
          if (!(Array.isArray(existing) && existing.length > 0)) {
            for (const m of cachedFromQ) {
              try { addLocalMessage(roomKey, m as ChatMessage); } catch { /* ignore */ }
            }
          }
          return;
        }
      } catch {
        // ignore cache read errors and fall back to localStorage
      }

      let map: Record<string, any> = {};
      try {
        map = JSON.parse(raw || "{}") || {};
      } catch {
        return;
      }
      const cached = map[roomKey];
      if (!Array.isArray(cached) || cached.length === 0) return;

      // If websocket already has messages for this room, do not restore to avoid duplicates
      const existing = (messages && messages[roomKey]) || [];
      if (Array.isArray(existing) && existing.length > 0) return;

      // Add cached messages locally (preserve ordering)
      for (const m of cached) {
        try {
          // Avoid adding duplicates: check for id or temp id
          const id = (m as any).id ?? (m as any).__temp_id ?? (m as any).temp_id ?? null;
          const already = Array.isArray(existing) && existing.some((em: any) => {
            const eid = em?.id ?? em?.__temp_id ?? em?.temp_id ?? null;
            return eid != null && id != null && String(eid) === String(id);
          });
          if (already) continue;
          addLocalMessage(roomKey, m as ChatMessage);
        } catch {
          // ignore per-message errors
        }
      }
    } catch {
      // ignore
    }
  }, [caseId, validatedRoomId]);
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
  // guard against duplicate send calls (e.g. rapid double-invoke from UI)
  const recentlySentRef = useRef<Set<string>>(new Set());
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
  const [headerProduct, setHeaderProduct] = useState<Product | null>(() => {
    try {
      if (!caseId) return null;
      const raw = localStorage.getItem("oysloe_chatroom_meta");
      if (!raw) return null;
      const map = JSON.parse(raw || "{}");
      const meta = map[String(caseId)];
      if (!meta) return null;
      const prod: any = {};
      if (meta.ad_name) prod.name = String(meta.ad_name);
      if (meta.ad_image) {
        let img = String(meta.ad_image);
        if (img.startsWith("data:")) {
          // dataUrlToObjectUrl is defined below but safe to call here because
          // this initializer runs synchronously during module eval and the
          // function declaration appears earlier in the file.
          prod.image = dataUrlToObjectUrl(img);
        } else if (img.startsWith("/")) {
          // derive api origin fallback similar to normalizeAvatarUrl
          const _apiRaw = (import.meta.env.VITE_API_URL as string) || "https://api.oysloe.com/api-v1";
          let apiOriginFallbackLocal = "";
          try {
            apiOriginFallbackLocal = new URL(_apiRaw).origin;
          } catch {
            apiOriginFallbackLocal = _apiRaw.replace(/\/+$/, "");
          }
          if (/^\/assets\//i.test(img) || /^\/media\//i.test(img) || /^\/uploads\//i.test(img)) {
            prod.image = apiOriginFallbackLocal + img;
          } else {
            prod.image = (typeof window !== "undefined" ? window.location.origin : "") + img;
          }
        } else {
          prod.image = img;
        }
      }
      return Object.keys(prod).length > 0 ? (prod as Product) : null;
    } catch {
      return null;
    }
  });
  // cache for object URLs created from data: URLs to avoid recreating blobs repeatedly
  const dataUrlObjectUrlRef = useRef<Record<string, string>>({});

  // Drag feature removed: live chat is no longer draggable when shown in mobile overlays.

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

  // Stable merged message list to avoid folder switching wipeouts
  const roomMsgsMemo = useMemo(() => {
    const uiRoomKey = String(validatedRoomId ?? caseId ?? "");
    const rawId = String(caseId ?? "");
    const mainList = messages[uiRoomKey] || [];
    const fallbackList = messages[rawId] || [];

    // Always consider messages from both the UI key and the original caseId key
    // when they differ. This makes the UI resilient to the websocket hook
    // returning a different normalized room key (common on mobile/network).
    if (uiRoomKey === rawId) return mainList;

    const combined = [...mainList];
    // append fallback items if they don't already exist in `combined`
    for (const m of fallbackList) {
      try {
        const mid = (m as any)?.id ?? (m as any)?.temp_id ?? (m as any)?.__temp_id;
        const exists = combined.some((em: any) => {
          const eid = (em as any)?.id ?? (em as any)?.temp_id ?? (em as any)?.__temp_id;
          return mid != null && eid != null && String(eid) === String(mid);
        });
        if (!exists) combined.push(m as any);
      } catch {
        // ignore per-item merge errors
        combined.push(m as any);
      }
    }

    // Sort by created_at to preserve chronological order
    return combined.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [messages, validatedRoomId, caseId]);

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
    // room info but DO NOT clear headerProduct because persisted ad metadata
    // should remain visible and must not flash to the room id.
    if (!validatedRoomId) {
      setRoomInfo(null);
      return;
    }
    setRoomInfo(null);
    // try to load persisted chatroom metadata (ad_name/ad_image) put there by the caller
    try {
      const raw = localStorage.getItem("oysloe_chatroom_meta");
      if (raw) {
        const map = JSON.parse(raw || "{}");
        const meta = map[String(validatedRoomId)];
        if (meta) {
          // Compute apiOriginFallback locally to avoid dependency issues
          const _apiRaw = (import.meta.env.VITE_API_URL as string) || "https://api.oysloe.com/api-v1";
          let apiOriginFallbackLocal = "";
          try {
            apiOriginFallbackLocal = new URL(_apiRaw).origin;
          } catch {
            apiOriginFallbackLocal = _apiRaw.replace(/\/+$/, "");
          }

          const prod: any = {};
          if (meta.ad_name) prod.name = String(meta.ad_name);
          if (meta.ad_image) {
            let img = String(meta.ad_image);
            if (img.startsWith("data:")) {
              prod.image = dataUrlToObjectUrl(img);
            } else if (img.startsWith("/")) {
              if (/^\/assets\//i.test(img) || /^\/media\//i.test(img) || /^\/uploads\//i.test(img)) {
                prod.image = apiOriginFallbackLocal + img;
              } else {
                prod.image = (typeof window !== "undefined" ? window.location.origin : "") + img;
              }
            } else {
              prod.image = img;
            }
          }
          if (Object.keys(prod).length > 0) {
            // Do not overwrite any persisted headerProduct (ad_name) that was
            // loaded from localStorage earlier. Prefer existing headerProduct
            // with a name and only set when none exists.
            setHeaderProduct((curr) => (curr && curr.name ? curr : (prod as Product)));
          }
        }
      }
    } catch {
      // ignore
    }
  }, [validatedRoomId]);

  // Ensure persisted `ad_name` is loaded immediately when `caseId` changes so the
  // header shows the ad name right away (avoid flashing room id). This prefers
  // persisted metadata over any websocket-provided values and should never be
  // overwritten by later socket updates.
  useEffect(() => {
    try {
      if (!caseId) return;
      const raw = localStorage.getItem("oysloe_chatroom_meta");
      if (!raw) return;
      const map = JSON.parse(raw || "{}");
      const meta = map[String(caseId)];
      if (!meta) return;
      const prod: any = {};
      if (meta.ad_name) prod.name = String(meta.ad_name);
      if (meta.ad_image) {
        let img = String(meta.ad_image);
        if (img.startsWith("data:")) {
          prod.image = dataUrlToObjectUrl(img);
        } else if (img.startsWith("/")) {
          if (/^\/assets\//i.test(img) || /^\/media\//i.test(img) || /^\/uploads\//i.test(img)) {
            prod.image = apiOriginFallback + img;
          } else {
            prod.image = (typeof window !== "undefined" ? window.location.origin : "") + img;
          }
        } else {
          prod.image = img;
        }
      }
      if (Object.keys(prod).length > 0) setHeaderProduct(prod as Product);
    } catch {
      // ignore
    }
  }, [caseId]);

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
        // If the chatrooms list contains ad metadata (ad_name/ad_image), prefer
        // that for the header product information so the header shows the ad
        // when available (this comes from `type: "chatrooms_list"`).
        try {
          const adName = (found as any).ad_name;
          const adImage = (found as any).ad_image;
          if (adName || adImage) {
            const prod: any = {};
            if (adName) prod.name = String(adName);
            if (adImage) {
              const img = String(adImage);
              prod.image = img.startsWith("data:") ? dataUrlToObjectUrl(img) : (normalizeAvatarUrl(img) || img);
            }
            if (Object.keys(prod).length > 0) setHeaderProduct(prod as Product);
          }
        } catch {
          // ignore header product extraction errors
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

  // Connect to the room immediately when caseId changes.
  // Set validatedRoomId right away so the UI can render messages without waiting for server validation.
  useEffect(() => {
    if (!caseId) {
      setIsValidRoom(null);
      setValidatedRoomId(null);
      return;
    }

    // Set the ID immediately so the UI knows which room's messages to render
    setValidatedRoomId(caseId);
    setIsValidRoom(true);

    // Fire the connection in the background and capture the normalized key
    // The hook may return a different key (e.g., a room_id UUID) than the input caseId
    const initConnection = async () => {
      try {
        const normalizedKey = await connectToRoom(caseId);
        // If the server uses a different key (UUID or room_id), update our state
        // so we look at the correct messages key
        if (normalizedKey && String(normalizedKey) !== String(caseId)) {
          setValidatedRoomId(String(normalizedKey));
        }
      } catch (err) {
        console.error("Connection failed", err);
      }
    };

    initConnection();

    return () => {
      try {
        leaveRoom(caseId);
      } catch {
        // ignore
      }
    };
  }, [caseId, connectToRoom, leaveRoom]);

  // Note: we initiate websocket connection eagerly when `caseId` changes.

  // When the user clicks/selects a chat (caseId or validatedRoomId changes),
  // ensure the message container scrolls to the last message so the user
  // immediately sees the latest conversation.
  useEffect(() => {
    try {
      const el = containerRef.current;
      if (!el) return;
      // allow the UI to render the new room/messages first
      const t = window.setTimeout(() => {
        try {
          el.scrollTop = el.scrollHeight;
        } catch {
          // ignore scroll errors
        }
      }, 50);
      return () => window.clearTimeout(t);
    } catch {
      // ignore
    }
    // we want to run this whenever the selected room id changes
  }, [caseId, validatedRoomId]);

  // When the room's websocket becomes connected, ensure we mark messages read once.
  useEffect(() => {
    const idKey = String(validatedRoomId ?? caseId ?? "");
    if (!idKey) return;
    try {
      if (!isRoomConnected(idKey)) return;
    } catch {
      // ignore
    }
    if (readMarkedRef.current[idKey]) return;

    void markAsRead(idKey);
    readMarkedRef.current[idKey] = true;
  }, [validatedRoomId, caseId, isRoomConnected, markAsRead, messages]);



  useEffect(() => {
    // Only auto-scroll on initial load for a room or when the last message is from the current user.
    const el = containerRef.current;
    if (!el || !(validatedRoomId ?? caseId)) return;

    const idKey = String(validatedRoomId ?? caseId ?? "");
    const roomMsgs = messages[idKey] || [];
    const prev = prevCounts.current[idKey] ?? 0;
    const now = roomMsgs.length;

    // initial load: scroll to bottom
    if (prev === 0 && now > 0) {
      el.scrollTop = el.scrollHeight;
    } else if (now > prev) {
      // new messages appended: scroll when either
      // - last message is from current user (outgoing), or
      // - user is already near the bottom (so incoming messages should auto-scroll)
      const last = roomMsgs[roomMsgs.length - 1];
      try {
        const lastIsMine = last && currentUser && Number(last.sender?.id) === Number(currentUser.id);
        const distanceFromBottom = el.scrollHeight - (el.scrollTop + el.clientHeight);
        const nearBottomThreshold = 150; // px
        const isNearBottom = distanceFromBottom <= nearBottomThreshold;
        if (lastIsMine || isNearBottom) {
          el.scrollTop = el.scrollHeight;
        }
      } catch {
        // ignore scroll errors
      }
    }

    prevCounts.current[idKey] = now;
  }, [messages, validatedRoomId, currentUser, caseId]);

  // Mark messages as read when the user is viewing the room and there are unread incoming messages
  useEffect(() => {
    if (!(validatedRoomId ?? caseId)) return;
    if (!currentUser) return;
    const idKey = String(validatedRoomId ?? caseId ?? "");
    const roomMsgs = messages[idKey] || [];
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
    void markAsRead(idKey);
  }, [messages, validatedRoomId, currentUser, markAsRead, caseId]);



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
    const text = input.trim();
    if (!text || sending) return;
    const stringKey = String(validatedRoomId ?? "");
    const numericKey = String(caseId ?? "");
    if (!stringKey && !numericKey) return;

    setSending(true);
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    // Prevent accidental double-send if this handler is invoked twice quickly
    if (recentlySentRef.current.has(tempId)) {
      setSending(false);
      return;
    }
    recentlySentRef.current.add(tempId);
    // forget after 10s
    setTimeout(() => recentlySentRef.current.delete(tempId), 10000);

    // 1. Create the optimistic message object
    const optimistic: Partial<ChatMessage> = {
      id: 0,
      room: Number(caseId),
      sender: { id: currentUser?.id ?? 0, name: currentUser?.name ?? "Me" },
      content: text,
      created_at: new Date().toISOString(),
    };
    // @ts-expect-error - adding temp keys for reconciliation
    optimistic.__temp_id = tempId;
    // @ts-expect-error - adding temp keys for reconciliation
    optimistic.temp_id = tempId;

    // 2. Clear input. The hook will create the optimistic placeholder when
    // `sendMessage` is invoked with `tempId` so avoid writing it locally here.
    setInput("");

    // Scroll to bottom immediately
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;

    try {
      // Attempt send using the most specific known id first (stringKey), fall back to numericKey
      const sendTarget = stringKey || numericKey;
      if (!sendTarget) throw new Error("No send target available");
      if (isRoomConnected(sendTarget)) {
        void sendMessage(sendTarget, text, tempId);
      } else {
        console.warn("Socket not connected for room", sendTarget, "message might be delayed");
        // Still attempt to send (ensureRoomClient will try to connect inside sendMessage)
        try { void sendMessage(sendTarget, text, tempId); } catch { /* ignore */ }
      }
    } catch (e) {
      console.error("Send failed", e);
      // Restore input on hard error
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  // handle file selection from ref input
  const handleFileChange = async () => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) return;
    const file = fileInput.files[0];
    const uiRoomKey = String(validatedRoomId ?? caseId ?? "");
    if (!uiRoomKey) return;

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const optimistic: Partial<ChatMessage> = {
      id: 0,
      room: Number(caseId),
      sender: { id: currentUser?.id ?? 0, name: currentUser?.name ?? "Me" },
      content: "",
      created_at: new Date().toISOString(),
    };
    // @ts-expect-error - adding temp keys for reconciliation
    optimistic.__temp_id = tempId;
    // @ts-expect-error - adding temp keys for reconciliation
    optimistic.temp_id = tempId;
    // @ts-expect-error - adding image_url property
    optimistic.image_url = URL.createObjectURL(file);

    // Prevent accidental double-send
    if (recentlySentRef.current.has(tempId)) {
      // clear file input and bail
      if (fileInput) fileInput.value = "";
      return;
    }
    recentlySentRef.current.add(tempId);
    setTimeout(() => recentlySentRef.current.delete(tempId), 10000);

    // UI optimistic placeholder will be created by the hook's `sendMessage`.
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;

    try {
      // Fire the message send without awaiting connection
      if (isRoomConnected(uiRoomKey)) {
        void sendMessage(uiRoomKey, "", tempId, file);
      } else {
        console.warn("Socket not connected, file message might be delayed");
      }
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
    // @ts-expect-error - adding temp keys for reconciliation
    optimistic.__temp_id = tempId;
    // @ts-expect-error - adding temp keys for reconciliation
    optimistic.temp_id = tempId;
    // @ts-expect-error - adding audio_url property
    optimistic.audio_url = URL.createObjectURL(file);
    // Prevent accidental double-send
    if (recentlySentRef.current.has(tempId)) return;
    recentlySentRef.current.add(tempId);
    setTimeout(() => recentlySentRef.current.delete(tempId), 10000);

    // UI optimistic placeholder will be created by the hook's `sendMessage`.
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;

    try {
      if (isRoomConnected(String(roomToSend))) {
        void sendMessage(String(roomToSend), "", tempId, file);
      } else {
        console.warn("Socket not connected for audio, message might be delayed");
      }
    } catch (err) {
      console.error("Recorded send failed", err);
    }
  };

  return (
    <div className="flex h-full border-gray-100 lg:items-center lg:justify-center lg:grow">
      <div className="relative rounded-2xl lg:h-[93vh] bg-white px-0 py-0 h-full w-full flex flex-col">

        <div className="mb-2 w-full relative">
          {/* Header: product or chat title / case number (edge-to-edge) */}
          <div className="absolute left-0 right-0 top-0 flex items-center gap-3 lg:shadow-sm rounded-b-2xl lg:py-[0.25vw] lg:rounded-2xl bg-white shadow z-10 py-2">
            <button
              onClick={onClose}
              aria-label="Back"
              className="p-2 hover:bg-gray-100 curosor-pointer rounded-full ml-2"
            >
              <img src='/skip.svg' className="transform scale-x-[-1] w-3 h-3 lg:w-[1.25vw] lg:h-[1.25vw] lg:mr-[1vw]" />
            </button>

            {(() => {
              try {
                const headerProductImage = (() => {
                  try {
                    const img = headerProduct?.image;
                    if (!img) return null;
                    const s = String(img);
                    if (s.startsWith("data:")) return dataUrlToObjectUrl(s);
                    return normalizeAvatarUrl(s) || s;
                  } catch {
                    return headerProduct?.image ?? null;
                  }
                })();

                if (headerProductImage) {
                  return (
                    <img
                      src={headerProductImage}
                      alt={headerProduct?.name ?? "Product"}
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
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                  );
                }
              } catch {
                // ignore
              }
              return (
                <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center text-gray-700 font-semibold text-xs md:text-sm lg:text-[1.2vw]">
                  {headerProduct?.name
                    ? headerProduct.name
                      .split(" ")
                      .slice(0, 2)
                      .map((word) => word[0]?.toUpperCase())
                      .join("")
                    : "CH"}
                </div>
              );
            })()}

            <div className="flex-1">
              <div className="font-semibold text-sm md:text-base lg:text-[1.25vw] lg:pl-[1vw]">
                {headerProduct?.name
                  ? headerProduct.name
                  : roomInfo && Array.isArray(roomInfo.members) && roomInfo.members.some((m: any) => m?.is_staff || m?.is_superuser)
                    ? `Case #${validatedRoomId ?? caseId}`
                    : `Chat`}
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
            let roomMsgs = roomMsgsMemo;

            // If websocket hasn't populated messages yet, try to read cached messages from localStorage
            if ((!roomMsgs || roomMsgs.length === 0) && typeof window !== "undefined") {
              try {
                const raw = localStorage.getItem("oysloe_chat_messages");
                if (raw) {
                  const map = JSON.parse(raw || "{}") || {};
                  const cached = map[String(validatedRoomId ?? caseId ?? "")];
                  if (Array.isArray(cached) && cached.length > 0) {
                    roomMsgs = cached as any[];
                  }
                }
              } catch {
                // ignore parse/localStorage errors
              }
            }
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

              // Make every message bubble occupy 3/4 of the available width
              const bubbleBaseClass = "border border-gray-200 max-sm:border-gray-300 max-sm:border-2 p-3 lg:p-[1vw] rounded-xl min-w-0 wrap-break-word";
              const bubbleSizeClass = "w-full";
              const bubbleColorClass = isMine ? "bg-green-100 text-black rounded-tr-none" : "bg-white rounded-tl-none lg:pl-[2vw] lg:pt-[1.75vw]";
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
                              <p className="text-sm md:text-base lg:text-[1.25vw] break-words whitespace-pre-wrap">{content}</p>
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
                              <p className="text-sm md:text-base lg:text-[1.25vw] break-words whitespace-pre-wrap">{content}</p>
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
            // If remote users are typing, show a placeholder bubble inside the message list
            try {
              const roomKeyLocal = String(validatedRoomId ?? caseId ?? "");
              const typingUsersLocal = (typing && typing[roomKeyLocal]) || [];
              const otherTypingLocal = typingUsersLocal.filter((id) => Number(id) !== Number(currentUser?.id));
              if (otherTypingLocal.length > 0) {
                const name = (roomInfo && (roomInfo as any).other_user_name) || (roomUserMap && roomUserMap[roomKeyLocal] && roomUserMap[roomKeyLocal].name) || "User";
                const typingKey = `typing-${roomKeyLocal}-${otherTypingLocal.join("-")}`;
                nodes.push(
                  <div key={typingKey} className="flex justify-start">
                    <div className="flex flex-col items-start gap-1">
                      <p className="text-sm font-medium lg:text-[1.25vw] lg:ml-10 ml-7">{name}</p>
                      <div className="border border-gray-200 p-3 rounded-xl bg-white lg:pl-[2vw] lg:pt-[1.75vw] w-full max-w-[60%]">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Typing</span>
                          <span className="inline-flex gap-1 items-center" aria-hidden="true">
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" />
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-150" />
                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-300" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>,
                );
              }
            } catch {
              // ignore typing UI errors
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
                    <style>{`
                      @keyframes livechat-typing {0%{transform:translateY(0);opacity:.35}30%{transform:translateY(-4px);opacity:1}60%{transform:translateY(0);opacity:.35}100%{opacity:.35}}
                      .livechat-typing-dots{display:inline-flex;gap:6px;align-items:center;margin-left:8px}
                      .livechat-typing-dots span{width:7px;height:7px;border-radius:9999px;background:#9ca3af;display:inline-block;animation:livechat-typing 1s infinite}
                      .livechat-typing-dots span:nth-child(1){animation-delay:0s}
                      .livechat-typing-dots span:nth-child(2){animation-delay:0.15s}
                      .livechat-typing-dots span:nth-child(3){animation-delay:0.3s}
                    `}</style>

                    <div className="text-sm text-gray-500 flex items-center">
                      <span>{name} is typing</span>
                      <span className="livechat-typing-dots" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </span>
                    </div>
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
            isCaseClosed={roomInfo?.is_closed ?? false}
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


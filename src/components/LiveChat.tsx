import { useEffect, useRef, useState, type JSX, type KeyboardEvent } from "react";
import useWsChat from "../features/chat/useWsChat";
import type { Message as ChatMessage } from "../services/chatService";
import * as productService from "../services/productService";
import userProfileService from "../services/userProfileService";
import type { Product } from "../types/Product";
import type { UserProfile } from "../types/UserProfile";
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
}: ChatInputProps) {
  const [recording, setRecording] = useState(false);

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
      // request microphone
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
              console.debug("ChatInput: recorded file ready", { size: (file as any).size, type: file.type, name: file.name });
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="relative flex gap-2 w-full">
      {recording ? (
        <div className="flex items-center gap-2 w-full rounded-2xl px-10 py-3" style={{ border: "1px solid var(--div-border)", background: "white" }}>
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
        <>
          <input
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onKeyDown={onKeyDown}
            type="text"
            placeholder="Start a chat"
            style={{ border: "1px solid var(--div-border)" }}
            className="rounded-2xl px-10 py-3 bg-no-repeat sm:bg-white text-sm w-full sm:border-[var(--dark-def)]"
          />
          <button
            onClick={onSend}
            type="button"
            aria-label="Send"
            disabled={disabled}
            style={{ border: "1px solid var(--div-border)" }}
            className={`p-2 rounded-2xl hover:bg-gray-300 sm:bg-white flex items-center justify-center ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <img src="/send.svg" alt="Send" className="w-6 h-6" />
          </button>
          <button
            onClick={() => startRecording()}
            type="button"
            aria-label={recording ? "Stop recording" : "Start recording"}
            disabled={disabled}
            style={{ border: "1px solid var(--div-border)" }}
            className={`p-2 rounded-2xl hover:bg-gray-300 sm:bg-white flex items-center justify-center ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <img src="/audio.svg" alt="Record" className="w-6 h-6" />
          </button>
        </>
      )}

      {/* file attach button (hide while recording so recording UI covers it) */}
      {!recording && (
        <button
          onClick={() => onAttach?.()}
          className="absolute bottom-3 left-3"
          type="button"
        >
          <img src="/image.png" alt="Attach" className="w-5 h-auto" />
        </button>
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
    sendMessage,
    addLocalMessage,
    isRoomConnected,
    connectToRoom,
    markAsRead,
  } = useWsChat();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    id?: number;
    name?: string;
  } | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [avatarMap, setAvatarMap] = useState<Record<number, string>>({});
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
        setCurrentUser({ id: p.id, name: p.name });
      } catch {
        // ignore if unauthenticated
      }
    })();
    return () => {
      mounted = false;
    };
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

          // As a last fallback, try fetching product detail by owner (getProductsForOwner may return none)
        } catch (e) {
          void e;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [messages, avatarMap]);

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

  const formatDateHeader = (iso?: string | null) => {
    if (!iso) return "";
    try {
      const d = new Date(iso);
      const today = new Date();
      const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const diff = Math.round((t0.getTime() - d0.getTime()) / (24 * 60 * 60 * 1000));
      if (diff === 0) return "Today";
      if (diff === 1) return "Yesterday";
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "";
    }
  };

  // Fetch room details and try to resolve a product for the chat header
  useEffect(() => {
    if (!validatedRoomId) {
      setRoomInfo(null);
      setHeaderProduct(null);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const room = await (await import("../services/chatService")).getChatRoom(validatedRoomId);
        if (!mounted) return;
        setRoomInfo(room as any);

        // If room includes staff members, treat this as an admin/case chat
        const isAdminChat = Array.isArray((room as any).members) && (room as any).members.some((m: any) => m?.is_staff || m?.is_superuser);
        if (isAdminChat) {
          setHeaderProduct(null);
          return;
        }

        // Try to fetch a product using the room id (some chats map to a product id)
        try {
          const prod = await productService.getProduct(Number(validatedRoomId));
          if (!mounted) return;
          setHeaderProduct(prod as Product);
        } catch {
          // fallback: no product found
          setHeaderProduct(null);
        }
      } catch {
        if (mounted) setRoomInfo(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [validatedRoomId]);

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
    console.log("LiveChat caseId:", caseId);

    // reset validation state and validated id whenever the incoming caseId changes
    setIsValidRoom(null);
    setValidatedRoomId(null);

    if (!caseId) return;

    let mounted = true;
    (async () => {
      try {
        console.log("LiveChat: validating room id on backend", caseId);
        // chatService.getChatRoom will throw if the room does not exist
        await (await import("../services/chatService")).getChatRoom(caseId);
        if (!mounted) return;
        console.log("LiveChat: room validated", caseId);
        setIsValidRoom(true);
        setValidatedRoomId(caseId);
      } catch (err) {
        console.warn("LiveChat: room validation failed", caseId, err);
        if (!mounted) return;
        setIsValidRoom(false);
        setValidatedRoomId(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [caseId]);

  // When we've validated the room id, initiate websocket connection for that room
  useEffect(() => {
    if (isValidRoom && validatedRoomId) {
      void connectToRoom(validatedRoomId);
    }
  }, [isValidRoom, validatedRoomId, connectToRoom]);

  // When the room's websocket becomes connected, ensure we mark messages read once.
  useEffect(() => {
    if (!validatedRoomId) return;
    if (!isRoomConnected(validatedRoomId)) return;
    if (readMarkedRef.current[validatedRoomId]) return;
    console.debug("LiveChat: room connected, marking as read", {
      room: validatedRoomId,
    });
    void markAsRead(String(validatedRoomId));
    readMarkedRef.current[validatedRoomId] = true;
  }, [validatedRoomId, isRoomConnected, markAsRead, messages]);

  // Debug: log current room messages and read flags to help diagnose UI not updating
  useEffect(() => {
    if (!validatedRoomId) return;
    const roomMsgs = messages[validatedRoomId] || [];
    console.debug(
      "LiveChat: messages for room",
      validatedRoomId,
      roomMsgs.map((m) => ({
        id: m.id,
        is_read: (m as unknown as { is_read?: boolean }).is_read,
        __read_by_me: (m as unknown as { __read_by_me?: boolean }).__read_by_me,
      })),
    );
  }, [messages, validatedRoomId]);

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
      if (last && currentUser && last.sender?.id === currentUser.id) {
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

  // Debug: show websocket connection status
  useEffect(() => {
    const connected = validatedRoomId
      ? isRoomConnected(validatedRoomId)
      : false;
    console.log(
      "WebSocket connected:",
      connected,
      "validatedRoomId:",
      validatedRoomId,
      "isValidRoom:",
      isValidRoom,
    );
  }, [isRoomConnected, validatedRoomId, isValidRoom, messages]);

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
    if (isValidRoom !== true) {
      console.warn("Refusing to send: room is not validated or unknown", {
        isValidRoom,
        caseId,
      });
      return;
    }
    if (!validatedRoomId) {
      console.warn("Refusing to send: missing validatedRoomId", {
        validatedRoomId,
      });
      return;
    }

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
    // optimistic UI immediately
    addLocalMessage(String(caseId), optimistic as ChatMessage);
    // ensure we scroll to the bottom when the user sends a message
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;

    try {
      // ensure the websocket room client is connected before sending
      if (validatedRoomId && !isRoomConnected(validatedRoomId)) {
        try {
          await connectToRoom(validatedRoomId);
        } catch (e) {
          console.debug("LiveChat: connectToRoom before send failed", e);
        }
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
    addLocalMessage(String(caseId), optimistic as ChatMessage);
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    try {
      // ensure connection for files as well
      if (validatedRoomId && !isRoomConnected(validatedRoomId)) {
        try {
          await connectToRoom(validatedRoomId);
        } catch (e) {
          console.debug("LiveChat: connectToRoom before file send failed", e);
        }
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
    if (!roomToSend) {
      console.warn("Refusing to send recorded file: missing room id", { validatedRoomId, caseId });
      return;
    }

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
        try {
          await connectToRoom(roomToSend);
        } catch (e) {
          console.debug("LiveChat: connectToRoom before recorded send failed", e);
        }
      }

      console.debug("LiveChat: sending recorded file", {
        roomToSend,
        tempId,
        fileName: file.name,
        fileSize: (file as any).size,
        fileType: file.type,
      });

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
    <div className="flex h-full border-gray-100 ">
      <div className="relative rounded-2xl bg-white px-0 py-0 h-full w-full flex flex-col">

        <div className="mb-2 w-full relative">
          {/* Header: product or chat title / case number (edge-to-edge) */}
          <div className="absolute left-0 right-0 top-0 flex items-center gap-3 rounded-b-2xl bg-white shadow z-10 py-2">
            <button
              onClick={onClose}
              aria-label="Back"
              className="p-2 hover:bg-gray-100 rounded-full ml-2"
            >
              <img src='/skip.svg' className="transform scale-x-[-1] w-3 h-3" />
            </button>

            <img
              src={headerProduct?.image ?? (avatarMap[Number(roomInfo?.members?.[0]?.id ?? currentUser?.id ?? 0)] || "/chat-default.png")}
              alt={headerProduct?.name ?? "Chat"}
              className="w-12 h-10 rounded-xl object-cover"
            />

            <div className="flex-1">
              <div className="font-semibold text-sm">
                {roomInfo && Array.isArray(roomInfo.members) && roomInfo.members.some((m: any) => m?.is_staff || m?.is_superuser)
                  ? `Case #${validatedRoomId ?? caseId}`
                  : `${validatedRoomId ?? caseId}`}
              </div>
            </div>
          </div>
        </div>
        <div
          ref={containerRef}
          className="flex-1 p-3 px-6 overflow-y-auto space-y-6 no-scrollbar pt-14"
        >
          <p className="text-xs text-gray-400 text-center mb-6">Chat</p>

          {(() => {
            const nodes: JSX.Element[] = [];
            const roomMsgs = (messages[validatedRoomId ?? ""] || []) as any[];
            let lastKey = "";
            for (const msg of roomMsgs) {
              const created = (msg as any).created_at ?? null;
              const dateKey = getDateKey(created);
              if (dateKey && dateKey !== lastKey) {
                nodes.push(
                  <div key={`date-${dateKey}`} className="text-center text-xs text-gray-400 my-2">
                    {formatDateHeader(created)}
                  </div>,
                );
                lastKey = dateKey;
              }

              const isMine = currentUser && msg.sender?.id === currentUser?.id;
              const delivery = getMessageDelivery(msg as unknown);

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
              const maybeImageSrc = explicitImage || (isImageDataUrl || looksLikeImageUrl ? content : null);
              // prefer explicitAudio; if content is a data:audio URL convert to object URL for playback
              const maybeAudioSrc = explicitAudio || (isAudioDataUrl ? dataUrlToObjectUrl(content) : (looksLikeAudioUrl ? content : null));

              

              nodes.push(
                <div key={msg.id} className={isMine ? "flex justify-end" : "flex justify-start"}>
                  <div className="flex flex-col">
                    {isMine ? (
                      <div className="flex flex-col items-end gap-1">
                        <p className="text-sm font-medium text-gray-600 mr-7">You</p>

                        <div className="relative flex items-end justify-end">
                          <div className={`border border-gray-200 p-3 rounded-xl max-w-[80%] min-w-0 wrap-break-word bg-green-100 text-black rounded-tr-none`}>
                            {maybeImageSrc ? (
                              <img
                                src={String(maybeImageSrc)}
                                alt="attachment"
                                className="max-w-full max-h-60 object-contain rounded cursor-pointer"
                                onClick={() => openImage(String(maybeImageSrc))}
                                role="button"
                              />
                            ) : maybeAudioSrc ? (
                              <audio controls src={String(maybeAudioSrc)} className="w-full" />
                            ) : (
                              <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                            )}
                          </div>
                          <img
                            src={avatarMap[Number(msg.sender?.id ?? currentUser?.id ?? 0)] || "/usePfp2.jpg"}
                            alt="You"
                            className="w-10 h-10 rounded-full object-cover absolute -top-7 -right-3 border-2 border-white shadow"
                          />
                        </div>

                        <div className="text-[9px] text-gray-400 mt-1 text-right">
                          <span className="inline-flex items-center gap-1">
                            <span>{formatTime((msg as unknown as { created_at?: string }).created_at ?? null)}</span>
                            {isMine && delivery && (
                              <svg className={`${delivery === "received" ? "text-blue-500" : "text-gray-400"} w-4 h-4`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-1">
                        <p className="text-sm font-medium  ml-7">{msg.sender?.name ?? "User"}</p>

                        <div className="relative flex items-start justify-start">
                          <div className={`border border-gray-200 p-3 rounded-xl flex-1 min-w-0 max-w-[80%] wrap-break-word rounded-tl-none`}>
                            {maybeImageSrc ? (
                              <img
                                src={String(maybeImageSrc)}
                                alt="attachment"
                                className="max-w-full max-h-60 object-contain rounded cursor-pointer"
                                onClick={() => openImage(String(maybeImageSrc))}
                                role="button"
                              />
                            ) : maybeAudioSrc ? (
                              <audio controls src={String(maybeAudioSrc)} className="w-full" />
                            ) : (
                              <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                            )}
                          </div>
                          <img
                            src={avatarMap[Number(msg.sender?.id ?? 0)] || "/userPfp2.jpg"}
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover absolute -top-6 -left-3 border-2 border-white shadow"
                          />
                        </div>

                        <div className="text-[9px] text-gray-400 mt-1 text-left">
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

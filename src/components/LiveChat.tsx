import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import useWsChat from "../features/chat/useWsChat";
import type { Message as ChatMessage } from "../services/chatService";
import userProfileService from "../services/userProfileService";
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
};

function ChatInput({
  value,
  onValueChange,
  onKeyDown,
  onSend,
  disabled,
  onAttach,
}: ChatInputProps) {
  return (
    <div className="relative flex gap-2 w-full">
      <input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={onKeyDown}
        type="text"
        placeholder="Start a chat"
        style={{ border: "1px solid var(--div-border)" }}
        className="rounded-2xl px-10 py-3 bg-no-repeat sm:bg-white text-sm w-full sm:border-[var(--dark-def)]"
      />
      {/* file input moved to parent; attach button will call parent handler */}
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
        onClick={() => onAttach?.()}
        className="absolute bottom-3 left-3"
        type="button"
      >
        <img src="/image.png" alt="Attach" className="w-5 h-auto" />
      </button>
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
    const optimistic: Partial<ChatMessage> = {
      room: Number(caseId),
      sender: { id: currentUser?.id ?? 0, name: currentUser?.name ?? "Me" },
      content: text,
      created_at: new Date().toISOString(),
    };
    // attach a client-generated temp id so we can reconcile server echo
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    (optimistic as unknown as Record<string, unknown>).__temp_id = tempId;
    (optimistic as unknown as Record<string, unknown>).temp_id = tempId;
    // optimistic UI immediately
    addLocalMessage(String(caseId), optimistic);
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
      room: Number(caseId),
      sender: { id: currentUser?.id ?? 0, name: currentUser?.name ?? "Me" },
      content: "",
      created_at: new Date().toISOString(),
    };
    (optimistic as unknown as Record<string, unknown>).__temp_id = tempId;
    (optimistic as unknown as Record<string, unknown>).temp_id = tempId;
    (optimistic as unknown as Record<string, unknown>).image_url =
      URL.createObjectURL(file);
    addLocalMessage(String(caseId), optimistic);
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

  return (
    <div className="flex h-full border-gray-100 ">
      <div className="relative rounded-2xl bg-white px-4 py-3 h-full w-full flex flex-col">
        <button className="absolute right-1 block sm:hidden" onClick={onClose}>
          <img src="/close.svg" alt="" className="p-2" />
        </button>
        <div
          ref={containerRef}
          className="flex-1 p-3 overflow-y-auto space-y-6"
        >
          <p className="text-xs text-gray-400 text-center mb-6">Chat</p>

          {(messages[validatedRoomId ?? ""] || []).map((msg, idx) => {
            const isMine = currentUser && msg.sender?.id === currentUser.id;
            const delivery = getMessageDelivery(msg as unknown);

            // Determine image source from common fields or from content if it's a data URL or an image URL
            const asAny = msg as unknown as Record<string, unknown>;
            const content =
              typeof asAny.content === "string" ? String(asAny.content) : "";
            const explicitImage = (asAny.image_url ??
              asAny.file_url ??
              asAny.image) as string | undefined | null;
            const isDataUrl = content.startsWith("data:image/");
            const looksLikeImageUrl =
              /^https?:\/\/.+\.(png|jpe?g|gif|webp|svg)(\?.*)?$/i.test(content);
            const maybeImageSrc =
              explicitImage ||
              (isDataUrl || looksLikeImageUrl ? content : null);

            return (
              <div
                key={msg.id}
                className={isMine ? "flex justify-end" : "flex justify-start"}
              >
                <div className="flex flex-col">
                  {isMine ? (
                    <div className="flex flex-col justify-end gap-1">
                      <div className="flex items-center gap-2 mb-1 justify-end">
                        <p className="text-sm font-medium text-gray-600">You</p>
                        <img src="/face.svg" alt="You" className="w-8 h-8 rounded-full" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <div className={`border border-gray-200 p-3 rounded-xl max-w-[80%] min-w-0 wrap-break-word bg-green-100 text-black rounded-tr-none`}>
                          {maybeImageSrc ? (
                            <img
                              src={String(maybeImageSrc)}
                              alt="attachment"
                              className="max-w-full max-h-60 object-contain rounded cursor-pointer"
                              onClick={() => openImage(String(maybeImageSrc))}
                              role="button"
                            />
                          ) : (
                            <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                          )}
                        </div>
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
                      <div className="flex items-center gap-2 mb-1">
                        <img src="/face.svg" alt="User" className="w-8 h-8 rounded-full" />
                        <p className="text-sm font-medium">{msg.sender?.name ?? "User"}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className={`border border-gray-200 p-3 rounded-xl flex-1 min-w-0 max-w-[80%] wrap-break-word rounded-tl-none`}>
                          {maybeImageSrc ? (
                            <img
                              src={String(maybeImageSrc)}
                              alt="attachment"
                              className="max-w-full max-h-60 object-contain rounded cursor-pointer"
                              onClick={() => openImage(String(maybeImageSrc))}
                              role="button"
                            />
                          ) : (
                            <p className="text-sm break-words whitespace-pre-wrap">{msg.content}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-[9px] text-gray-400 mt-1 text-left">
                        {formatTime((msg as unknown as { created_at?: string }).created_at ?? null)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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

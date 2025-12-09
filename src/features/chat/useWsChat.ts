import { useCallback, useEffect, useRef, useState } from "react";
import chatService, {
  type ChatRoom,
  type Message,
} from "../../services/chatService";
import WebSocketClient from "../../services/wsClient";

type RoomMessages = Record<string, Message[]>;

export type UseWsChatReturn = {
  messages: RoomMessages;
  chatrooms: ChatRoom[];
  unreadCount: number;
  connectToRoom: (roomId: string) => Promise<void>;
  connectToTempChat: (email: string) => Promise<void>;
  connectToChatroomsList: () => void;
  connectToUnreadCount: () => void;
  sendMessage: (
    roomId: string,
    text: string,
    tempId?: string,
    file?: File | Blob,
  ) => Promise<void>;
  sendTyping: (roomId: string, typing: boolean) => void;
  markAsRead: (roomId: string) => Promise<void>;
  isRoomConnected: (roomId: string) => boolean;
  addLocalMessage: (roomId: string, msg: Message) => void;
  closeAll: () => void;
};

function getWsBase() {
  const apiBase =
    (import.meta.env.VITE_API_URL as string) || "https://api.oysloe.com/api-v1";
  const wsBaseRaw = (import.meta.env.VITE_WS_URL as string) || apiBase;
  return wsBaseRaw.replace(/^http/, "ws").replace(/\/$/, "");
}

export default function useWsChat(): UseWsChatReturn {
  const [messages, setMessages] = useState<RoomMessages>({});
  const [chatrooms, setChatrooms] = useState<ChatRoom[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const roomClients = useRef<Record<string, WebSocketClient | null>>({});
  const tempClient = useRef<WebSocketClient | null>(null);
  const listClient = useRef<WebSocketClient | null>(null);
  const unreadClient = useRef<WebSocketClient | null>(null);

  useEffect(() => {
    return () => {
      // cleanup all clients on unmount
      Object.values(roomClients.current).forEach((c) => c?.close());
      tempClient.current?.close();
      listClient.current?.close();
      unreadClient.current?.close();
    };
  }, []);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("oysloe_token") : null;

  const ensureRoomClient = useCallback(
    async (roomId: string) => {
      if (roomClients.current[roomId]?.isOpen()) return;
      // close previous if exists
      roomClients.current[roomId]?.close();

      const wsBase = getWsBase();
      const encoded = encodeURIComponent(roomId);
      const url = `${wsBase}/chat/${encoded}/`;

      console.log("useWsChat.ensureRoomClient: creating WebSocketClient", {
        url,
        tokenPresent: !!token,
        roomId,
      });

      // Try once with the given url; if server rejects immediately (close code 1006), try without trailing slash
      let triedAlternative = false;
      const altUrl = url.replace(/\/$/, "");

      const createClient = (attemptUrl: string) =>
        new WebSocketClient(attemptUrl, token, {
          onOpen: () => {
            console.log("useWsChat: socket open", { roomId, url: attemptUrl });
          },
          onClose: (ev) => {
            console.log("useWsChat: socket closed", {
              roomId,
              code: ev?.code,
              reason: ev?.reason,
              url: attemptUrl,
            });
            // If server closed immediately (1006) and we haven't tried the alt URL, try it once
            if (
              (ev?.code === 1006 || ev?.code === 1005) &&
              !triedAlternative &&
              attemptUrl !== altUrl
            ) {
              triedAlternative = true;
              console.log("useWsChat: retrying with alternative URL", {
                altUrl,
                roomId,
              });
              // create alt client and connect
              const altClient = createClient(altUrl);
              roomClients.current[roomId] = altClient;
              try {
                altClient.connect();
              } catch (err) {
                console.warn("useWsChat: alt client connect failed", err, {
                  roomId,
                  altUrl,
                });
              }
            }
          },
          onError: (ev) => {
            console.warn("useWsChat: socket error", {
              roomId,
              ev,
              url: attemptUrl,
            });
          },
          onMessage: (data) => {
            if (!data) return;
            // If server sends an array of messages as history
            if (Array.isArray(data)) {
              setMessages((prev) => ({ ...prev, [roomId]: data }));
              return;
            }
            // single message
            if ((data as any).id) {
              const incoming = data as Message & { temp_id?: string };
              setMessages((prev) => {
                const list = prev[roomId] || [];
                // dedupe by id
                if (list.find((m) => String(m.id) === String(incoming.id)))
                  return prev;

                // If server echoed our temp_id, replace the optimistic placeholder
                const tempId = (incoming as any).temp_id;
                if (tempId) {
                  const byTemp = list.findIndex(
                    (m) => (m as any).__temp_id === tempId,
                  );
                  if (byTemp !== -1) {
                    const newList = [...list];
                    newList[byTemp] = incoming;
                    return { ...prev, [roomId]: newList };
                  }
                }

                // dedupe by content+sender+time (within 5s) to catch optimistic echoes
                const incomingTime = incoming.created_at
                  ? new Date(incoming.created_at).getTime()
                  : 0;
                const likelyIndex = list.findIndex((m) => {
                  if (!m || !incoming) return false;
                  if (
                    m.sender?.id &&
                    incoming.sender?.id &&
                    m.sender.id !== incoming.sender.id
                  )
                    return false;
                  if (m.content !== incoming.content) return false;
                  const mTime = m.created_at
                    ? new Date(m.created_at).getTime()
                    : 0;
                  return Math.abs(mTime - incomingTime) <= 5000; // 5 seconds
                });
                if (likelyIndex !== -1) {
                  // If the existing message was an optimistic placeholder, replace it with the server message
                  const existing = list[likelyIndex] as any;
                  if (existing && existing.__optimistic) {
                    const newList = [...list];
                    newList[likelyIndex] = incoming;
                    return { ...prev, [roomId]: newList };
                  }
                  // otherwise assume it's a duplicate and ignore incoming
                  return prev;
                }
                return { ...prev, [roomId]: [...list, incoming] };
              });
              return;
            }
            // typing or other event types are passed through
          },
        });

      const client = createClient(url);
      roomClients.current[roomId] = client;
      try {
        client.connect();
      } catch (err) {
        console.warn("useWsChat: failed to connect room client", err);
      }
    },
    [token],
  );

  const connectToRoom = useCallback(
    async (roomId: string) => {
      // load history first
      try {
        const history = await chatService.getChatRoomMessages(roomId);
        setMessages((prev) => ({ ...prev, [roomId]: history }));
      } catch (err) {
        console.warn("useWsChat: failed to load history for", roomId, err);
      }
      await ensureRoomClient(roomId);
    },
    [ensureRoomClient],
  );

  const connectToTempChat = useCallback(
    async (email: string) => {
      // close existing temp client
      tempClient.current?.close();
      const wsBase = getWsBase();
      const encoded = encodeURIComponent(email);
      const url = `${wsBase}/tempchat/${encoded}/`;
      const client = new WebSocketClient(url, token, {
        onMessage: (data) => {
          // backend will likely return the resolved room and messages
          if (!data) return;
          const resolvedRoom = (data as any).room_id ?? (data as any).room;
          if (resolvedRoom) {
            const rid = String(resolvedRoom);
            if ((data as any).messages) {
              setMessages((prev) => ({
                ...prev,
                [rid]: (data as any).messages as Message[],
              }));
            }
            // ensure a dedicated room client is connected for live updates
            void ensureRoomClient(rid);
          }
          // if server pushes messages directly, try to append to whichever room is present
          if ((data as any).id && (data as any).room) {
            const rid = String((data as any).room);
            setMessages((prev) => ({
              ...prev,
              [rid]: [...(prev[rid] || []), data as Message],
            }));
          }
        },
      });
      tempClient.current = client;
      try {
        client.connect();
      } catch (err) {
        console.warn("useWsChat: tempchat connect failed", err);
      }
    },
    [token, ensureRoomClient],
  );

  const connectToChatroomsList = useCallback(() => {
    if (listClient.current?.isOpen()) return;
    listClient.current?.close();
    const wsBase = getWsBase();
    const url = `${wsBase}/chatrooms/`;
    const client = new WebSocketClient(url, token, {
      onMessage: (data) => {
        if (!data) return;
        // If backend sends the full list
        if (Array.isArray(data)) {
          setChatrooms(data as ChatRoom[]);
          return;
        }
        // If backend sends incremental updates
        if ((data as any).rooms) {
          setChatrooms((_) => (data as any).rooms as ChatRoom[]);
          return;
        }
        // If it's a single room update, merge/replace
        if ((data as any).room_id || (data as any).id) {
          const updated = data as ChatRoom;
          setChatrooms((prev) => {
            const found = prev.find(
              (r) =>
                String(r.id) === String(updated.id) ||
                r.room_id === (updated as any).room_id,
            );
            if (!found) return [updated, ...prev];
            return prev.map((r) =>
              String(r.id) === String(updated.id) ? updated : r,
            );
          });
        }
      },
    });
    listClient.current = client;
    try {
      client.connect();
    } catch (err) {
      console.warn("useWsChat: chatrooms list connect failed", err);
    }
  }, [token]);

  const connectToUnreadCount = useCallback(() => {
    if (unreadClient.current?.isOpen()) return;
    unreadClient.current?.close();
    const wsBase = getWsBase();
    const url = `${wsBase}/unread_count/`;
    const client = new WebSocketClient(url, token, {
      onMessage: (data) => {
        if (!data) return;
        // expect { unread: number } or a raw number
        if (typeof data === "number") {
          setUnreadCount(data);
          return;
        }
        if ((data as any).unread != null) {
          setUnreadCount(Number((data as any).unread));
        }
      },
    });
    unreadClient.current = client;
    try {
      client.connect();
    } catch (err) {
      console.warn("useWsChat: unread_count connect failed", err);
    }
  }, [token]);

  const sendMessage = useCallback(
    async (
      roomId: string,
      text: string,
      tempId?: string,
      file?: File | Blob,
    ) => {
      const client = roomClients.current[roomId];
      // If a file is provided, always use REST FormData upload (WS can't carry file reliably here)
      if (file) {
        // If the file is reasonably small, try embedding it as a data URL in the JSON
        // message first so the server will store the image URL/content directly on the
        // Message.content field. This is a fallback for backends that don't return
        // an attachment URL when accepting multipart uploads.
        const tryEmbedAsDataUrl = async () => {
          try {
            // limit to ~1.5MB to avoid huge payloads
            const MAX_EMBED = 1_500_000;
            const size = (file as any).size || 0;
            if (size > MAX_EMBED) return false;
            const dataUrl = await new Promise<string>((resolve, reject) => {
              const fr = new FileReader();
              fr.onload = () => resolve(String(fr.result ?? ""));
              fr.onerror = (e) => reject(e);
              fr.readAsDataURL(file as Blob);
            });

            // send JSON with content set to data URL so server saves it in message.content
            const body: any = { content: dataUrl };
            if (tempId) body.temp_id = tempId;
            const res = await chatService.sendMessageToRoom(roomId, body);
            if (res && (res as any).id) {
              const msg = res as Message & { temp_id?: string };
              // ensure temp id is preserved
              const returnedTemp = (msg as any).temp_id || tempId;
              if (returnedTemp && !(msg as any).temp_id)
                (msg as any).temp_id = returnedTemp;
              // if server didn't set content but returned attachments, map them
              const asAny = msg as any;
              const possibleUrl =
                asAny.content && String(asAny.content).startsWith("http")
                  ? String(asAny.content)
                  : asAny.image_url ||
                    asAny.file_url ||
                    asAny.image ||
                    (asAny.attachments &&
                      asAny.attachments[0] &&
                      (asAny.attachments[0].url ||
                        asAny.attachments[0].file)) ||
                    null;
              if (!asAny.content && possibleUrl)
                asAny.content = String(possibleUrl);

              setMessages((prev) => {
                const list = prev[roomId] || [];
                if (returnedTemp) {
                  const idx = list.findIndex(
                    (m) =>
                      ((m as any).__temp_id || (m as any).temp_id) ===
                      returnedTemp,
                  );
                  if (idx !== -1) {
                    const newList = [...list];
                    newList[idx] = msg;
                    return { ...prev, [roomId]: newList };
                  }
                }
                return { ...prev, [roomId]: [...list, msg] };
              });
              return true;
            }
          } catch (err) {
            // ignore and fall back to multipart upload
            console.debug(
              "useWsChat: embed dataUrl send failed, falling back to multipart",
              err,
            );
          }
          return false;
        };

        const embedded = await tryEmbedAsDataUrl();
        if (embedded) return;
        try {
          const form = new FormData();
          // Some backends require a non-empty `message` field when a file is attached.
          // If the caller didn't provide text, send the client tempId as the message so validation passes.
          const messageText = text && text.length > 0 ? text : (tempId ?? "");
          // Include both `content` and `message` for compatibility with different backends.
          form.append("content", messageText);
          form.append("message", messageText);
          if (tempId) form.append("temp_id", String(tempId));
          // backend may expect 'file' or 'image' or 'attachment' — include several keys to maximize compatibility
          form.append("file", file);
          form.append("image", file);
          form.append("attachment", file);
          // log for debugging
          try {
            console.debug("useWsChat: uploading file", {
              roomId,
              tempId,
              fileName: (file as any).name,
            });
          } catch {}
          const res = await chatService.sendMessageToRoom(
            roomId,
            form as unknown as any,
          );
          if (res && (res as any).id) {
            const msg = res as Message & { temp_id?: string };
            // Ensure we preserve a client temp id so optimistic placeholders reconcile
            const returnedTemp = (msg as any).temp_id || tempId;
            if (returnedTemp && !(msg as any).temp_id)
              (msg as any).temp_id = returnedTemp;

            // If server returned an attachment URL in a common field, prefer that as `content`
            const asAny = msg as any;
            const possibleUrl =
              asAny.content && String(asAny.content).startsWith("http")
                ? String(asAny.content)
                : asAny.image_url ||
                  asAny.file_url ||
                  asAny.image ||
                  (asAny.attachments &&
                    asAny.attachments[0] &&
                    (asAny.attachments[0].url || asAny.attachments[0].file)) ||
                  null;
            if (!asAny.content && possibleUrl) {
              asAny.content = String(possibleUrl);
            }

            setMessages((prev) => {
              const list = prev[roomId] || [];
              if (returnedTemp) {
                const idx = list.findIndex(
                  (m) =>
                    ((m as any).__temp_id || (m as any).temp_id) ===
                    returnedTemp,
                );
                if (idx !== -1) {
                  const newList = [...list];
                  newList[idx] = msg;
                  return { ...prev, [roomId]: newList };
                }
              }
              return { ...prev, [roomId]: [...list, msg] };
            });
          }
          return;
        } catch (err) {
          console.warn("useWsChat: sendMessage file upload failed", err);
          throw err;
        }
      }

      if (client && client.isOpen()) {
        // include client temp id so server can echo it back and we can reconcile optimistic UI
        client.send({ type: "message", content: text, temp_id: tempId });
        return;
      }

      // Fallback: send via REST if websocket not available
      try {
        const body: any = { content: text, message: text };
        if (tempId) body.temp_id = tempId;
        const res = await chatService.sendMessageToRoom(roomId, body);
        // If backend returns the created message, append it; otherwise caller may have optimistic UI
        if (res && (res as any).id) {
          const msg = res as Message & { temp_id?: string };
          // ensure temp_id is present so we can match and replace optimistic items
          const returnedTemp = (msg as any).temp_id || tempId;
          if (returnedTemp && !(msg as any).temp_id)
            (msg as any).temp_id = returnedTemp;

          // map common file/url fields into content when content is empty
          const asAny = msg as any;
          const possibleUrl =
            asAny.content && String(asAny.content).startsWith("http")
              ? String(asAny.content)
              : asAny.image_url ||
                asAny.file_url ||
                asAny.image ||
                (asAny.attachments &&
                  asAny.attachments[0] &&
                  (asAny.attachments[0].url || asAny.attachments[0].file)) ||
                null;
          if (!asAny.content && possibleUrl) {
            asAny.content = String(possibleUrl);
          }

          setMessages((prev) => {
            const list = prev[roomId] || [];
            // If server returned our temp_id, replace optimistic placeholder
            if (returnedTemp) {
              const idx = list.findIndex(
                (m) =>
                  ((m as any).__temp_id ||
                    (m as any).tempId ||
                    (m as any).temp_id) === returnedTemp,
              );
              if (idx !== -1) {
                const newList = [...list];
                newList[idx] = msg;
                return { ...prev, [roomId]: newList };
              }
            }
            // fallback: fuzzy match optimistic placeholder and replace if found
            const msgTime = msg.created_at
              ? new Date(msg.created_at).getTime()
              : 0;
            const likelyIndex = list.findIndex((m) => {
              if (!m) return false;
              if (
                m.sender?.id &&
                msg.sender?.id &&
                m.sender.id !== msg.sender.id
              )
                return false;
              if (m.content !== msg.content) return false;
              const mTime = m.created_at ? new Date(m.created_at).getTime() : 0;
              return (
                Math.abs(mTime - msgTime) <= 5000 && (m as any).__optimistic
              );
            });
            if (likelyIndex !== -1) {
              const newList = [...list];
              newList[likelyIndex] = msg;
              return { ...prev, [roomId]: newList };
            }
            return { ...prev, [roomId]: [...list, msg] };
          });
        }
        return;
      } catch (err) {
        console.warn("useWsChat: sendMessage REST fallback failed", err);
        throw err;
      }
    },
    [],
  );

  const sendTyping = useCallback((roomId: string, typing: boolean) => {
    const client = roomClients.current[roomId];
    if (!client || !client.isOpen()) return;
    client.send({ type: "typing", typing });
  }, []);

  const markAsRead = useCallback(async (roomId: string) => {
    // Optimistically mark messages in this room as read locally so UI updates immediately
    setMessages((prev) => {
      const list = prev[roomId] || [];
      if (list.length === 0) return prev;
      const updated = list.map((m) =>
        m.sender?.id !== undefined
          ? { ...m, is_read: true, __read_by_me: true }
          : m,
      );
      try {
        console.debug("useWsChat.markAsRead: optimistic update", {
          roomId,
          updatedCount: updated.length,
        });
      } catch {}
      return { ...prev, [roomId]: updated };
    });

    try {
      await chatService.markChatRoomRead(roomId);
    } catch (err) {
      console.warn("useWsChat: markChatRoomRead failed", err);
    }

    // also notify ws (best-effort)
    const client = roomClients.current[roomId];
    try {
      client?.send({ type: "mark_read" });
    } catch {
      // ignore
    }
  }, []);

  const isRoomConnected = useCallback(
    (roomId: string) =>
      !!roomClients.current[roomId] && roomClients.current[roomId]!.isOpen(),
    [],
  );

  const addLocalMessage = useCallback((roomId: string, msg: Message) => {
    setMessages((prev) => {
      const list = prev[roomId] || [];
      // dedupe by id
      if (list.find((m) => String(m.id) === String(msg.id))) return prev;
      // dedupe by temp id if present
      const tempId =
        (msg as any).__temp_id || (msg as any).tempId || (msg as any).temp_id;
      if (
        tempId &&
        list.find(
          (m) =>
            ((m as any).__temp_id ||
              (m as any).tempId ||
              (m as any).temp_id) === tempId,
        )
      )
        return prev;
      // fuzzy dedupe: content+sender+time within 2s
      const msgTime = msg.created_at
        ? new Date(msg.created_at).getTime()
        : Date.now();
      const likelyIndex = list.findIndex((m) => {
        if (!m) return false;
        if (m.sender?.id && msg.sender?.id && m.sender.id !== msg.sender.id)
          return false;
        if (m.content !== msg.content) return false;
        const mTime = m.created_at ? new Date(m.created_at).getTime() : 0;
        return Math.abs(mTime - msgTime) <= 5000;
      });
      if (likelyIndex !== -1) return prev;
      // mark optimistic messages so they can be replaced when server responds
      (msg as any).__optimistic = true;
      // ensure the temp id is preserved under a known key for matching
      if ((msg as any).temp_id && !(msg as any).__temp_id) {
        (msg as any).__temp_id = (msg as any).temp_id;
      }
      return { ...prev, [roomId]: [...list, msg] };
    });
  }, []);

  const closeAll = useCallback(() => {
    Object.values(roomClients.current).forEach((c) => c?.close());
    roomClients.current = {};
    tempClient.current?.close();
    tempClient.current = null;
    listClient.current?.close();
    listClient.current = null;
    unreadClient.current?.close();
    unreadClient.current = null;
  }, []);

  return {
    messages,
    chatrooms,
    unreadCount,
    connectToRoom,
    connectToTempChat,
    connectToChatroomsList,
    connectToUnreadCount,
    sendMessage,
    sendTyping,
    markAsRead,
    isRoomConnected,
    addLocalMessage,
    closeAll,
  };
}

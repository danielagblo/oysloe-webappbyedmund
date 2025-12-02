import { useEffect, useRef, useState } from "react";
import chatService, { type Message } from "../services/chatService";
import userProfileService from "../services/userProfileService";
import WebSocketClient from "../services/wsClient";

export type UseChatReturn = {
  messages: Message[];
  sendMessage: (text: string) => Promise<void>;
  addLocalMessage: (msg: Message) => void;
  connected: boolean;
  close: () => void;
};

export function useChat(roomId: string | null): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocketClient | null>(null);
  const [effectiveRoomId, setEffectiveRoomId] = useState<string | null>(roomId);

  useEffect(() => {
    let mounted = true;
    // reset effective id when roomId changes
    setEffectiveRoomId(roomId);

    const ensureAndConnect = async () => {
      console.log("useChat.ensureAndConnect: enter", { roomId });
      if (!roomId) {
        console.log("useChat.ensureAndConnect: no roomId, skipping");
        return;
      }
      // If caller passed a sentinel like 'new', skip resolving/connect until first send
      if (roomId === "new") {
        console.log("useChat.ensureAndConnect: roomId is 'new' — delaying connect until first send");
        if (mounted) setMessages([]);
        return;
      }

      // Normal room id flow
      const rid = roomId;
      try {
        console.log("useChat: loading history for room", rid);
        const msgs = await chatService.getChatRoomMessages(rid);
        console.log("useChat: loaded history", { count: Array.isArray(msgs) ? msgs.length : undefined });
        if (mounted) setMessages(msgs);
      } catch (e) {
        console.error("useChat failed to load messages", e);
      }

      // build websocket url
      const apiBase = (import.meta.env.VITE_API_URL as string) || "https://api.oysloe.com/api-v1";
      const wsBaseRaw = (import.meta.env.VITE_WS_URL as string) || apiBase;
      const wsBase = wsBaseRaw.replace(/^http/, "ws").replace(/\/$/, "");
      const wsUrl = `${wsBase}/chatrooms/${rid}/`;

      const token = typeof window !== "undefined" ? localStorage.getItem("oysloe_token") : null;
      console.log("useChat: creating WebSocketClient", { wsUrl, tokenPresent: !!token });
      const client = new WebSocketClient(wsUrl, token, {
        onOpen: () => {
          console.log("useChat.ws onOpen", { room: rid });
          setConnected(true);
        },
        onClose: (ev) => {
          console.log("useChat.ws onClose", { room: rid, code: ev?.code, reason: ev?.reason });
          setConnected(false);
        },
        onError: (ev) => {
          console.warn("useChat websocket error", ev);
        },
        onMessage: (data: any) => {
          console.log("useChat.ws onMessage", data);
          if (data && typeof data === "object" && data.id) {
            setMessages((prev) => [...prev, data as Message]);
          }
        },
      });

      wsRef.current = client;
      try {
        console.log("useChat: connecting websocket", wsUrl);
        client.connect();
      } catch (e) {
        console.warn("useChat websocket connect failed", e);
      }
    };

    void ensureAndConnect();

    return () => {
      mounted = false;
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [roomId]);

  const sendMessage = async (text: string) => {
    console.log("useChat.sendMessage: called", { text, roomId, effectiveRoomId });
    const waitForOpen = (client: WebSocketClient | null, timeout = 10000) =>
      new Promise<void>((resolve, reject) => {
        const start = Date.now();
        const check = () => {
          if (client && client.isOpen()) return resolve();
          if (Date.now() - start >= timeout) return reject(new Error("timeout waiting for WebSocket open"));
          setTimeout(check, 100);
        };
        check();
      });

    // ensure we have an effective room id
    const rid = effectiveRoomId ?? roomId;
    if (!rid) return;
    if (rid === "new") {
      // Resolve a chatroom id using the backend helper. Do NOT attempt to POST to create a room.
      // This will throw if resolution fails or the backend does not return an id.
      console.log("useChat.sendMessage: resolving 'new' room id via backend");
      const profile = await userProfileService.getUserProfile();
      const userId = (profile as any)?.id;
      if (!userId) throw new Error("Cannot resolve chatroom: missing user id");
      const resolved = await chatService.resolveChatroomId({ user_id: String(userId) });
      console.log("useChat.sendMessage: resolveChatroomId response", resolved);
      const newId = (resolved as any).room_id ?? (resolved as any).id ?? (resolved as any).room;
      if (!newId) throw new Error("resolveChatroomId did not return a room id");

      const newRid = String(newId);
      setEffectiveRoomId(newRid);
      if ((resolved as any).messages) setMessages((resolved as any).messages as Message[]);

      // connect websocket to new room
      const apiBase = (import.meta.env.VITE_API_URL as string) || "https://api.oysloe.com/api-v1";
      const wsBaseRaw = (import.meta.env.VITE_WS_URL as string) || apiBase;
      const wsBase = wsBaseRaw.replace(/^http/, "ws").replace(/\/$/, "");
      const wsUrl = `${wsBase}/chatrooms/${newRid}/`;
      const token = typeof window !== "undefined" ? localStorage.getItem("oysloe_token") : null;
      const client = new WebSocketClient(wsUrl, token, {
        onOpen: () => {
          console.log("useChat.sendMessage.ws onOpen", { room: newRid });
          setConnected(true);
        },
        onClose: () => {
          console.log("useChat.sendMessage.ws onClose", { room: newRid });
          setConnected(false);
        },
        onError: (ev) => console.warn("useChat websocket error", ev),
        onMessage: (data) => {
          console.log("useChat.sendMessage.ws onMessage", data);
          if (data && typeof data === "object" && (data as any).id) {
            setMessages((prev) => [...prev, data as Message]);
          }
        },
      });
      wsRef.current = client;
      try {
        console.log("useChat.sendMessage: connecting websocket for new room", wsUrl);
        client.connect();
        // wait for socket to open, then return (and send the original text below)
        try {
          console.log("useChat.sendMessage: waiting for websocket open (new room)");
          await waitForOpen(wsRef.current);
          console.log("useChat.sendMessage: websocket open (new room)");
        } catch (err) {
          console.warn("useChat websocket connect failed or timed out", err);
        }
      } catch (e) {
        console.warn("useChat websocket connect failed", e);
      }

      // after resolving/connecting, attempt to send the original text (if any)
      if (text && wsRef.current && wsRef.current.isOpen()) {
        console.log("useChat.sendMessage: sending queued message (new room)", { text });
        wsRef.current.send({ type: "message", content: text });
      } else {
        console.log("useChat.sendMessage: socket not open after resolving new room — message not sent immediately", { text });
      }

      return;
    }

    // Normal room: if socket not open yet, wait for it briefly then send
    const client = wsRef.current;
    console.log("useChat.sendMessage: normal room, ensuring socket open before send", { clientOpen: !!client && client.isOpen() });
    if (!client || !client.isOpen()) {
      try {
        console.log("useChat.sendMessage: waiting for websocket open (normal room)");
        await waitForOpen(client);
        console.log("useChat.sendMessage: websocket open (normal room)");
      } catch (err) {
        console.warn("useChat.sendMessage: timeout waiting for socket open", err);
        throw new Error("WebSocket is not open; cannot send message (no fallbacks allowed)");
      }
    }

    // final send (will throw if something changed)
    console.log("useChat.sendMessage: sending", { text });
    wsRef.current!.send({ type: "message", content: text });
  };

  const addLocalMessage = (msg: Message) => setMessages((p) => [...p, msg]);

  const close = () => {
    wsRef.current?.close();
    wsRef.current = null;
    setConnected(false);
  };

  return { messages, sendMessage, addLocalMessage, connected, close };
}

export default useChat;

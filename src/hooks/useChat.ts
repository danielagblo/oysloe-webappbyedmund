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
      if (!roomId) return;
      // If caller passed a sentinel like 'new', skip resolving/connect until first send
      if (roomId === "new") {
        if (mounted) setMessages([]);
        return;
      }

      // Normal room id flow
      const rid = roomId;
      try {
        const msgs = await chatService.getChatRoomMessages(rid);
        if (mounted) setMessages(msgs);
      } catch (e) {
        console.error("useChat failed to load messages", e);
      }

      // build websocket url
      const apiBase = (import.meta.env.VITE_API_URL as string) || "https://api.oysloe.com/api-v1";
      const wsBaseRaw = (import.meta.env.VITE_WS_URL as string) || apiBase;
      const wsBase = wsBaseRaw.replace(/^http/, "ws").replace(/\/$/, "");
      const wsUrl = `${wsBase}/ws/chatrooms/${rid}/`;

      const token = typeof window !== "undefined" ? localStorage.getItem("oysloe_token") : null;
      const client = new WebSocketClient(wsUrl, token, {
        onOpen: () => setConnected(true),
        onClose: () => setConnected(false),
        onError: (ev) => console.warn("useChat websocket error", ev),
        onMessage: (data) => {
          if (data && typeof data === "object" && (data as any).id) {
            setMessages((prev) => [...prev, data as Message]);
          }
        },
      });

      wsRef.current = client;
      try {
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
    // ensure we have an effective room id
    const rid = effectiveRoomId ?? roomId;
    if (!rid) return;
    if (rid === "new") {
      // Resolve a chatroom id using the backend helper. Do NOT attempt to POST to create a room.
      // This will throw if resolution fails or the backend does not return an id.
      const profile = await userProfileService.getUserProfile();
      const userId = (profile as any)?.id;
      if (!userId) throw new Error("Cannot resolve chatroom: missing user id");

      const resolved = await chatService.resolveChatroomId({ user_id: String(userId) });
      const newId = (resolved as any).room_id ?? (resolved as any).id ?? (resolved as any).room;
      if (!newId) throw new Error("resolveChatroomId did not return a room id");

      const newRid = String(newId);
      setEffectiveRoomId(newRid);
      if ((resolved as any).messages) setMessages((resolved as any).messages as Message[]);

      // connect websocket to new room
      const apiBase = (import.meta.env.VITE_API_URL as string) || "https://api.oysloe.com/api-v1";
      const wsBaseRaw = (import.meta.env.VITE_WS_URL as string) || apiBase;
      const wsBase = wsBaseRaw.replace(/^http/, "ws").replace(/\/$/, "");
      const wsUrl = `${wsBase}/ws/chatrooms/${newRid}/`;
      const token = typeof window !== "undefined" ? localStorage.getItem("oysloe_token") : null;
      const client = new WebSocketClient(wsUrl, token, {
        onOpen: () => setConnected(true),
        onClose: () => setConnected(false),
        onError: (ev) => console.warn("useChat websocket error", ev),
        onMessage: (data) => {
          if (data && typeof data === "object" && (data as any).id) {
            setMessages((prev) => [...prev, data as Message]);
          }
        },
      });
      wsRef.current = client;
      try {
        client.connect();
      } catch (e) {
        console.warn("useChat websocket connect failed", e);
      }
      return;
    }

    if (!wsRef.current || !wsRef.current.isOpen()) {
      throw new Error("WebSocket is not open; cannot send message (no fallbacks allowed)");
    }

    wsRef.current.send({ type: "message", content: text });
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

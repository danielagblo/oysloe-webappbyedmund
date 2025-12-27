import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChatRoom } from "../services/chatService";
import { listChatRooms } from "../services/chatService";
import WebSocketClient from "../services/wsClient";
import { splitRooms } from "../utils/chatFilters";

type UseChatRoomsResult = {
  userRooms: ChatRoom[];
  supportRooms: ChatRoom[];
  unreadCount: number;
  supportActive: number;
  loading: boolean;
  refresh: () => void;
};

/**
 * useChatRooms
 * - Holds a canonical map of rooms (single source of truth)
 * - Derives and stores `userRooms` and `supportRooms` once per update
 * - Manages websocket updates which only update stored state (UI never renders raw payloads)
 */
export function useChatRooms(): UseChatRoomsResult {
  const { data: fetched = [], refetch, isLoading } = useQuery({
    queryKey: ["chatRooms"],
    queryFn: async () => {
      const rooms = await listChatRooms();
      return rooms as ChatRoom[];
    },
    staleTime: 30000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  // canonicalRooms stored as array for simple ordering operations
  const [canonicalRooms, setCanonicalRooms] = useState<ChatRoom[]>([]);

  // Derived lists saved explicitly to avoid filtering during render
  const [userRooms, setUserRooms] = useState<ChatRoom[]>([]);
  const [supportRooms, setSupportRooms] = useState<ChatRoom[]>([]);

  const wsRef = useRef<WebSocketClient | null>(null);

  // Normalize room shape helper (keeps same shape as elsewhere)
  const normalizeRoom = (raw: any): ChatRoom => {
    return {
      id: raw.id,
      room_id: raw.room_id ?? String(raw.id ?? ""),
      name: raw.name ?? String(raw.id ?? ""),
      is_group: raw.is_group ?? false,
      total_unread: raw.total_unread ?? raw.unread ?? raw.unread_count ?? 0,
      created_at: raw.created_at ?? raw.createdAt ?? null,
      messages: Array.isArray(raw.messages) ? raw.messages : [],
      members: Array.isArray(raw.members) ? raw.members : [],
      last_message: raw.last_message ?? raw.lastMessage ?? raw.last ?? null,
      ad_name: raw.ad_name ?? raw.adName ?? null,
      ad_image: raw.ad_image ?? raw.adImage ?? null,
    } as ChatRoom;
  };

  // Update canonicalRooms with a new array of rooms (replace-all, from initial list)
  useEffect(() => {
    if (!Array.isArray(fetched)) return;
    const normalized = fetched.map((r: any) => normalizeRoom(r));
    setCanonicalRooms((prev) => {
      // Avoid replacing state if nothing meaningful changed to prevent render loops
      try {
        if (prev.length === normalized.length) {
          let same = true;
          for (let i = 0; i < prev.length; i++) {
            if (String(prev[i].id) !== String(normalized[i].id)) {
              same = false;
              break;
            }
            // also compare last_message timestamps if present
            const aTime = prev[i].last_message ? String((prev[i].last_message as any).created_at ?? (prev[i].last_message as any).createdAt ?? (prev[i].last_message as any).id ?? "") : "";
            const bTime = normalized[i].last_message ? String((normalized[i].last_message as any).created_at ?? (normalized[i].last_message as any).createdAt ?? (normalized[i].last_message as any).id ?? "") : "";
            if (aTime !== bTime) { same = false; break; }
          }
          if (same) return prev;
        }
      } catch {
        // fallback to replace
      }
      return normalized;
    });
  }, [fetched]);

  // When canonicalRooms changes, derive the two buckets once
  useEffect(() => {
    const { supportRooms: s, userRooms: u } = splitRooms(canonicalRooms);
    // Only update derived lists when they actually change to avoid extra renders
    setSupportRooms((prev) => {
      try {
        if (prev.length === s.length) {
          let same = true;
          for (let i = 0; i < prev.length; i++) {
            if (String(prev[i].id) !== String(s[i].id)) { same = false; break; }
          }
          if (same) return prev;
        }
      } catch { }
      return s;
    });
    setUserRooms((prev) => {
      try {
        if (prev.length === u.length) {
          let same = true;
          for (let i = 0; i < prev.length; i++) {
            if (String(prev[i].id) !== String(u[i].id)) { same = false; break; }
          }
          if (same) return prev;
        }
      } catch { }
      return u;
    });
  }, [canonicalRooms]);

  // Setup websocket once: it must only update canonicalRooms via the same flow
  useEffect(() => {
    let mounted = true;
    try {
      const apiBase = (import.meta.env.VITE_API_URL as string) || "https://api.oysloe.com/api-v1";
      const wsBaseRaw = (import.meta.env.VITE_WS_URL as string) || apiBase;
      const wsBase = wsBaseRaw.replace(/^http/, "ws").replace(/\/$/, "");
      const token = typeof window !== "undefined" ? localStorage.getItem("oysloe_token") : null;
      const wsUrl = `${wsBase}/chatrooms/`;

      const client = new WebSocketClient(wsUrl, token, {
        onOpen: () => {},
        onClose: () => {},
        onError: (ev) => console.warn("[useChatRooms] WebSocket error", ev),
        onMessage: (payload: any) => {
          if (!mounted) return;
          try {
            // chatrooms_list: replace canonicalRooms (but preserve local member data when possible)
            if (payload && payload.type === "chatrooms_list" && Array.isArray(payload.chatrooms)) {
              const normalized = payload.chatrooms.map((r: any) => normalizeRoom(r));
              // Merge members from existing canonicalRooms when WS payload doesn't include them
              setCanonicalRooms((prev) => {
                const map = new Map(prev.map((r) => [String(r.id), r]));
                return normalized.map((nr) => {
                  const existing = map.get(String(nr.id));
                  if (existing && (!nr.members || nr.members.length === 0) && existing.members && existing.members.length > 0) {
                    nr.members = existing.members;
                  }
                  return nr;
                });
              });
              return;
            }

            // Individual room update / upsert
            if (payload && payload.id) {
              const normalized = normalizeRoom(payload);
              setCanonicalRooms((prev) => {
                const idx = prev.findIndex((r) => String(r.id) === String(normalized.id));
                if (idx === -1) {
                  // insert at front
                  return [normalized, ...prev];
                }
                const copy = [...prev];
                const merged = { ...copy[idx], ...normalized } as ChatRoom;
                if ((!normalized.members || normalized.members.length === 0) && copy[idx].members && copy[idx].members.length > 0) {
                  merged.members = copy[idx].members;
                }
                copy[idx] = merged;

                // Re-evaluate classification: if merged now belongs to different bucket, that's fine — derived lists will update from canonicalRooms effect
                return copy;
              });
            }
          } catch (e) {
            console.warn("[useChatRooms] Failed to handle ws message", e);
          }
        },
      });

      wsRef.current = client;
      try {
        client.connect();
      } catch (e) {
        console.warn("[useChatRooms] WebSocket connect failed", e);
      }
    } catch (err) {
      console.warn("[useChatRooms] Failed to create ws client", err);
    }

    return () => {
      mounted = false;
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  const unreadCount = useMemo(() => {
    return userRooms.reduce((acc, r) => acc + (r.total_unread ?? 0), 0);
  }, [userRooms]);

  const supportActive = useMemo(() => supportRooms.length, [supportRooms]);

  return {
    userRooms,
    supportRooms,
    unreadCount,
    supportActive,
    loading: isLoading,
    refresh: () => void refetch(),
  };
}

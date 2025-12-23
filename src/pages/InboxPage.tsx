import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LiveChat from "../components/LiveChat";
import MenuButton from "../components/MenuButton";
import ProfileStats from "../components/ProfileStats";
import SupportAndCases from "../components/SupportAndCases";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import useWsChat from "../features/chat/useWsChat";
import { useQueryClient } from "@tanstack/react-query";
import * as chatService from "../services/chatService";

export default function InboxPage() {
  const isSmallScreen = useIsSmallScreen(1024);
  const location = useLocation();
  const initialOpen = (location.state as any)?.openRoom ?? null;
  const [selectedCase, setSelectedCase] = useState<string | null>(initialOpen);

  // Keep WebSocket store alive while InboxPage is mounted
  const ws = useWsChat();
  const queryClient = useQueryClient();

  // Prefetch chatroom messages in the background so LiveChat can show them immediately
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rooms = await chatService.listChatRooms();
        if (cancelled || !Array.isArray(rooms)) return;

        const storeMap: Record<string, unknown[]> = {};

        for (const r of rooms) {
          try {
            const roomKey = String(r.room_id ?? r.id ?? r.name ?? "");
            if (!roomKey) continue;
            // fetch messages for the room; ignore failures per-room
            try {
              const msgs = await chatService.getChatRoomMessages(r.room_id ?? r.id ?? r.name ?? r.id);
              if (cancelled) return;
              if (Array.isArray(msgs) && msgs.length > 0) {
                // populate react-query cache so LiveChat picks it up on mount
                try { queryClient.setQueryData(["chatMessages", roomKey], msgs); } catch { /* ignore */ }
                storeMap[roomKey] = msgs;
              }
            } catch (e) {
              void e;
            }
          } catch {
            // ignore per-room errors
          }
        }

        // Persist to localStorage as fallback (LiveChat reads this when needed)
        try {
          const KEY = "oysloe_chat_messages";
          let raw: string | null = null;
          try { raw = localStorage.getItem(KEY); } catch { raw = null; }
          const existing = raw ? JSON.parse(raw || "{}") : {};
          const merged = { ...(existing || {}), ...(storeMap || {}) };
          try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch { /* ignore quota errors */ }
        } catch { /* ignore */ }
      } catch {
        // ignore top-level errors
      }
    })();

    return () => { cancelled = true; };
  }, [queryClient]);

  // Helper to prefetch messages for a single room and persist to react-query/localStorage
  const prefetchRoomMessages = async (caseId: string | null) => {
    if (!caseId) return;
    const roomKey = String(caseId);

    try {
      const cachedFromQ = queryClient.getQueryData(["chatMessages", roomKey]) as any[] | undefined;
      if (Array.isArray(cachedFromQ) && cachedFromQ.length > 0) return;
    } catch {
      // ignore
    }

    try {
      // localStorage fallback check
      const KEY = "oysloe_chat_messages";
      let raw: string | null = null;
      try { raw = localStorage.getItem(KEY); } catch { raw = null; }
      if (raw) {
        try {
          const map = JSON.parse(raw || "{}") || {};
          const cached = map[roomKey];
          if (Array.isArray(cached) && cached.length > 0) {
            try { queryClient.setQueryData(["chatMessages", roomKey], cached); } catch { /* ignore */ }
            return;
          }
        } catch {
          // ignore parse errors
        }
      }
    } catch {
      // ignore
    }

    try {
      const msgs = await chatService.getChatRoomMessages(caseId);
      if (Array.isArray(msgs) && msgs.length > 0) {
        try { queryClient.setQueryData(["chatMessages", roomKey], msgs); } catch { /* ignore */ }
        try {
          const KEY = "oysloe_chat_messages";
          let raw: string | null = null;
          try { raw = localStorage.getItem(KEY); } catch { raw = null; }
          const existing = raw ? JSON.parse(raw || "{}") : {};
          const merged = { ...(existing || {}), [roomKey]: msgs };
          try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch { /* ignore */ }
        } catch {
          // ignore localStorage write errors
        }
      }
    } catch (e) {
      void e;
    }
  };

  // Wrapper to open a case only after prefetching its messages. Toggles closed when same id selected.
  // const openCase = async (caseId: string | null) => {
  //   if (!caseId) return setSelectedCase(null);
  //   if (selectedCase === caseId) return setSelectedCase(null);
  //   try {
  //     await prefetchRoomMessages(caseId);
  //   } catch {
  //     // ignore prefetch errors and still open the chat
  //   }
  //   setSelectedCase(caseId);
  // };

  // If navigation opened the Inbox with an initial room to open, prefetch first
  useEffect(() => {
    if (!initialOpen) return;
    let cancelled = false;
    (async () => {
      try {
        await prefetchRoomMessages(initialOpen as string);
        if (!cancelled) setSelectedCase(initialOpen as string);
      } catch {
        if (!cancelled) setSelectedCase(initialOpen as string);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative bg-[#ededed] min-h-screen h-screen w-full overflow-hidden">
      {/* <div className="lg:hidden w-full">
        <MobileBanner page="Inbox" /> 
      </div> */}

      {/* Page content */}
      <div className="flex w-full h-full overflow-hidden lg:items-center">
        {/* Profile Stats (Desktop only) */}
        <div className="hidden lg:flex w-[25vw] h-[100vh] items-center justify-center pl-2">
          <ProfileStats />
        </div>

        {/* Live Chat — desktop: right column; mobile: full-screen when open */}
        {/* Support list is hidden on mobile when chat is open; chat becomes full-screen */}
        <div
          className={`lg:w-[50vw] w-full h-screen overflow-y-auto no-scrollbar lg:py-5 lg:pr-1 ${selectedCase ? "hidden lg:block" : ""}`}
        >
          <SupportAndCases
            onSelectCase={(caseId) =>
              setSelectedCase((prev) => (prev === caseId ? null : caseId))
            }
            onSelectChat={(chatId) =>
              setSelectedCase((prev) => (prev === chatId ? null : chatId))
            }
          />
        </div>

        {(selectedCase && isSmallScreen) ? ( //dev note to whoever changed this logic: the logic has to be like this bc PC's initial render doesnt have selectedCase but mobile does
            <div className="lg:hidden fixed inset-0 z-40 bg-white overflow-hidden">
              <div className="h-full w-full">
                <LiveChat
                  caseId={selectedCase}
                  onClose={() => setSelectedCase(null)}
                  ws={ws}
                />
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex lg:w-[50%] lg:grow lg:justify-center lg:items-center w-full h-screen overflow-y-auto lg:py-5 lg:px-1.5 lg:mr-1">
              <LiveChat
                caseId={selectedCase}
                onClose={() => setSelectedCase(null)}
                ws={ws}
              />
            </div>
          )
        }



        {/* Bottom nav */}
        <MenuButton />
      </div>
    </div>
  );
}


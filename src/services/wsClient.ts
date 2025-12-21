type WSHandlers = {
  onOpen?: (ev: Event) => void;
  onClose?: (ev: CloseEvent) => void;
  onError?: (ev: Event) => void;
  onMessage?: (data: any) => void;
};

export class WebSocketClient {
  private url: string;
  private token?: string | null;
  private ws: WebSocket | null = null;
  private handlers: WSHandlers;
  private reconnectInterval = 3000;
  private shouldReconnect = true;

  constructor(url: string, token?: string | null, handlers: WSHandlers = {}) {
    this.url = url;
    this.token = token;
    this.handlers = handlers;
  }

  connect() {
    // Browser WebSocket cannot set custom headers; use query param for token
    const sep = this.url.includes("?") ? "&" : "?";
    const urlWithToken = this.token
      ? `${this.url}${sep}token=${encodeURIComponent(this.token)}`
      : this.url;

    console.log("WebSocketClient.connect: opening", { urlWithToken });
    try {
      this.ws = new WebSocket(urlWithToken);
    } catch (err) {
      console.warn("WebSocketClient.connect: constructor threw", err, {
        urlWithToken,
      });
      throw err;
    }

    this.ws.onopen = (ev) => {
      console.log("WebSocketClient.onopen", { urlWithToken });
      this.handlers.onOpen?.(ev);
    };
    this.ws.onclose = (ev) => {
      console.log("WebSocketClient.onclose", {
        code: ev?.code,
        reason: ev?.reason,
        urlWithToken,
      });
      this.handlers.onClose?.(ev);
      if (this.shouldReconnect) {
        setTimeout(() => this.connect(), this.reconnectInterval);
      }
    };
    this.ws.onerror = (ev) => this.handlers.onError?.(ev);
    this.ws.onmessage = (ev) => {
      try {
        // log raw incoming frame for debugging
        try {
          console.debug("WebSocketClient.onmessage.raw", ev.data);
        } catch (e) {
          // ignore logging errors
          void e;
        }

        const payload = JSON.parse(ev.data);
        // Normalize any chatroom avatar paths coming from the server so
        // downstream handlers can rely on an absolute URL (or null for empty).
        try {
          const apiRaw = (import.meta.env.VITE_API_URL as string) || "https://api.oysloe.com/api-v1";
          let apiOrigin = "";
          try {
            apiOrigin = new URL(apiRaw).origin;
          } catch {
            apiOrigin = apiRaw.replace(/\/+$/, "");
          }

          const normalizeSrc = (src: any) => {
            if (src == null) return null;
            const s = String(src).trim();
            if (s === "") return null;
            if (s.startsWith("http://") || s.startsWith("https://")) return s;
            if (s.startsWith("/")) return `${apiOrigin}${s}`;
            return `${apiOrigin}/${s.replace(/^\/+/, "")}`;
          };

          const normalizeRoomObj = (r: any) => {
            if (!r || typeof r !== "object") return;
            if (r.other_user_avatar != null) r.other_user_avatar = normalizeSrc(r.other_user_avatar);
            if (r.avatar != null) r.avatar = normalizeSrc(r.avatar);
            if (r.image != null) r.image = normalizeSrc(r.image);
            if (r.last_message && typeof r.last_message === "object") {
              if (r.last_message.avatar != null) r.last_message.avatar = normalizeSrc(r.last_message.avatar);
            }
          };

          if (payload && typeof payload === "object") {
            if (Array.isArray(payload.chatrooms)) payload.chatrooms.forEach(normalizeRoomObj);
            if (Array.isArray(payload.rooms)) payload.rooms.forEach(normalizeRoomObj);
            if (payload.room && typeof payload.room === "object") normalizeRoomObj(payload.room);
            // also support top-level arrays that are directly the chatrooms list
            if (Array.isArray(payload) && payload.length > 0) payload.forEach(normalizeRoomObj);
          }
        } catch (e) {
          void e;
        }
        try {
          console.debug("WebSocketClient.onmessage.parsed", payload);
        } catch (e) {
          void e;
        }

        // Lightweight persistence: save normalized chatrooms list so UI
        // can read them immediately on startup / before the hook receives
        // the live update. Keep this minimal and best-effort only.
        try {
          if (typeof window !== "undefined" && window.localStorage && payload && typeof payload === "object") {
            let toSave: any = null;
            if (Array.isArray(payload.chatrooms) && payload.chatrooms.length > 0) {
              toSave = payload.chatrooms;
            } else if (Array.isArray(payload) && payload.length > 0) {
              // support servers that send the chatrooms array as the top-level
              toSave = payload;
            }
            if (toSave) {
              try {
                localStorage.setItem("oysloe_chatrooms", JSON.stringify(toSave));
              } catch (e) {
                // ignore storage errors (quota, private mode, etc.)
                void e;
              }
            }
          }
        } catch (e) {
          void e;
        }

        this.handlers.onMessage?.(payload);
      } catch (err) {
        // pass raw data if not JSON
        try {
          console.debug("WebSocketClient.onmessage.rawNonJson", ev.data);
        } catch (e) {
          void e;
        }
        this.handlers.onMessage?.(ev.data);
      }
    };
  }

  send(data: unknown) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not open");
    }
    const payload = typeof data === "string" ? data : JSON.stringify(data);
    this.ws.send(payload);
  }

  close() {
    this.shouldReconnect = false;
    this.ws?.close();
    this.ws = null;
  }

  isOpen() {
    return !!this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

export default WebSocketClient;

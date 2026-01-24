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

  // NEW: prevent duplicate connects + allow reconnect timer cleanup
  private isConnecting = false;
  private reconnectTimer: number | null = null;

  // NEW: queue messages attempted before OPEN
  private sendQueue: string[] = [];

  // NEW: keepalive (helps prevent silent disconnects / slow “first load”)
  private heartbeatTimer: number | null = null;
  private heartbeatMs = 25000;

  constructor(url: string, token?: string | null, handlers: WSHandlers = {}) {
    this.url = url;
    this.token = token;
    this.handlers = handlers;
  }

  private buildUrlWithToken() {
    const sep = this.url.includes("?") ? "&" : "?";
    return this.token
      ? `${this.url}${sep}token=${encodeURIComponent(this.token)}`
      : this.url;
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    // send a ping regularly to keep connection alive (server may ignore)
    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send(JSON.stringify({ type: "ping", ts: Date.now() }));
        } catch {
          // ignore
        }
      }
    }, this.heartbeatMs);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer != null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer != null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private flushQueue() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    while (this.sendQueue.length > 0) {
      const msg = this.sendQueue.shift();
      if (!msg) continue;
      try {
        this.ws.send(msg);
      } catch {
        // if send fails, push it back and stop trying
        this.sendQueue.unshift(msg);
        break;
      }
    }
  }

  connect() {
    // Idempotent: don't open multiple sockets
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }
    if (this.isConnecting) return;

    this.isConnecting = true;
    this.clearReconnectTimer();

    const urlWithToken = this.buildUrlWithToken();
    console.log("WebSocketClient.connect: opening", { urlWithToken });

    try {
      this.ws = new WebSocket(urlWithToken);
    } catch (err) {
      this.isConnecting = false;
      console.warn("WebSocketClient.connect: constructor threw", err, { urlWithToken });
      throw err;
    }

    this.ws.onopen = (ev) => {
      this.isConnecting = false;
      console.log("WebSocketClient.onopen", { urlWithToken });

      this.startHeartbeat();

      // IMPORTANT: flush queued messages immediately so "load history" works
      this.flushQueue();

      this.handlers.onOpen?.(ev);
    };

    this.ws.onclose = (ev) => {
      this.isConnecting = false;
      this.stopHeartbeat();

      console.log("WebSocketClient.onclose", {
        code: ev?.code,
        reason: ev?.reason,
        urlWithToken,
      });

      this.handlers.onClose?.(ev);

      if (this.shouldReconnect) {
        this.clearReconnectTimer();
        this.reconnectTimer = window.setTimeout(() => this.connect(), this.reconnectInterval);
      }
    };

    this.ws.onerror = (ev) => {
      this.isConnecting = false;
      this.handlers.onError?.(ev);
    };

    this.ws.onmessage = (ev) => {
      try {
        try {
          console.debug("WebSocketClient.onmessage.raw", ev.data);
        } catch {
          // ignore
        }

        const payload = JSON.parse(ev.data);

        // Normalize chatroom avatar paths
        try {
          const apiRaw =
            (import.meta.env.VITE_API_URL as string) || "https://api.oysloe.com/api-v1";
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
            if (Array.isArray((payload as any).chatrooms)) (payload as any).chatrooms.forEach(normalizeRoomObj);
            if (Array.isArray((payload as any).rooms)) (payload as any).rooms.forEach(normalizeRoomObj);
            if ((payload as any).room && typeof (payload as any).room === "object") normalizeRoomObj((payload as any).room);
            if (Array.isArray(payload)) payload.forEach(normalizeRoomObj);
          }
        } catch {
          // ignore
        }

        try {
          console.debug("WebSocketClient.onmessage.parsed", payload);
        } catch {
          // ignore
        }

        // Save normalized chatrooms list
        try {
          if (typeof window !== "undefined" && window.localStorage && payload && typeof payload === "object") {
            let toSave: any = null;
            if (Array.isArray((payload as any).chatrooms) && (payload as any).chatrooms.length > 0) {
              toSave = (payload as any).chatrooms;
            } else if (Array.isArray(payload) && payload.length > 0) {
              toSave = payload;
            }
            if (toSave) {
              try {
                localStorage.setItem("oysloe_chatrooms", JSON.stringify(toSave));
              } catch {
                // ignore
              }
            }
          }
        } catch {
          // ignore
        }

        this.handlers.onMessage?.(payload);
      } catch (err) {
        try {
          console.debug("WebSocketClient.onmessage.rawNonJson", ev.data);
        } catch {
          // ignore
        }
        this.handlers.onMessage?.(ev.data);
      }
    };
  }

  // NEW behavior: if not open yet, queue it (don’t throw)
  send(data: unknown) {
    const payload = typeof data === "string" ? data : JSON.stringify(data);

    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      // ensure we connect if someone tries to send early
      this.sendQueue.push(payload);
      this.connect();
      return;
    }

    if (this.ws.readyState === WebSocket.CONNECTING) {
      this.sendQueue.push(payload);
      return;
    }

    if (this.ws.readyState !== WebSocket.OPEN) {
      this.sendQueue.push(payload);
      return;
    }

    this.ws.send(payload);
  }

  close() {
    this.shouldReconnect = false;
    this.clearReconnectTimer();
    this.stopHeartbeat();
    this.sendQueue = [];
    this.ws?.close();
    this.ws = null;
    this.isConnecting = false;
  }

  isOpen() {
    return !!this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

export default WebSocketClient;

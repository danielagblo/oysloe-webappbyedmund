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
    const urlWithToken = this.token ? `${this.url}${sep}token=${encodeURIComponent(this.token)}` : this.url;

    this.ws = new WebSocket(urlWithToken);

    this.ws.onopen = (ev) => {
      this.handlers.onOpen?.(ev);
    };
    this.ws.onclose = (ev) => {
      this.handlers.onClose?.(ev);
      if (this.shouldReconnect) {
        setTimeout(() => this.connect(), this.reconnectInterval);
      }
    };
    this.ws.onerror = (ev) => this.handlers.onError?.(ev);
    this.ws.onmessage = (ev) => {
      try {
        const payload = JSON.parse(ev.data);
        this.handlers.onMessage?.(payload);
      } catch (err) {
        // pass raw data if not JSON
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

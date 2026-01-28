import { apiClient } from "./apiClient";

function getStoredUserId(): number | null {
  try {
    const raw = localStorage.getItem("oysloe_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as any;
    if (parsed == null) return null;
    if (typeof parsed.id === "number") return parsed.id;
    if (typeof parsed.user_id === "number") return parsed.user_id;
    return null;
  } catch (e) {
    return null;
  }
}

export type Device = {
  id: number;
  user: number;
  token: string;
  created_at: string;
};

export const notificationService = {
  // The notifications endpoints live on the root API host (not always under /api-v1).
  // Use direct fetch to post to the notifications base so we can strip /api-v1 when necessary.
  listDevices: () => apiClient.get<Device[]>("/notifications/devices/"),
  getDevice: (id: number) => apiClient.get<Device>(`/notifications/devices/${id}/`),
  createDevice: (token: string) => apiClient.post<Device>("/notifications/devices/", { token }),
  updateDevice: (id: number, body: Partial<Device>) => apiClient.put<Device>(`/notifications/devices/${id}/`, body),
  patchDevice: (id: number, body: Partial<Device>) => apiClient.patch<Device>(`/notifications/devices/${id}/`, body),
  deleteDevice: (id: number) => apiClient.delete<void>(`/notifications/devices/${id}/`),
  saveFcmToken: async (token: string, userId?: number) => {
    const body: Record<string, unknown> = { token, replace_other_token: true };
    const uid = typeof userId === "number" ? userId : getStoredUserId();
    if (uid != null) body.user_id = uid;
    return sendToNotifications("/notifications/save-fcm-token/", body);
  },
  // Attempt to unsubscribe a local PushSubscription (best-effort).
  unregisterLocalSubscription: async () => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return false;
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (!reg) return false;
      const sub = await reg.pushManager.getSubscription();
      if (!sub) return false;
      await sub.unsubscribe();
      // inform backend that this endpoint is unsubscribed (best-effort)
      try {
        await sendToNotifications("/notifications/save-fcm-token/", {
          token: JSON.stringify({ unsubscribed: true, endpoint: sub.endpoint }),
          user_id: getStoredUserId(),
          replace_other_token: true,
        });
      } catch (e) {
        void e;
      }
      return true;
    } catch (e) {
      console.error("Failed to unregister push subscription", e);
      return false;
    }
  },
  // Best-effort: register service worker and subscribe to PushManager, then send subscription to backend
  registerLocalSubscription: async () => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator) || !("PushManager" in window)) return null;
    try {
      // Use the generated firebase messaging service worker so push and FCM
      // notifications are handled by the same SW registration.
      const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      const existing = await reg.pushManager.getSubscription();
      if (existing) {
        // send existing subscription to backend
        try {
          await sendToNotifications("/notifications/save-fcm-token/", { token: JSON.stringify(existing), user_id: getStoredUserId(), replace_other_token: true });
        } catch (e) {
          void e;
        }
        return existing;
      }
      const vapid = (import.meta.env.VITE_VAPID_KEY as string) || undefined;
      let options: PushSubscriptionOptionsInit = { userVisibleOnly: true };
      if (vapid) {
        const toUint8 = (base64String: string) => {
          const padding = "".padEnd((4 - (base64String.length % 4)) % 4, "=");
          const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
          const rawData = atob(base64);
          const outputArray = new Uint8Array(rawData.length);
          for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
          return outputArray;
        };
        try {
          options.applicationServerKey = toUint8(vapid);
        } catch (e) {
          void e;
        }
      }
      const sub = await reg.pushManager.subscribe(options as PushSubscriptionOptionsInit);
        try {
        await sendToNotifications("/notifications/save-fcm-token/", { token: JSON.stringify(sub), user_id: getStoredUserId(), replace_other_token: true });
      } catch (e) {
        void e;
      }
      return sub;
    } catch (e) {
      console.error("Failed to register local push subscription", e);
      return null;
    }
  },
};

export default notificationService;

// Helper: derive notifications base URL and POST directly (keeps auth header behavior similar to apiClient)
async function sendToNotifications(path: string, body: unknown, method = "POST") {
  // Prefer explicit override
  const explicit = (import.meta.env.VITE_NOTIFICATIONS_BASE_URL as string) || null;
  const apiUrl = (import.meta.env.VITE_API_URL as string) || "https://api.oysloe.com/api-v1";
  // If explicit base provided use it; otherwise strip trailing /api-v1 from apiUrl to reach root API host
  const base = explicit
    ? explicit.replace(/\/$/, "")
    : apiUrl.replace(/\/?api-v\d+\/?$/i, "").replace(/\/$/, "") || apiUrl;

  const full = `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  // Use same auth scheme as apiClient
  const AUTH_SCHEME =
    (import.meta.env.VITE_API_AUTH_SCHEME as string) || "Bearer";

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  
  // Get token and add Authorization header (matching apiClient behavior)
  try {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("oysloe_token");
      // Only add Authorization if not already provided and we have a token
      if (token && !headers["Authorization"] && !headers["authorization"]) {
        const tokenValue =
          token.startsWith("Bearer ") || token.startsWith("Token ")
            ? token
            : `${AUTH_SCHEME} ${token}`;
        headers["Authorization"] = tokenValue;
      }
    }
  } catch (e) {
    // ignore localStorage errors (e.g., private mode) and continue without auth header
    void e;
  }

  // Check if we have auth token before making request
  if (!headers["Authorization"] && !headers["authorization"]) {
    console.warn("sendToNotifications: No auth token found, request may fail");
  }

  console.debug("sendToNotifications: POST", { 
    full, 
    body, 
    hasAuth: Boolean(headers["Authorization"] || headers["authorization"]),
    authScheme: AUTH_SCHEME 
  });

  const res = await fetch(full, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: (import.meta.env.VITE_API_CREDENTIALS as RequestCredentials) || "omit",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    console.error("sendToNotifications failed", { 
      status: res.status, 
      text: txt, 
      url: full,
      hasAuth: Boolean(headers["Authorization"] || headers["authorization"])
    });
    throw new Error(txt || `Request failed (${res.status})`);
  }
  if (res.status === 204) return undefined;
  const json = await res.json().catch(() => null);
  console.debug("sendToNotifications: response", { status: res.status, json });
  return json;
}

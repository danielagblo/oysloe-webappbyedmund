import { initializeApp } from "firebase/app";
import {
    deleteToken,
    getMessaging,
    getToken,
    onMessage,
} from "firebase/messaging";
import notificationService from "./notificationService";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

async function ensureFirebaseSwRegistered() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    // If a service worker with the firebase-messaging filename is already registered, return it
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const r of regs) {
      if (r.active && r.active.scriptURL && r.active.scriptURL.includes("firebase-messaging-sw.js")) {
        console.debug("Firebase SW already registered:", r.active.scriptURL);
        return r;
      }
    }

    // Build service worker script dynamically using environment values so users don't need to edit files
    const swConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    } as Record<string, string | undefined>;

    const swContent = `importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');\nimportScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');\n\nfirebase.initializeApp(${JSON.stringify(swConfig)});\nconst messaging = firebase.messaging();\nmessaging.onBackgroundMessage(function(payload) {\n  const n = payload.notification || {};\n  self.registration.showNotification(n.title || 'Notification', { body: n.body || '', icon: n.icon || '/favicon.png' });\n});\n`;

    const blob = new Blob([swContent], { type: "application/javascript" });
    const swUrl = URL.createObjectURL(blob);
    // register at root scope so it handles notifications for the whole site
    const reg = await navigator.serviceWorker.register(swUrl, { scope: "/" });
    console.debug("Registered dynamic firebase SW", reg);
    return reg;
  } catch (e) {
    console.error("Failed to register firebase SW dynamically", e);
    return null;
  }
}

export async function getFcmToken(): Promise<string | null> {
  try {
    // Ensure browser permission is granted first (will prompt the user if needed)
    if (typeof Notification !== "undefined" && Notification.permission !== "granted") {
      try {
        const p = await Notification.requestPermission();
        if (p !== "granted") {
          console.debug("Notification permission not granted", p);
          return null;
        }
      } catch (e) {
        void e;
        return null;
      }
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;
    const token = await getToken(messaging, { vapidKey });
    return token ?? null;
  } catch (e) {
    console.error("getFcmToken error", e);
    return null;
  }
}

export async function removeFcmToken(): Promise<boolean> {
  try {
    const result = await deleteToken(messaging);
    return Boolean(result);
  } catch (e) {
    console.error("removeFcmToken error", e);
    return false;
  }
}

export function onFcmMessage(cb: (payload: any) => void) {
  onMessage(messaging, cb);
}

export async function registerAndSaveToken() {
  // Ensure firebase messaging service worker is registered with current config
  try {
    await ensureFirebaseSwRegistered();
  } catch (e) {
    console.warn("ensureFirebaseSwRegistered failed", e);
  }

  const token = await getFcmToken();
  if (token) {
    try {
      await notificationService.saveFcmToken(token);
      try {
        localStorage.setItem("oysloe_fcm_token", token);
      } catch (e) {
        void e;
      }
      console.debug("FCM token obtained and sent to backend", token);
    } catch (e) {
      console.error("Failed saving FCM token to backend", e);
    }
    return token;
  }
  console.debug("No FCM token obtained");
  return null;
}

// Expose a dev-only global to trigger registration from the browser console.
if (import.meta.env.DEV && typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.__registerFcm = registerAndSaveToken;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  window.__removeFcm = removeAndNotify;
}

export async function removeAndNotify() {
  try {
    const ok = await removeFcmToken();
    // Tell backend the token was removed; best-effort
    try {
      // If we previously stored the token locally, send that token so backend can remove it.
      let tokenToSend: string | null = null;
      try {
        tokenToSend = localStorage.getItem("oysloe_fcm_token");
      } catch (e) {
        void e;
      }
      // Backend expects { token: string } — send empty string if unknown (avoid sending JSON-stringified objects)
      await notificationService.saveFcmToken(tokenToSend ?? "");
      try {
        localStorage.removeItem("oysloe_fcm_token");
      } catch (e) {
        void e;
      }
    } catch (e) {
      void e;
    }
    return ok;
  } catch (e) {
    return false;
  }
}

export default {
  getFcmToken,
  removeFcmToken,
  onFcmMessage,
  registerAndSaveToken,
  removeAndNotify,
};

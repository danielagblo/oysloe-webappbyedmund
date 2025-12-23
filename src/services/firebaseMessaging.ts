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


    // Service workers cannot be registered from blob URLs
    try {
      const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: "/" });
      console.debug("Registered firebase-messaging-sw.js", reg);
      return reg;
    } catch (swError) {
      // If the static file doesn't exist, log a helpful error
      console.error(
        "Failed to register firebase-messaging-sw.js. Make sure to run 'npm run generate-sw' before building, or ensure the file exists in the public directory.",
        swError
      );
      // Don't throw - allow the app to continue, Firebase messaging just won't work
      return null;
    }
  } catch (e) {
    console.error("Failed to register firebase SW", e);
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

export function onFcmMessage(cb: (payload: any) => void): () => void {
  return onMessage(messaging, cb);
}

export async function registerAndSaveToken() {
  // Check if user is authenticated before proceeding
  try {
    const authToken = localStorage.getItem("oysloe_token");
    if (!authToken) {
      console.debug("No auth token found; skipping FCM token registration");
      return null;
    }
  } catch (e) {
    console.warn("Failed to check auth token", e);
    return null;
  }

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
      // Don't throw - allow app to continue
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

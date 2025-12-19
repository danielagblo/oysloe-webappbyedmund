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

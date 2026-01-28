import { useCallback, useEffect, useState } from "react";
import notificationService from "../services/notificationService";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "".padEnd((4 - (base64String.length % 4)) % 4, "=");
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export function usePushNotifications() {
  const [supported] = useState<boolean>("serviceWorker" in navigator && "PushManager" in window && "Notification" in window);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default",
  );

  useEffect(() => {
    if (typeof Notification !== "undefined") setPermission(Notification.permission);
  }, []);

  const registerServiceWorker = useCallback(async () => {
    if (!supported) throw new Error("Push not supported in this browser");
    try {
      // Register the generated Firebase messaging service worker instead of
      // the standalone push-sw so a single SW handles all notifications.
      const reg = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      return reg;
    } catch (err) {
      console.error("Service worker registration failed", err);
      throw err;
    }
  }, [supported]);

  const requestPermission = useCallback(async () => {
    if (!supported) throw new Error("Push not supported");
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, [supported]);

  const subscribe = useCallback(async (vapidKey?: string) => {
    if (!supported) throw new Error("Push not supported");
    if (Notification.permission !== "granted") {
      const p = await requestPermission();
      if (p !== "granted") throw new Error("Permission not granted");
    }
    const reg = await registerServiceWorker();
    const existing = await reg.pushManager.getSubscription();
    if (existing) {
      // send existing subscription to backend
      await notificationService.saveFcmToken(JSON.stringify(existing));
      return existing;
    }
    const options: PushSubscriptionOptionsInit = {};
    if (vapidKey) options.applicationServerKey = urlBase64ToUint8Array(vapidKey);
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, ...options });
    // Send subscription (stringified) to backend's save-fcm-token endpoint
    await notificationService.saveFcmToken(JSON.stringify(sub));
    return sub;
  }, [registerServiceWorker, requestPermission, supported]);

  const unsubscribe = useCallback(async () => {
    if (!supported) throw new Error("Push not supported");
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return false;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return false;
    const ok = await sub.unsubscribe();
    // the backend may want to delete the token; try best-effort
    try {
      await notificationService.saveFcmToken(JSON.stringify({ unsubscribed: true, endpoint: sub.endpoint }));
    } catch (e) {
      void e;
    }
    return ok;
  }, [supported]);

  return {
    supported,
    permission,
    requestPermission,
    registerServiceWorker,
    subscribe,
    unsubscribe,
    service: notificationService,
  } as const;
}

export default usePushNotifications;

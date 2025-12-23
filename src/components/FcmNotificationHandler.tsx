import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "../features/Auth/useAuth";
import firebaseMessaging from "../services/firebaseMessaging";

/**
 * Component that listens for FCM messages and handles them appropriately.
 * Should be mounted at the app level to ensure it's always active when user is logged in.
 */
export default function FcmNotificationHandler() {
  const queryClient = useQueryClient();
  const { data: currentUser } = useCurrentUser();

  useEffect(() => {
    // Only set up FCM listener if user is authenticated
    if (!currentUser) {
      return;
    }

    // Check if notifications are opted in
    const optedIn = (() => {
      try {
        return localStorage.getItem("oysloe_notifications_opt_in") === "true";
      } catch {
        return false;
      }
    })();

    if (!optedIn) {
      console.debug("User has not opted in to notifications; skipping FCM listener");
      return;
    }

    // Set up listener for foreground FCM messages
    // When app is in foreground, Firebase SDK calls this callback
    const unsubscribe = firebaseMessaging.onFcmMessage((payload) => {
      // Log full payload for troubleshooting missing browser notifications
      console.debug("FCM foreground payload:", {
        notification: payload.notification,
        data: payload.data,
        raw: payload,
      });
      // Expose last payload globally for quick inspection in DevTools
      if (typeof window !== "undefined") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.__lastFcmPayload = payload;
      }

      // Refresh alerts query to show new alert
      queryClient.invalidateQueries({ queryKey: ["alerts"] });

      // Show browser notification if permission is granted
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        const notification = payload.notification || {};
        const title = notification.title || "New Alert";
        const body = notification.body || "";
        const icon = notification.icon || "/favicon.png";
        const tag =
          (payload.data?.alert_id ? `alert-${payload.data.alert_id}` : undefined) ||
          (payload as any)?.messageId ||
          `alert-${Date.now()}`;

        // Prefer showing via service worker registration (works even if window Notification is blocked)
        try {
          if ("serviceWorker" in navigator) {
            navigator.serviceWorker.getRegistration().then((reg) => {
              if (reg && reg.showNotification) {
                reg
                  .showNotification(title, {
                    body,
                    icon,
                    badge: "/favicon.png",
                  tag,
                  requireInteraction: false,
                  renotify: true,
                  silent: false,
                  data: payload.data ?? {},
                  })
                  .then(() => console.debug("Foreground notification shown via SW", { tag, title, body }))
                  .catch((err) => console.debug("Foreground notification showNotification failed", err));
                return;
              }
              // Fallback to window Notification
              const browserNotification = new Notification(title, {
                body,
                icon,
                badge: "/favicon.png",
                tag,
                requireInteraction: false,
              });
              browserNotification.onclick = () => {
                window.focus();
                browserNotification.close();
              };
              console.debug("Foreground notification shown via window Notification", { tag, title, body });
            });
          }
        } catch (err) {
          console.debug("Failed to show foreground notification", err);
        }
      } else {
        console.debug("Notification permission not granted; skipping foreground toast", Notification?.permission);
      }
    });

    // Cleanup: unsubscribe when component unmounts or user logs out
    return () => {
      unsubscribe();
    };
  }, [currentUser, queryClient]);

  // This component doesn't render anything
  return null;
}


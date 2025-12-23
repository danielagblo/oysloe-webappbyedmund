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
      console.debug("FCM message received (foreground):", payload);

      // Refresh alerts query to show new alert
      queryClient.invalidateQueries({ queryKey: ["alerts"] });

      // Show browser notification if permission is granted
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        const notification = payload.notification || {};
        const title = notification.title || "New Alert";
        const body = notification.body || "";
        const icon = notification.icon || "/favicon.png";

        // Show notification
        const browserNotification = new Notification(title, {
          body,
          icon,
          badge: "/favicon.png",
          tag: payload.data?.alert_id ? `alert-${payload.data.alert_id}` : undefined,
          requireInteraction: false,
        });

        // Handle notification click - focus the window
        browserNotification.onclick = () => {
          window.focus();
          browserNotification.close();
        };
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


import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

const OnlineStatusContext = createContext(true);

export const useOnline = () => useContext(OnlineStatusContext);

export const OnlineStatusProvider = ({ children }: { children: ReactNode }) => {
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof window !== "undefined" && navigator) {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    let isMounted = true;
    let failures = 0;
    let lastVisibleAt = Date.now();
    let isVisible = document.visibilityState === "visible";

    const handleOnline = () => {
      if (isMounted) {
        failures = 0;
        setIsOnline(true);
      }
    };

    const handleOffline = () => {
      if (isMounted) {
        setIsOnline(false);
      }
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === "visible";
      if (isVisible) {
        lastVisibleAt = Date.now();
        failures = 0; // Reset failures when tab becomes visible
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Heartbeat polling for real connectivity detection
    const ping = async () => {
      if (!isMounted) return;
      
      // Skip check if tab is hidden
      if (!isVisible) return;
      
      // Grace period after returning to foreground (avoid false offline on mobile)
      const GRACE_MS = 2000;
      if (Date.now() - lastVisibleAt < GRACE_MS) return;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      try {
        // Use external lightweight ping endpoint; add cache-busting
        const url = new URL("https://www.google.com/generate_204");
        url.searchParams.set("_", String(Date.now()));
        const res = await fetch(url.toString(), {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
          mode: "no-cors", // allow opaque response; reaching endpoint is enough
        });
        // Any resolved response (even opaque) counts as online
        if (!res) {
          throw new Error("Ping failed");
        }
        if (isMounted) {
          failures = 0;
          setIsOnline(true);
        }
      } catch {
        if (isMounted) {
          failures++;
          // Require 5 consecutive failures before declaring offline
          if (failures >= 5) {
            setIsOnline(false);
          }
        }
      } finally {
        clearTimeout(timeout);
      }
    };

    const pollInterval = setInterval(ping, 2000);
    // Kick an initial ping immediately
    void ping();

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={isOnline}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

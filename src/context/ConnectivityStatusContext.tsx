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

    const handleOnline = () => {
      if (isMounted) {
        setIsOnline(true);
      }
    };

    const handleOffline = () => {
      if (isMounted) {
        setIsOnline(false);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Heartbeat polling for real connectivity detection
    const ping = async () => {
      if (!isMounted) return;
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
        if (isMounted) setIsOnline(true);
      } catch {
        if (isMounted) setIsOnline(false);
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
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={isOnline}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

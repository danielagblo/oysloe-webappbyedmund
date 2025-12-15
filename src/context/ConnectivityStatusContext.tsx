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

    // Fetch-based polling for real network detection
    const pollInterval = setInterval(async () => {
      if (isMounted) {
        try {
          await fetch(window.location.href, {
            method: "HEAD",
            cache: "no-store",
            mode: "cors",
          });
          if (isMounted) {
            setIsOnline(true);
          }
        } catch (error) {
          if (isMounted) {
            setIsOnline(false);
          }
        }
      }
    }, 2000);

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

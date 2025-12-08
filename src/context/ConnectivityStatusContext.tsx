import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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
        console.log("Connection restored");
        setIsOnline(true);
      }
    };

    const handleOffline = () => {
      if (isMounted) {
        console.log("Connection lost");
        setIsOnline(false);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const initialCheckTimeout = setTimeout(() => {
      if (isMounted && navigator.onLine !== isOnline) {
        setIsOnline(navigator.onLine);
      }
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(initialCheckTimeout);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isOnline]);

  return (
    <OnlineStatusContext.Provider value={isOnline}>
      {children}
    </OnlineStatusContext.Provider>
  );
};

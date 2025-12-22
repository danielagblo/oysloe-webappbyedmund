import { useEffect, useState } from "react";

const useIsSmallScreen = (maxWidth = 768) => {
  const [isSmall, setIsSmall] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= maxWidth : false,
  );

  useEffect(() => {
    const handler = () => setIsSmall(window.innerWidth <= maxWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [maxWidth]);

  return isSmall;
};

export default useIsSmallScreen;

import { useEffect, useState } from "react";

const useScrollFade = (containerId: string) => {
  const [maskStyle, setMaskStyle] = useState<string>(
    "linear-gradient(to right, black 100%)"
  );

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const updateMask = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;

      // Check if content is scrollable
      if (maxScroll <= 0) {
        setMaskStyle("linear-gradient(to right, black 100%)");
        return;
      }

      const atStart = scrollLeft <= 5;
      const atEnd = scrollLeft >= maxScroll - 5;

      let gradient = "";
      if (atStart && !atEnd) {
        // Only fade on right
        gradient = "linear-gradient(to right, black 0%, black 92%, transparent 100%)";
      } else if (atEnd && !atStart) {
        // Only fade on left
        gradient = "linear-gradient(to right, transparent 0%, black 8%, black 100%)";
      } else if (!atStart && !atEnd) {
        // Fade on both sides
        gradient = "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)";
      } else {
        // No fade needed (shouldn't happen but safety)
        gradient = "linear-gradient(to right, black 100%)";
      }

      setMaskStyle(gradient);
    };

    // Initial check
    updateMask();

    // Listen to scroll events
    container.addEventListener("scroll", updateMask, { passive: true });
    // Also update on resize in case content changes
    window.addEventListener("resize", updateMask, { passive: true });

    return () => {
      container.removeEventListener("scroll", updateMask);
      window.removeEventListener("resize", updateMask);
    };
  }, [containerId]);

  return maskStyle;
};

export default useScrollFade;

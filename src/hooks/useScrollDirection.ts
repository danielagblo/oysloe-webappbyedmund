import { useEffect, useRef, useState } from "react";

/**
 * Returns 'up' or 'down' as the user scrolls. Only triggers on vertical scroll, and debounces rapid changes.
 * Optionally accepts a threshold (px) before direction changes.
 */
export function useScrollDirection({ threshold = 4 } = {}) {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(window.scrollY);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      const scrollY = window.scrollY;
      const diff = scrollY - lastScrollY.current;
      if (Math.abs(diff) > threshold) {
        setDirection(diff > 0 ? 'down' : 'up');
        lastScrollY.current = scrollY;
      }
      ticking.current = false;
    };
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(update);
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return direction;
}

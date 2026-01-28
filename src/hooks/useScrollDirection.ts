import { useEffect, useRef, useState } from "react";

/**
 * Returns 'up' or 'down' as the user scrolls. Only triggers on vertical scroll, and debounces rapid changes.
 * Optionally accepts a threshold (px) before direction changes.
 */
export function useScrollDirection({ threshold = 2 } = {}) {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(window.scrollY);
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > lastScrollY.current + threshold) {
        setDirection('down');
      } else if (scrollY < lastScrollY.current - threshold) {
        setDirection('up');
      }
      lastScrollY.current = scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
  return direction;
}

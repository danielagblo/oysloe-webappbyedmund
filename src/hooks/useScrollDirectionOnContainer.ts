import { useEffect, useRef, useState } from "react";

/**
 * Detects scroll direction ('up' or 'down') on a given element or window.
 * Pass a ref to the scrollable element, or null/undefined to use window.
 */
export function useScrollDirectionOnContainer(containerRef?: React.RefObject<HTMLElement>, { threshold = 2 } = {}) {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const el = containerRef?.current || window;
    const getScrollY = () =>
      el === window ? window.scrollY : (el as HTMLElement).scrollTop;
    lastScrollY.current = getScrollY();
    const onScroll = () => {
      const scrollY = getScrollY();
      if (scrollY > lastScrollY.current + threshold) {
        setDirection('down');
      } else if (scrollY < lastScrollY.current - threshold) {
        setDirection('up');
      }
      lastScrollY.current = scrollY;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [containerRef, threshold]);
  return direction;
}

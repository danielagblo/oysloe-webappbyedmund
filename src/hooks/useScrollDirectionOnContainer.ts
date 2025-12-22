import { useEffect, useRef, useState } from "react";

// Helper to determine if an element is visible
function isVisible(el: Element) {
  if (!(el instanceof HTMLElement)) return false;
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
}

// Find a reasonable scrollable container on the page when none is provided.
function findScrollableContainer(): HTMLElement | Window {
  // Prefer explicit id
  const byId = document.getElementById('main-scroll');
  if (byId && isVisible(byId)) return byId;

  // Prefer <main>
  const main = document.querySelector('main');
  if (main && isVisible(main) && (main.scrollHeight > main.clientHeight)) return main as HTMLElement;

  // Look for any element that scrolls vertically
  const candidates = Array.from(document.querySelectorAll('body *')) as Element[];
  for (const c of candidates) {
    if (!(c instanceof HTMLElement)) continue;
    try {
      const style = window.getComputedStyle(c);
      const overflowY = style.overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') && c.scrollHeight > c.clientHeight && isVisible(c)) {
        return c as HTMLElement;
      }
    } catch (e) {
      // ignore cross-origin or computed style errors
    }
  }

  // Fallback to window
  return window;
}

/**
 * Detects scroll direction ('up' or 'down') on an optional container (HTMLElement or window).
 * If no container is provided, it will auto-detect the most likely scrollable container on the page.
 */
export function useScrollDirectionOnContainer(containerRef?: React.RefObject<HTMLElement> | null, { threshold = 2 } = {}) {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const lastScroll = useRef(0);
  const attachedRef = useRef<HTMLElement | Window | null>(null);

  useEffect(() => {
    const resolved = (containerRef && containerRef.current) || findScrollableContainer();
    attachedRef.current = resolved;

    const getPos = () => (resolved === window ? window.scrollY : (resolved as HTMLElement).scrollTop);
    lastScroll.current = getPos();

    const onScroll = () => {
      const pos = getPos();
      if (pos > lastScroll.current + threshold) {
        setDirection('down');
      } else if (pos < lastScroll.current - threshold) {
        setDirection('up');
      }
      lastScroll.current = pos;
    };

    // attach listener
    try {
      attachedRef.current.addEventListener('scroll', onScroll as EventListener, { passive: true } as any);
    } catch (e) {
      // if attached to window, fallback to window.addEventListener
      window.addEventListener('scroll', onScroll as EventListener, { passive: true });
    }

    return () => {
      try {
        attachedRef.current?.removeEventListener('scroll', onScroll as EventListener);
      } catch (e) {
        window.removeEventListener('scroll', onScroll as EventListener);
      }
    };
  }, [containerRef, threshold]);

  return direction;
}

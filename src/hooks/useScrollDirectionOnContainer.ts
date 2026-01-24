import { useEffect, useRef, useState } from "react";

// Helper to determine if an element is visible
function isVisible(el: Element) {
  if (!(el instanceof HTMLElement)) return false;
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
}

// Find scrollable containers on the page when none is provided.
function findScrollableContainersAll(max = 8): Array<HTMLElement | Window> {
  const out: Array<HTMLElement | Window> = [];
  // Prefer explicit id — include it as a candidate even if not obviously scrollable
  const byId = document.getElementById('main-scroll');
  if (byId && isVisible(byId)) {
    try {
      out.push(byId as HTMLElement);
    } catch (e) {
      // ignore
    }
  }

  // Prefer <main>
  const main = document.querySelector('main');
  if (main && isVisible(main) && (main.scrollHeight > main.clientHeight)) out.push(main as HTMLElement);

  // Look for other elements that scroll vertically
  const candidates = Array.from(document.querySelectorAll('body *')) as Element[];
  for (const c of candidates) {
    if (out.length >= max) break;
    if (!(c instanceof HTMLElement)) continue;
    try {
      const style = window.getComputedStyle(c);
      const overflowY = style.overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') && c.scrollHeight > c.clientHeight && isVisible(c) && !out.includes(c as HTMLElement)) {
        out.push(c as HTMLElement);
      }
    } catch (e) {
      // ignore
    }
  }

  // include document.scrollingElement if useful
  try {
    const se = document.scrollingElement as HTMLElement | null;
    if (se && isVisible(se) && se.scrollHeight > se.clientHeight && !out.includes(se)) out.push(se);
  } catch (e) {}

  // finally add window as last fallback
  out.push(window);
  return out;
}

/**
 * Detects scroll direction ('up' or 'down') on an optional container (HTMLElement or window).
 * If no container is provided, it will auto-detect the most likely scrollable container on the page.
 */
export function useScrollDirectionOnContainer(containerRef?: React.RefObject<HTMLElement> | null, { threshold = 2 } = {}) {
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  const lastDirection = useRef<'up' | 'down'>('up');
  const attachedRef = useRef<HTMLElement | Window | null>(null);
  const debug = typeof window !== 'undefined' && (
    Boolean((window as any).__DEBUG_SCROLL_DIRECTION) ||
    (typeof window.location !== 'undefined' && window.location.search.indexOf('debugScroll=1') !== -1) ||
    (typeof window.location !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) ||
    (typeof window.location !== 'undefined' && window.location.hostname.startsWith('192.168.')) ||
    (typeof window.location !== 'undefined' && window.location.hostname.startsWith('10.')) ||
    // Vite dev flag
    (typeof import.meta !== 'undefined' && Boolean((import.meta as any).env && (import.meta as any).env.DEV))
  );
  // Debugging logs — output to console when enabled
  const appendDebug = (msg: string) => {
    if (!debug) return;
    try {
      console.log(msg);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    const candidates = (containerRef && containerRef.current) ? [containerRef.current] : findScrollableContainersAll(10);
    attachedRef.current = candidates[0] || window;

    const getPosFor = (el: HTMLElement | Window | VisualViewport) => {
      if (el === window) return window.scrollY;
      // VisualViewport has pageTop
      if (typeof (el as VisualViewport).pageTop === 'number') return (el as VisualViewport).pageTop as number;
      return (el as HTMLElement).scrollTop;
    };

    const lastPos: number[] = candidates.map((c) => getPosFor(c as any));

      if (debug) {
        const descs = candidates.map((c) => {
          if (c === window) return 'window';
          try {
            const el = c as HTMLElement;
            const style = window.getComputedStyle(el);
            const overflow = style.overflowY;
            const sh = el.scrollHeight;
            const ch = el.clientHeight;
            const rect = el.getBoundingClientRect();
            return `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''} (overflow:${overflow} sh:${sh} ch:${ch} top:${Math.round(rect.top)})`;
          } catch (e) {
            return (c === window ? 'window' : 'el');
          }
        });
        console.log('[scroll-debug] candidates:', descs, candidates);
        appendDebug(`[scroll-debug] candidates: ${descs.join('; ')}`);
      }

    const handlers: Array<() => void> = [];

    const makeHandler = (idx: number, c: HTMLElement | Window | VisualViewport) => {
      return () => {
        try {
          const pos = getPosFor(c as any);
          const prev = lastPos[idx] ?? pos;
          if (pos > prev + threshold) {
            if (lastDirection.current !== 'down') {
              lastDirection.current = 'down';
              setDirection('down');
              if (debug) appendDebug(`[scroll-debug] dir -> down from ${idx}`);
            }
          } else if (pos < prev - threshold) {
            if (lastDirection.current !== 'up') {
              lastDirection.current = 'up';
              setDirection('up');
              if (debug) appendDebug(`[scroll-debug] dir -> up from ${idx}`);
            }
          }
          lastPos[idx] = pos;
        } catch (e) {
          // ignore
        }
      };
    };

    // attach listeners to all candidates and visualViewport
    candidates.forEach((c, i) => {
      const handler = makeHandler(i, c as any);
      handlers.push(handler);
      try {
        if (c === window) window.addEventListener('scroll', handler as EventListener, { passive: true } as any);
        else (c as HTMLElement).addEventListener('scroll', handler as EventListener, { passive: true } as any);
      } catch (e) {
        // ignore
      }
    });

    // visualViewport
    let vvHandler: (() => void) | null = null;
    if (typeof window !== 'undefined' && (window as any).visualViewport) {
      const vv = (window as any).visualViewport as VisualViewport;
      vvHandler = makeHandler(candidates.length, vv as any);
      try {
        vv.addEventListener('scroll', vvHandler as EventListener);
      } catch (e) {}
    }

    // Touch/wheel fallback: detect direction from touchmove or wheel even if scrollTop doesn't change
    const touchStartY = { current: NaN };
    const onTouchStart = (ev: TouchEvent) => {
      try { touchStartY.current = ev.touches[0].clientY; } catch (e) { touchStartY.current = NaN; }
    };
    const onTouchMove = (ev: TouchEvent) => {
      try {
        const y = ev.touches[0].clientY;
        if (Number.isNaN(touchStartY.current)) { touchStartY.current = y; return; }
        const diff = touchStartY.current - y;
        if (Math.abs(diff) > threshold) {
          const newDir = diff > 0 ? 'down' : 'up';
          if (newDir !== lastDirection.current) {
            lastDirection.current = newDir;
            setDirection(newDir);
            if (debug) appendDebug(`[scroll-debug] touch -> ${newDir} diff=${Math.round(diff)}`);
          }
          touchStartY.current = y;
        }
      } catch (e) {}
    };
    const onWheel = (ev: WheelEvent) => {
      try {
        const dy = ev.deltaY;
        if (Math.abs(dy) > 0) {
          const newDir = dy > 0 ? 'down' : 'up';
          if (newDir !== lastDirection.current) {
            lastDirection.current = newDir;
            setDirection(newDir);
            if (debug) appendDebug(`[scroll-debug] wheel -> ${newDir} dy=${Math.round(dy)}`);
          }
        }
      } catch (e) {}
    };
    try { document.addEventListener('touchstart', onTouchStart, { passive: true } as any); } catch (e) {}
    try { document.addEventListener('touchmove', onTouchMove, { passive: true } as any); } catch (e) {}
    try { document.addEventListener('wheel', onWheel, { passive: true } as any); } catch (e) {}

    // polling fallback: sample positions every 150ms for up to 5s
    let polling = true;
    console.log(`[scroll-debug] ${polling ? "started" : "ended"} polling for scroll position changes`);
    const pollInterval = setInterval(() => {
      try {
        candidates.forEach((c, i) => {
          const pos = getPosFor(c as any);
          if (pos !== lastPos[i]) {
            handlers[i]();
          }
        });
        if ((window as any).visualViewport && vvHandler) {
          const pos = (window as any).visualViewport.pageTop;
          const idx = candidates.length;
          const prev = lastPos[idx];
          if (prev === undefined || pos !== prev) {
            vvHandler();
            lastPos[idx] = pos;
          }
        }
      } catch (e) {}
    }, 150);
    // stop polling after 5s to reduce overhead
    const stopPollingTimeout = setTimeout(() => {
      clearInterval(pollInterval);
      polling = false;
      if (debug) appendDebug('[scroll-debug] stopped polling');
    }, 5000);

    return () => {
      // remove listeners
      candidates.forEach((c, i) => {
        try {
          if (c === window) window.removeEventListener('scroll', handlers[i] as EventListener);
          else (c as HTMLElement).removeEventListener('scroll', handlers[i] as EventListener);
        } catch (e) {}
      });
      if ((window as any).visualViewport && vvHandler) {
        try { (window as any).visualViewport.removeEventListener('scroll', vvHandler as EventListener); } catch (e) {}
      }
      try { document.removeEventListener('touchstart', onTouchStart as EventListener); } catch (e) {}
      try { document.removeEventListener('touchmove', onTouchMove as EventListener); } catch (e) {}
      try { document.removeEventListener('wheel', onWheel as EventListener); } catch (e) {}
      clearInterval(pollInterval);
      clearTimeout(stopPollingTimeout);
      if (debug) {
        console.log('[scroll-debug] removed multi listeners');
        appendDebug('[scroll-debug] removed multi listeners');
      }
    };
  }, [containerRef, threshold]);

  return direction;
}

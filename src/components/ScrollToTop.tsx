import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const MOBILE_BREAKPOINT = 640;

function isDebugScroll() {
  try {
    return (
      (typeof window !== "undefined" && window.location.search.includes("debugScroll=1")) ||
      (typeof import.meta !== "undefined" && Boolean((import.meta as any).env?.DEV)) ||
      true // Always enable debug for now to troubleshoot
    );
  } catch {
    return false;
  }
}

function isMobileViewport() {
  return window.innerWidth < MOBILE_BREAKPOINT;
}

function isReloadNavigation() {
  try {
    const entries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const nav = entries?.[0];
    if (nav && typeof nav.type === "string") return nav.type === "reload";
  } catch {
    // ignore
  }

  // Legacy fallback
  try {
    const legacy = (performance as any).navigation;
    if (legacy && typeof legacy.type === "number") return legacy.type === 1;
  } catch {
    // ignore
  }

  return false;
}

function isElementVisible(el: Element) {
  if (!(el instanceof HTMLElement)) return false;
  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  if (el.offsetParent === null && style.position !== "fixed") return false;
  return true;
}

function scrollToDataTarget(target: string) {
  const nodes = Array.from(
    document.querySelectorAll(`[data-scroll-target="${CSS.escape(target)}"]`),
  );
  const visible = nodes.find(isElementVisible) as HTMLElement | undefined;
  if (!visible) return false;
  // Seller Ads button can sit under a sticky mobile header; center it to avoid overshooting.
  const block = target === "seller-ads-button" ? "center" : "start";
  visible.scrollIntoView({ block, behavior: "auto" });
  return true;
}

function scrollToAnchorHref(href: string) {
  const exact = document.querySelector(`a[href="${CSS.escape(href)}"]`) as HTMLElement | null;
  if (exact && isElementVisible(exact)) {
    exact.scrollIntoView({ block: "center", behavior: "auto" });
    return true;
  }

  // Try ends-with match for relative vs absolute differences
  const allLinks = Array.from(document.querySelectorAll("a[href]")) as HTMLAnchorElement[];
  const found = allLinks.find((a) => a.getAttribute("href")?.endsWith(href));
  if (found && isElementVisible(found)) {
    found.scrollIntoView({ block: "center", behavior: "auto" });
    return true;
  }

  return false;
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const isFirstMountRef = useRef(true);
  const isMobileRef = useRef(isMobileViewport());
  const debugRef = useRef(isDebugScroll());

  useEffect(() => {
    const onResize = () => {
      isMobileRef.current = isMobileViewport();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Capture where the user clicked BEFORE navigation (works even if scrollY is unreliable).
  useEffect(() => {
    const onClickCapture = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a") as HTMLAnchorElement | null;
      if (!link) return;

      const hrefAttr = link.getAttribute("href") || "";
      if (!hrefAttr) return;

      // Save the anchor href so that when we come back to this path, we can scroll to the clicked card.
      sessionStorage.setItem(`scroll:anchorHref:path:${pathname}`, hrefAttr);

      // Best-effort numeric fallback (may be 0 in this app; that's ok).
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      sessionStorage.setItem(`scroll:savedY:path:${pathname}`, String(y));

      if (debugRef.current) {
        // eslint-disable-next-line no-console
        console.log("[scroll-debug] saved", { from: pathname, href: hrefAttr, y, isMobile: isMobileRef.current });
      }
    };

    document.addEventListener("click", onClickCapture, true);
    return () => document.removeEventListener("click", onClickCapture, true);
  }, [pathname]);

  useEffect(() => {
    const applyScrollTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Refresh/first load should go to top.
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      applyScrollTop();
      return;
    }
    if (isReloadNavigation()) {
      applyScrollTop();
      return;
    }

    // Only restore on back (POP navigation).
    if (navigationType !== "POP") {
      applyScrollTop();
      return;
    }

    // *** SCROLL RESTORATION FOR BACK NAVIGATION ***
    const popTargetKey = `scroll:popTarget:path:${pathname}`;
    const anchorKey = `scroll:anchorHref:path:${pathname}`;
    const yKey = `scroll:savedY:path:${pathname}`;

    const popTarget = sessionStorage.getItem(popTargetKey);
    const anchorHref = sessionStorage.getItem(anchorKey);
    const savedYRaw = sessionStorage.getItem(yKey);
    const savedY = savedYRaw ? Number(savedYRaw) : 0;

    if (debugRef.current) {
      // eslint-disable-next-line no-console
      console.log("[scroll-debug] BACK navigation detected", {
        path: pathname,
        popTarget,
        anchorHref,
        savedY,
      });
    }

    // Use requestAnimationFrame for smoother, frame-based restoration
    let frameCount = 0;
    const maxFrames = 60; // Up to 1 second at 60fps
    
    const restoreFrame = () => {
      frameCount++;
      
      const didTarget = popTarget ? scrollToDataTarget(popTarget) : false;
      const didAnchor = !didTarget && anchorHref ? scrollToAnchorHref(anchorHref) : false;
      
      if (debugRef.current && frameCount % 10 === 0) {
        // eslint-disable-next-line no-console
        console.log("[scroll-debug] frame", frameCount, {
          didTarget,
          didAnchor,
          currentY: window.scrollY,
          targetY: savedY,
        });
      }
      
      if (!didTarget && !didAnchor && savedY > 0) {
        window.scrollTo(0, savedY);
      }
      
      if (frameCount < maxFrames && !didTarget && !didAnchor) {
        requestAnimationFrame(restoreFrame);
      } else {
        // Cleanup
        if (popTarget) sessionStorage.removeItem(popTargetKey);
        if (anchorHref) sessionStorage.removeItem(anchorKey);
        if (savedYRaw) sessionStorage.removeItem(yKey);
        
        if (debugRef.current) {
          // eslint-disable-next-line no-console
          console.log("[scroll-debug] restoration complete at frame", frameCount, "final Y:", window.scrollY);
        }
      }
    };
    
    requestAnimationFrame(restoreFrame);
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import OfflineModal from "./components/OfflineModal.tsx";
import Toaster from "./components/Toaster";
import { OnlineStatusProvider } from "./context/ConnectivityStatusContext.tsx";
import "./index.css";
import { queryClient } from "./queryClient";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <Helmet>
        <meta name="robots" content="index, follow" />
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <OnlineStatusProvider>
          <BrowserRouter>
            <App />
            <Toaster />
            <OfflineModal />
          </BrowserRouter>
        </OnlineStatusProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
);

// Listen for messages from the service worker instructing the page to
// schedule auto-closing notifications (used when the page is open).
if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (evt: MessageEvent) => {
    try {
      const data = evt.data;
      if (!data || data.type !== 'NOTIFICATION_DISPLAYED') return;
      const url = data.url;
      // Close matching notifications immediately (page is open and active)
      (async () => {
        try {
          const reg = await navigator.serviceWorker.getRegistration();
          if (!reg) return;
          const notifs = await reg.getNotifications();
          for (const n of notifs) {
            if (!url || (n.data && n.data.url === url)) {
              try { n.close(); } catch (e) { /* ignore */ }
            }
          }
        } catch (e) {
          /* ignore */
        }
      })();
    } catch (e) {
      /* ignore */
    }
  });
}

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import Toaster from "./components/Toaster";
import "./index.css";
import { queryClient } from "./queryClient";
import { OnlineStatusProvider } from "./context/ConnectivityStatusContext.tsx";
import OfflineModal from "./components/OfflineModal.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
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
  </StrictMode>,
);

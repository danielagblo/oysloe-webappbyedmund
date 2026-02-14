import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { imagetools } from "vite-imagetools";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(), imagetools()],
  server: {
    proxy: {
      "/api-v1": {
        target: "https://api.oysloe.com/api-v1/",
        changeOrigin: true,
        secure: false,
      },
    },
    allowedHosts: ["electrophotographic-autumnally-salvatore.ngrok-free.dev"]
  },
});

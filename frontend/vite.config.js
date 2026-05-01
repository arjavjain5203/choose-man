import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: "0.0.0.0",
    proxy: {
      "^/question$": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "^/question/[a-zA-Z0-9-]+$": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "^/answer$": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/ws": {
        target: "ws://127.0.0.1:8000",
        ws: true,
      },
    },
  },
});

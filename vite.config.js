import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Full URL of the backend. Only used by the dev/preview proxy, never shipped to the browser.
  const target = env.VITE_BACKEND_URL || "http://localhost:7777";

  // The app always calls /api/*; strip the prefix and forward to the backend
  // so the auth cookie stays same-origin. In production the web server
  // (nginx, see README) does the same job.
  const proxy = {
    "/api": {
      target,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  };

  return {
    plugins: [react(), tailwindcss()],
    server: { port: 5173, proxy },
    preview: { port: 4173, proxy },
  };
});

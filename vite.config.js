import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: ".",
  build: {
    outDir: "dist",
    chunkSizeWarningLimit: 3000,
    minify: "esbuild",
    rollupOptions: {
      input: "./index.html",
      output: {
        // Split vendor libraries into their own chunk. These change far less often than app.jsx,
        // so on a normal app update (edit App.jsx, redeploy) returning users' browsers can reuse
        // their already-cached React/Supabase chunk instead of re-downloading it — the immutable
        // cache headers in vercel.json make this safe since each chunk's filename is content-hashed.
        manualChunks: {
          vendor: ["react", "react-dom"],
          supabase: ["@supabase/supabase-js"]
        }
      }
    }
  },
});

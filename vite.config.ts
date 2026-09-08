import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Use VITE_BASE=/mesaperet/ for GitHub Pages project deploys
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
  server: {
    port: 5173,
  },
  preview: {
    port: 4173,
  },
});

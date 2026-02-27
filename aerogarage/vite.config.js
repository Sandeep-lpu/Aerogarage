import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    allowedHosts: [".loca.lt", ".trycloudflare.com"],
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: [".loca.lt", ".trycloudflare.com"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react-vendor";
          }

          if (id.includes("node_modules/axios")) {
            return "network-vendor";
          }

          if (id.includes("node_modules/three")) return "three-core";
          if (id.includes("node_modules/@react-three/fiber")) return "three-fiber";
          if (id.includes("node_modules/@react-three/drei")) return "three-drei";
        },
      },
    },
  },
});

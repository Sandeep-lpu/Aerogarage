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
    // Inline small assets to reduce HTTP round-trips
    assetsInlineLimit: 8192,
    // Drop console/debugger in prod for smaller output
    minify: "esbuild",
    // No source maps in prod – saves bandwidth
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "react-vendor";
          }
          if (id.includes("node_modules/axios")) {
            return "network-vendor";
          }
          // Split Three.js ecosystem into fine-grained chunks for better caching
          if (id.includes("node_modules/three")) return "three-core";
          if (id.includes("node_modules/@react-three/fiber")) return "three-fiber";
          if (id.includes("node_modules/@react-three/drei")) return "three-drei";
        },
      },
    },
  },
});

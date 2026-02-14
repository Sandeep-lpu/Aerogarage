import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three-core'
          if (id.includes('node_modules/@react-three/fiber')) return 'three-fiber'
          if (id.includes('node_modules/@react-three/drei')) return 'three-drei'
        },
      },
    },
  },
})

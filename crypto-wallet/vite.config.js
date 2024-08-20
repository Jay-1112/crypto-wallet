import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { Buffer } from 'buffer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      buffer: fileURLToPath(new URL('./node_modules/buffer/', import.meta.url)),
    },
  },
  define: {
    'process.env': {},
    global: {}, // Ensure `global` is available if needed by your dependencies
    Buffer: Buffer, // Provide Buffer polyfill globally
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/brad-playground/', // Make sure this matches your GitHub repo name
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './client',
  build: {
    outDir: './dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './client/index.html', // Явно вказуємо вхідну точку
    },
  },
});


// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // whenever code does `import process from 'process'`, use the browser version
      process: 'process/browser',
    },
  },
  server: {
    host: true,       // listen on 0.0.0.0
    port: 5173,       // or whatever port you use
  },

  define: {
    // legacy globals for Simple-Peer / randombytes
    global: 'globalThis',
    'process.env': {},            // shim out any `process.env.X` lookups
  },
});


